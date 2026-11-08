"""Antepone la portada institucional a los PDF del informe y del avance.

Uso (desde la raíz del repo), DESPUÉS de generar docs/pdf/informe.pdf y docs/pdf/avance_sesion2.pdf:
    python docs/portadas/agregar_portadas.py

Dibuja cada portada desde HTML con Chromium (sin encabezado ni pie de página) y la une al
inicio del PDF con `pdfunite` (poppler). Si un PDF ya tiene la portada, no la repite.
Para cambiar el escudo, reemplazar docs/portadas/escudo_usa.png por una imagen de mejor calidad.
"""

import glob
import html
import os
import shutil
import subprocess
import tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
DIR_PDF = os.path.join(AQUI, "..", "pdf")

AUTORES = [  # orden alfabético por apellido, como en la plantilla del curso
    ("Berrio Juan", "juan.berrio01@usa.edu.co"),
    ("Hernández Kuilmer", "kuilmer.hernandez01@usa.edu.co"),
    ("Serrano Santiago", "santiago.serrano01@usa.edu.co"),
]
FECHA = "Noviembre, 2026"

DOCUMENTOS = {
    "informe.pdf": [
        "Proyecto Final Integrador: Análisis de Algoritmos (SIST0175)",
        "Alineamiento de lecturas genómicas con k-mers como semillas",
        "Informe técnico · Grupo 3",
    ],
    "avance_sesion2.pdf": [
        "Proyecto Final Integrador: Análisis de Algoritmos (SIST0175)",
        "Alineamiento de lecturas genómicas con k-mers como semillas",
        "Avance de la sesión 2: C1, C2 y C3 · Grupo 3",
    ],
}

PLANTILLA = """<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<style>
  @page {{ size: letter; margin: 0; }}
  html, body {{ margin: 0; padding: 0; background: #ffffff; color: #000000; }}
  body {{ font-family: "Times New Roman", Times, serif; }}
  .pagina {{ width: 8.5in; height: 11in; box-sizing: border-box; padding: 0.55in 1in 0.9in;
             display: flex; flex-direction: column; align-items: center; text-align: center; }}
  .escudo {{ width: 0.95in; margin-bottom: 0.32in; }}
  .universidad {{ font-size: 17pt; font-weight: bold; letter-spacing: 0.02em; margin: 0; }}
  .direccion {{ font-size: 11pt; margin: 0.06in 0 0; }}
  .titulos {{ margin-top: 1.15in; }}
  .titulos p {{ font-size: 13pt; font-weight: bold; margin: 0 0 0.2in; }}
  .autores {{ margin-top: 1.25in; font-size: 11.5pt; }}
  .autores h2 {{ font-size: 11.5pt; font-weight: bold; margin: 0 0 0.08in; letter-spacing: 0.03em; }}
  .autor {{ margin: 0 0 0.1in; line-height: 1.2; }}
  .autor a {{ color: #1155cc; font-size: 10pt; }}
  .escuela {{ margin-top: 0.75in; font-size: 11.5pt; }}
  .linea {{ width: 100%; border: 0; border-top: 1px solid #000000; margin: 0.55in 0 0.45in; }}
  .fecha {{ font-size: 11.5pt; }}
</style></head>
<body><div class="pagina">
  <img class="escudo" src="file://{escudo}" alt="Escudo de la Universidad Sergio Arboleda">
  <p class="universidad">UNIVERSIDAD SERGIO ARBOLEDA</p>
  <p class="direccion">Calle 74 No 14-14, Bogotá, Colombia</p>
  <div class="titulos">{titulos}</div>
  <div class="autores"><h2>AUTORES:</h2>{autores}</div>
  <div class="escuela">Escuela de Ciencias Exactas e Ingeniería</div>
  <hr class="linea">
  <div class="fecha">{fecha}</div>
</div></body></html>
"""


def buscar_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for nombre in ("chromium", "chromium-browser", "google-chrome"):
        ruta = shutil.which(nombre)
        if ruta:
            return ruta
    candidatos = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome")))
    if candidatos:
        return candidatos[-1]
    raise SystemExit("No se encontró Chromium; definir la variable CHROME con su ruta.")


def ya_tiene_portada(pdf):
    texto = subprocess.run(["pdftotext", "-f", "1", "-l", "1", pdf, "-"], capture_output=True, text=True).stdout
    return "UNIVERSIDAD SERGIO ARBOLEDA" in texto


def main():
    chrome = buscar_chrome()
    escudo = os.path.join(AQUI, "escudo_usa.png")
    autores = "".join(
        f'<p class="autor">{html.escape(n)}<br><a href="mailto:{c}">({c})</a></p>' for n, c in AUTORES)
    with tempfile.TemporaryDirectory() as tmp:
        for nombre_pdf, titulos in DOCUMENTOS.items():
            destino = os.path.join(DIR_PDF, nombre_pdf)
            if not os.path.exists(destino):
                print(f"falta {destino}: generarlo primero")
                continue
            if ya_tiene_portada(destino):
                print(f"{nombre_pdf}: ya tiene portada")
                continue
            pagina = PLANTILLA.format(
                escudo=escudo, fecha=FECHA, autores=autores,
                titulos="".join(f"<p>{html.escape(t)}</p>" for t in titulos))
            ruta_html = os.path.join(tmp, "portada.html")
            with open(ruta_html, "w", encoding="utf-8") as f:
                f.write(pagina)
            portada = os.path.join(tmp, "portada.pdf")
            subprocess.run([chrome, "--headless", "--disable-gpu", "--no-sandbox",
                            "--no-pdf-header-footer", f"--print-to-pdf={portada}",
                            "--allow-file-access-from-files", f"file://{ruta_html}"],
                           check=True, capture_output=True)
            unido = os.path.join(tmp, "unido.pdf")
            subprocess.run(["pdfunite", portada, destino, unido], check=True)
            shutil.move(unido, destino)
            print(f"{nombre_pdf}: portada agregada")


if __name__ == "__main__":
    main()
