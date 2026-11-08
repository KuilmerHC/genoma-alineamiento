"""Genera versiones .docx editables (para Google Drive / Word) de los documentos del proyecto.

Uso (desde la raíz del repo):  python docs/word/generar_word.py
Requiere: la herramienta make-pdf (convierte Markdown → .docx; ruta en MAKE_PDF) y lxml.

Después de convertir, ajusta cada .docx:
  - márgenes de 1 pulgada y Arial como fuente del cuerpo;
  - anchos de columna de las tablas según su contenido, en DXA (Google Docs rompe los anchos
    en porcentaje): ninguna cifra ni palabra queda partida si cabe;
  - bloques de código con sus saltos de línea (la conversión los junta en una sola línea).
La portada se agrega a mano en Word / Google Docs.
"""

import os
import re
import shutil
import subprocess
import tempfile
import zipfile

from lxml import etree

AQUI = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.dirname(AQUI)
MAKE_PDF = os.environ.get("MAKE_PDF", os.path.expanduser("~/.claude/skills/gstack/make-pdf/dist/pdf"))

DOCUMENTOS = [  # (markdown, docx)
    ("analisis_teorico_c1_c3.md", "analisis_teorico_c1_c3.docx"),
    ("avance_sesion2.md", "avance_sesion2.docx"),
    ("plan_experimentos.md", "plan_experimentos.docx"),
    ("informe.md", "informe.docx"),
]

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"w": W}
q = lambda etiqueta: "{%s}%s" % (W, etiqueta)  # noqa: E731

MARGEN = 1440                 # 1 pulgada
ANCHO_TEXTO = 12240 - 2 * MARGEN  # carta: 8,5 in − 2 in = 9360 DXA
DXA_POR_CARACTER = 122        # ≈ ancho de un dígito/letra de Arial 11 pt (6,1 pt)
MARGEN_CELDA = 100            # margen interno izquierdo y derecho de cada celda
RELLENO_CELDA = 2 * MARGEN_CELDA + 60


# ---------------------------------------------------------------- tablas
def texto_celda(tc):
    return "".join(tc.itertext()).strip()


def ajustar_tabla(tbl):
    filas = tbl.findall("w:tr", NS)
    if not filas:
        return
    ncol = max(len(f.findall("w:tc", NS)) for f in filas)
    palabra_max = [1] * ncol   # carácter más largo sin corte posible (los NBSP no cortan)
    total_max = [1] * ncol     # texto más largo de la columna
    for f in filas:
        for c, tc in enumerate(f.findall("w:tc", NS)):
            t = texto_celda(tc)
            palabras = re.split(r"[ \t\n]+", t) if t else [""]
            palabra_max[c] = max(palabra_max[c], max(len(p) for p in palabras))
            total_max[c] = max(total_max[c], len(t))
    minimo = [p * DXA_POR_CARACTER + RELLENO_CELDA for p in palabra_max]
    deseado = [max(minimo[c], t * DXA_POR_CARACTER + RELLENO_CELDA) for c, t in enumerate(total_max)]
    if sum(deseado) <= ANCHO_TEXTO:
        anchos = [d * ANCHO_TEXTO / sum(deseado) for d in deseado]
    elif sum(minimo) <= ANCHO_TEXTO:
        resto = ANCHO_TEXTO - sum(minimo)
        extra = [deseado[c] - minimo[c] for c in range(ncol)]
        anchos = [minimo[c] + resto * extra[c] / sum(extra) for c in range(ncol)]
    else:
        anchos = [m * ANCHO_TEXTO / sum(minimo) for m in minimo]
    anchos = [int(a) for a in anchos]
    anchos[-1] += ANCHO_TEXTO - sum(anchos)

    tblPr = tbl.find("w:tblPr", NS)
    for viejo in tblPr.findall("w:tblW", NS) + tblPr.findall("w:tblLayout", NS):
        tblPr.remove(viejo)
    tblW = etree.SubElement(tblPr, q("tblW"))
    tblW.set(q("w"), str(ANCHO_TEXTO))
    tblW.set(q("type"), "dxa")
    layout = etree.SubElement(tblPr, q("tblLayout"))
    layout.set(q("type"), "fixed")
    # Una sola definición de columnas, justo después de tblPr (la conversión deja una repetida).
    for g in tbl.findall("w:tblGrid", NS):
        tbl.remove(g)
    grid = etree.Element(q("tblGrid"))
    tbl.insert(list(tbl).index(tblPr) + 1, grid)
    for a in anchos:
        g = etree.SubElement(grid, q("gridCol"))
        g.set(q("w"), str(a))
    for mar in tblPr.findall("w:tblCellMar", NS):
        for lado in mar:
            if etree.QName(lado).localname in ("left", "right", "start", "end"):
                lado.set(q("w"), str(MARGEN_CELDA))
    ordenar_hijos(tblPr, ORDEN_TBLPR)
    for f in filas:
        for c, tc in enumerate(f.findall("w:tc", NS)):
            tcPr = tc.find("w:tcPr", NS)
            if tcPr is None:
                tcPr = etree.Element(q("tcPr"))
                tc.insert(0, tcPr)
            for viejo in tcPr.findall("w:tcW", NS):
                tcPr.remove(viejo)
            tcW = etree.Element(q("tcW"))
            tcW.set(q("w"), str(anchos[c]))
            tcW.set(q("type"), "dxa")
            tcPr.insert(0, tcW)
    # bordes y márgenes de celda en el orden del esquema (top, left, bottom, right, …)
    for etiqueta in ("tblBorders", "tcBorders", "tblCellMar", "tcMar"):
        for nodo in tbl.iter(q(etiqueta)):
            ordenar_hijos(nodo, ORDEN_LADOS)


# Orden de los hijos que exige el esquema de OOXML (Word marca el archivo como inválido si no).
ORDEN_TBLPR = ["tblStyle", "tblpPr", "tblOverlap", "bidiVisual", "tblStyleRowBandSize",
               "tblStyleColBandSize", "tblW", "jc", "tblCellSpacing", "tblInd", "tblBorders", "shd",
               "tblLayout", "tblCellMar", "tblLook", "tblCaption", "tblDescription"]
ORDEN_LADOS = ["top", "start", "left", "bottom", "end", "right", "insideH", "insideV", "tl2br", "tr2bl"]


def ordenar_hijos(nodo, orden):
    pos = {nombre: i for i, nombre in enumerate(orden)}
    hijos = list(nodo)
    hijos.sort(key=lambda h: pos.get(etree.QName(h).localname, len(orden)))
    for h in hijos:
        nodo.remove(h)
    for h in hijos:
        nodo.append(h)


# ---------------------------------------------------------------- bloques de código
def normalizar(texto):
    return re.sub(r"\s+", " ", texto).strip()


def restaurar_codigo(cuerpo, markdown):
    """La conversión junta cada bloque de código en una sola línea. Se busca el bloque original
    del Markdown con el mismo texto y se reconstruye con un salto de línea por renglón."""
    bloques = {}
    for m in re.finditer(r"^```([^\n]*)\n(.*?)^```", markdown, re.S | re.M):
        if not m.group(1).strip().startswith("mermaid"):
            bloques[normalizar(m.group(2))] = m.group(2).rstrip("\n")
    restaurados = 0
    for p in cuerpo.iter(q("p")):
        runs = p.findall("w:r", NS)
        if not runs or not all(r.find("w:rPr/w:rFonts", NS) is not None
                               and "Courier" in (r.find("w:rPr/w:rFonts", NS).get(q("ascii")) or "")
                               for r in runs):
            continue
        original = bloques.get(normalizar("".join(p.itertext())))
        if original is None:
            continue
        for r in runs:
            p.remove(r)
        renglones = original.split("\n")
        # Courier New mide 0,6 em por carácter; el ancho útil es 468 pt (6,5 in).
        # tamaño en medios puntos: 0,3·sz·caracteres ≤ 468  ⇒  sz ≤ 1560 / caracteres
        sz = str(max(14, min(19, 1560 // max(1, max(len(x) for x in renglones)))))
        for i, linea in enumerate(renglones):
            r = etree.SubElement(p, q("r"))
            rPr = etree.SubElement(r, q("rPr"))
            fuentes = etree.SubElement(rPr, q("rFonts"))
            for atributo in ("ascii", "hAnsi", "cs"):
                fuentes.set(q(atributo), "Courier New")
            tam = etree.SubElement(rPr, q("sz"))
            tam.set(q("val"), sz)
            if i > 0:
                etree.SubElement(r, q("br"))
            t = etree.SubElement(r, q("t"))
            t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
            t.text = linea
        restaurados += 1
    return restaurados, len(bloques)


# ---------------------------------------------------------------- proceso
def ajustar_docx(ruta_docx, markdown=""):
    tmp = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(ruta_docx) as z:
            z.extractall(tmp)
        # márgenes y fuente
        doc_path = os.path.join(tmp, "word", "document.xml")
        arbol = etree.parse(doc_path)
        raiz = arbol.getroot()
        for pgMar in raiz.iter(q("pgMar")):
            pgMar.set(q("left"), str(MARGEN))
            pgMar.set(q("right"), str(MARGEN))
            pgMar.set(q("top"), str(MARGEN))
            pgMar.set(q("bottom"), str(MARGEN))
        for tbl in raiz.iter(q("tbl")):
            ajustar_tabla(tbl)
        cuerpo = raiz.find("w:body", NS)
        # La configuración de página (sectPr) tiene que ser el último hijo del cuerpo; la
        # conversión a veces deja párrafos después, y Word lo marca como inválido.
        sect = cuerpo.find("w:sectPr", NS)
        if sect is not None:
            cuerpo.remove(sect)
            cuerpo.append(sect)
        restaurados, total = restaurar_codigo(cuerpo, markdown)
        if restaurados < total:
            print(f"  aviso: {total - restaurados} bloque(s) de código sin restaurar en {os.path.basename(ruta_docx)}")
        arbol.write(doc_path, xml_declaration=True, encoding="UTF-8", standalone=True)

        st_path = os.path.join(tmp, "word", "styles.xml")
        st = open(st_path, encoding="utf-8").read()
        st = re.sub(r'<w:rFonts w:ascii="Times New Roman"[^>]*/>',
                    '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>', st, count=1)
        st = st.replace('<w:lang w:val="en-US"', '<w:lang w:val="es-CO"')
        open(st_path, "w", encoding="utf-8").write(st)

        # reempaquetar sin entradas de carpeta (Google Drive / Word en la nube las rechazan)
        os.remove(ruta_docx)
        with zipfile.ZipFile(ruta_docx, "w", zipfile.ZIP_DEFLATED) as z:
            primero = "[Content_Types].xml"
            z.write(os.path.join(tmp, primero), primero)
            for carpeta, _, archivos in os.walk(tmp):
                for a in archivos:
                    completo = os.path.join(carpeta, a)
                    rel = os.path.relpath(completo, tmp)
                    if rel != primero:
                        z.write(completo, rel)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    for md, docx in DOCUMENTOS:
        salida = os.path.join(AQUI, docx)
        # Copia temporal (en docs/, para que las rutas de las imágenes sigan valiendo) sin negritas
        # ni código dentro de las tablas: la conversión los parte en párrafos sueltos por celda.
        temporal = os.path.join(DOCS, f".tmp_word_{md}")
        texto = open(os.path.join(DOCS, md), encoding="utf-8").read()
        lineas = [l.replace("**", "").replace("`", "") if l.startswith("|") else l for l in texto.split("\n")]
        open(temporal, "w", encoding="utf-8").write("\n".join(lineas))
        try:
            subprocess.run([MAKE_PDF, "generate", "--quiet", "--to", "docx", temporal, salida],
                           check=True, stdout=subprocess.DEVNULL)
        finally:
            os.remove(temporal)
        ajustar_docx(salida, texto)
        print(salida)


if __name__ == "__main__":
    main()
