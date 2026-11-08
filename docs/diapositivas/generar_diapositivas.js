// Genera docs/diapositivas/sustentacion_grupo3.pptx a partir de los CSV de experimentos/resultados.
// Uso (desde la raíz del repo):  NODE_PATH=<carpeta con node_modules> node docs/diapositivas/generar_diapositivas.js
// Requiere pptxgenjs 3.12 y el script apply_theme.js de la skill de pptx (ruta en APPLY_THEME).

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const RAIZ = path.resolve(__dirname, "..", "..");
const RES = path.join(RAIZ, "experimentos", "resultados");
const SALIDA = path.join(__dirname, "sustentacion_grupo3.pptx");

// ---------- datos ----------
function leerCSV(nombre) {
  const lineas = fs.readFileSync(path.join(RES, nombre + ".csv"), "utf8").trim().split(/\r?\n/);
  const cab = lineas[0].split(",");
  return lineas.slice(1).map((l) => {
    const v = l.split(",");
    const o = {};
    cab.forEach((c, i) => { o[c] = isNaN(Number(v[i])) || v[i] === "" ? v[i] : Number(v[i]); });
    return o;
  });
}
const c1 = leerCSV("c1_mergesort");
const c1casos = leerCSV("c1_casos");
const c2 = leerCSV("c2_arreglo_dinamico");
const c3cuad = leerCSV("c3_sw_cuadrado");
const c4 = leerCSV("c4_quicksort");
const c5b = leerCSV("c5_serie_b");
const c5a = leerCSV("c5_serie_a");
const c6 = leerCSV("c6_speedup");
const mem = leerCSV("memoria_c1_c4");

const log2 = (x) => Math.log(x) / Math.log(2);
const num = (x, d = 2) => x.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
const miles = (x) => Math.round(x).toLocaleString("es-CO").replace(/,/g, ".");
const sup = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const pot2 = (n) => "2" + String(Math.round(log2(n))).split("").map((d) => sup[d]).join("");
const kEtiq = (n) => (n >= 1e6 ? num(n / 1e6, 1) + "M" : Math.round(n / 1000) + "k");
function pendiente(xs, ys) {
  const lx = xs.map(Math.log), ly = ys.map(Math.log);
  const mx = lx.reduce((a, b) => a + b) / lx.length, my = ly.reduce((a, b) => a + b) / ly.length;
  let sxy = 0, sxx = 0;
  lx.forEach((x, i) => { sxy += (x - mx) * (ly[i] - my); sxx += (x - mx) ** 2; });
  return sxy / sxx;
}

// ---------- tema ----------
const THEME = {
  name: "Genoma Grupo 3",
  headFontFace: "Georgia",
  bodyFontFace: "Arial",
  colors: {
    dk1: "1B2A30", lt1: "FFFFFF", dk2: "0B3C49", lt2: "EAF3F2",
    accent1: "0B7A75", accent2: "E4572E", accent3: "F2A541", accent4: "3A6EA5",
    accent5: "7A9E7E", accent6: "8C5383", hlink: "0B7A75", folHlink: "8C5383",
  },
};
const HEX = { tinta: "1B2A30", gris: "5B6B70", grilla: "E2E6E6", teal: "0B7A75", coral: "E4572E",
  ambar: "F2A541", azul: "3A6EA5", oscuro: "0B3C49", claro: "EAF3F2" };

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 × 5,625 in
pres.author = "Kuilmer Santiago Hernández Cruz, Juan José Berrio Español, Santiago Serrano Cuellar";
pres.title = "Alineamiento de lecturas genómicas: Grupo 3";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "PORTADA",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.55, w: 8.8, h: 1.1,
      fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 2.75, w: 8.8, h: 0.6,
      fontSize: 18, color: C.background2, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENIDO",
  background: { color: C.background1 },
  margin: [0.5, 0.5, 0.5, 0.5],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 1.05, y: 0.3, w: 8.45, h: 0.62,
      fontSize: 28, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: "Grupo 3 · Alineamiento de lecturas genómicas · SIST0175",
      options: { x: 0.5, y: 5.22, w: 6, h: 0.25, fontSize: 9, color: "5B6B70", margin: 0, isTextBox: true } } },
  ],
  slideNumber: { x: 9.1, y: 5.22, w: 0.4, h: 0.25, fontSize: 9, color: "5B6B70", align: "right" },
});
pres.defineSlideMaster({
  title: "CIERRE",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 8.8, h: 0.65,
      fontSize: 30, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.1, y: 5.22, w: 0.4, h: 0.25, fontSize: 9, color: "CFE3E1", align: "right" },
});

// ---------- piezas reutilizables ----------
function insignia(slide, texto) {
  slide.addShape(pres.shapes.OVAL, { x: 0.42, y: 0.36, w: 0.5, h: 0.5, fill: { color: C.accent1 },
    line: { color: C.accent1 }, objectName: "insignia" });
  slide.addText(texto, { x: 0.42, y: 0.36, w: 0.5, h: 0.5, fontSize: texto.length > 2 ? 10 : 14, bold: true,
    color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "insignia-texto" });
}
function dato(slide, x, y, w, grande, pequeno, color) {
  slide.addText(grande, { x, y, w, h: 0.55, fontSize: 30, bold: true, color: color || C.accent1,
    fontFace: THEME.headFontFace, margin: 0, isTextBox: true, objectName: "dato" });
  slide.addText(pequeno, { x, y: y + 0.55, w, h: 0.45, fontSize: 12, color: C.text1, margin: 0,
    valign: "top", isTextBox: true, objectName: "dato-etiqueta" });
}
function tarjeta(slide, x, y, w, h, titulo, cuerpo, opciones = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08,
    fill: { color: opciones.fondo || C.background2 }, line: { color: opciones.fondo || C.background2 }, objectName: "tarjeta" });
  slide.addText(titulo, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.35, fontSize: 14, bold: true,
    color: opciones.colorTitulo || C.text2, margin: 0, isTextBox: true, objectName: "tarjeta-titulo" });
  slide.addText(cuerpo, { x: x + 0.15, y: y + 0.47, w: w - 0.3, h: h - 0.55, fontSize: opciones.tam || 13,
    color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "tarjeta-cuerpo",
    fontFace: opciones.mono ? "Courier New" : undefined });
}
function opcionesGrafica(extra) {
  return Object.assign({
    x: 4.9, y: 1.15, w: 4.6, h: 3.85,
    fontFace: "+mn-lt",
    catAxisLabelColor: HEX.gris, valAxisLabelColor: HEX.gris,
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: HEX.grilla, size: 0.75 }, catGridLine: { style: "none" },
    lineSize: 2, lineDataSymbolSize: 6,
    showLegend: true, legendPos: "b", legendFontSize: 10, legendFontFace: "+mn-lt", legendColor: HEX.tinta,
    showTitle: true, titleFontSize: 12, titleColor: HEX.tinta, titleFontFace: "+mn-lt",
    catAxisTitleFontSize: 10, valAxisTitleFontSize: 10, catAxisTitleColor: HEX.gris, valAxisTitleColor: HEX.gris,
    catAxisTitleFontFace: "+mn-lt", valAxisTitleFontFace: "+mn-lt",
  }, extra);
}

// =====================================================================================
// 1. Portada (Kuilmer)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "PORTADA" });
  s.addText("Alineamiento de lecturas genómicas", { placeholder: "title" });
  s.addText("k-mers como semillas: seis algoritmos, su análisis y su validación experimental", { placeholder: "body" });
  const bases = "ACGTTGCAACGT".split("");
  const colorBase = { A: C.accent1, C: C.accent3, G: C.accent2, T: C.accent4 };
  bases.forEach((b, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6 + i * 0.52, y: 0.75, w: 0.42, h: 0.42, rectRadius: 0.06,
      fill: { color: colorBase[b] }, line: { color: colorBase[b] }, objectName: "base-" + i });
    s.addText(b, { x: 0.6 + i * 0.52, y: 0.75, w: 0.42, h: 0.42, fontSize: 16, bold: true, color: C.background1,
      align: "center", valign: "middle", margin: 0, isTextBox: true, fontFace: "Courier New" });
  });
  s.addText([
    { text: "Kuilmer Santiago Hernández Cruz · Juan José Berrio Español · Santiago Serrano Cuellar", options: { breakLine: true } },
    { text: "Análisis de Algoritmos (SIST0175) · Grupo 3" },
  ], { x: 0.6, y: 4.3, w: 8.8, h: 0.7, fontSize: 14, color: C.background2, margin: 0, isTextBox: true, valign: "top" });
  s.addNotes("KUILMER (≈30 s). Buenos días. Somos el grupo 3: Kuilmer, Juan José y Santiago. Nuestro caso es el alineamiento de lecturas genómicas: encontrar de qué parte de un genoma salió cada pedacito de ADN, aunque venga con errores. Cada uno presenta dos componentes: yo C1 y C4, Juan José C2 y C5, Santiago C3 y C6.");
}

// =====================================================================================
// 2. Caso y arquitectura (Kuilmer)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Buscar 50 letras con errores en un millón", { placeholder: "title" });
  insignia(s, "ADN");
  s.addText("Genoma sintético de n = 10⁶ bases y lecturas de m = 50 con 2 % de sustituciones y 1 % de indels (semilla fija). Comparar cada lectura contra todo el genoma cuesta Θ(m·n); con semillas, solo Θ(m²).",
    { x: 0.5, y: 1.05, w: 9, h: 0.65, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  const pasos = [
    ["k-mers", "2 bits por base,\nΘ(n)"],
    ["Ordenar", "C1 merge sort\nC4 quicksort · C5 en disco"],
    ["Índice", "C2: posiciones\npor k-mer"],
    ["Semillas", "búsqueda binaria\n+ votos"],
    ["Alinear", "C3 Smith-Waterman\nen la región"],
    ["Paralelo", "C6 MapReduce\np procesos"],
  ];
  const w = 1.36, gap = 0.17, y = 2.05;
  pasos.forEach(([t, d], i) => {
    const x = 0.5 + i * (w + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 1.55, rectRadius: 0.08,
      fill: { color: i === 4 ? C.accent1 : C.background2 }, line: { color: i === 4 ? C.accent1 : C.background2 }, objectName: "paso-" + i });
    s.addText(t, { x: x + 0.1, y: y + 0.12, w: w - 0.2, h: 0.4, fontSize: 15, bold: true,
      color: i === 4 ? C.background1 : C.text2, margin: 0, isTextBox: true });
    s.addText(d, { x: x + 0.1, y: y + 0.55, w: w - 0.2, h: 0.9, fontSize: 11.5,
      color: i === 4 ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: "top" });
    if (i < pasos.length - 1) {
      s.addShape(pres.shapes.RIGHT_TRIANGLE, { x: x + w + 0.03, y: y + 0.68, w: 0.11, h: 0.2, rotate: 0,
        fill: { color: C.accent2 }, line: { color: C.accent2 }, flipV: false, objectName: "flecha-" + i });
    }
  });
  dato(s, 0.5, 3.95, 2.8, "100 / 100", "lecturas ubicadas a ≤ 3 bases de su posición real");
  dato(s, 3.6, 3.95, 2.8, "156", "pruebas automáticas (pytest), todas pasan");
  dato(s, 6.7, 3.95, 2.8, "0", "usos de sorted / heapq en el núcleo de los componentes", C.accent2);
  s.addNotes("KUILMER (≈1 min). La idea es la del índice de un libro. Primero sacamos todos los k-mers del genoma, palabras de k letras codificadas en 2 bits, así comparar es comparar enteros. Los ordenamos (C1, C4, o C5 si no caben en memoria) y armamos el índice: cada k-mer con su lista de posiciones en un arreglo dinámico (C2). Cada lectura busca sus k-mers por búsqueda binaria; cada coincidencia vota por dónde empieza la lectura; y solo en esa región hacemos el alineamiento fino con Smith-Waterman (C3). C6 reparte las lecturas entre procesos. Resultado: alineamos contra unas 70 bases en vez de un millón.");
}

// =====================================================================================
// 3. C1 merge sort (Kuilmer)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Merge sort: Θ(n log n) y óptimo", { placeholder: "title" });
  insignia(s, "C1");
  tarjeta(s, 0.5, 1.15, 4.1, 1.25, "Recurrencia leída del código",
    "T(n) = 2·T(n/2) + Θ(n)\nMaestro: a = 2, b = 2, f(n) = n = n^(log₂2) → caso 2 → Θ(n log n)", { tam: 12.5 });
  tarjeta(s, 0.5, 2.55, 4.1, 1.15, "Cota inferior: árbol de decisión",
    "n! hojas ⇒ altura h ≥ log₂ n! = Ω(n log n). Ningún ordenamiento por comparaciones lo mejora.", { tam: 12.5 });
  const pend = pendiente(c1.map((f) => f.n), c1.map((f) => f.mediana));
  dato(s, 0.5, 3.9, 2.0, num(pend), "pendiente log-log medida (teoría: 1,10)");
  dato(s, 2.6, 3.9, 2.0, "exacto", "mejor y peor caso de comparaciones");
  const etq = c1casos.map((f) => pot2(f.n));
  const r = (campo) => c1casos.map((f) => f[campo] / (f.n * log2(f.n)));
  s.addChart(pres.charts.LINE, [
    { name: "peor: n log₂ n − n + 1", labels: etq, values: r("comp_peor") },
    { name: "aleatoria", labels: etq, values: r("comp_aleatoria") },
    { name: "cota log₂ n!", labels: etq, values: c1casos.map((f) => f.log2_factorial / (f.n * log2(f.n))) },
    { name: "mejor: (n/2) log₂ n", labels: etq, values: r("comp_mejor") },
  ], opcionesGrafica({
    title: "Comparaciones / (n log₂ n)", chartColors: [HEX.coral, HEX.teal, HEX.gris, HEX.ambar],
    valAxisMinVal: 0, valAxisMaxVal: 1.1, valAxisLabelFormatCode: "0.0", lineDataSymbol: "circle",
  }));
  s.addNotes("KUILMER (≈1 min 15 s). Merge sort parte en dos mitades, ordena cada una y las mezcla en tiempo lineal: T(n) = 2T(n/2) + Θ(n). Por el Teorema Maestro, a = 2, b = 2, f(n) = n, que es igual a n elevado a log base b de a: caso 2, Θ(n log n). La cota inferior sale del árbol de decisión: hay n! órdenes posibles, un árbol binario con n! hojas tiene altura al menos log2 n!, que es n log n. La gráfica muestra las comparaciones medidas dividido n log n: el peor caso (entrada intercalada) y el mejor (entrada ordenada) coinciden exactamente con la fórmula, y la aleatoria queda por encima de log2 n!. En tiempo, la pendiente log-log da 1,12 frente a 1,10 que predice n log n en ese rango.");
}

// =====================================================================================
// 4. C4 quicksort (Kuilmer)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Quicksort aleatorizado: 2n ln n esperado", { placeholder: "title" });
  insignia(s, "C4");
  tarjeta(s, 0.5, 1.15, 4.1, 1.45, "Por qué 2n ln n",
    "zᵢ y zⱼ se comparan solo si uno es el primer pivote de {zᵢ…zⱼ}: prob. 2/(j−i+1).\nE[C] = Σ 2/(j−i+1) = 2(n+1)Hₙ − 4n ≈ 2n ln n", { tam: 12.5 });
  const razones = c4.map((f) => f.comp_qs_sobre_esperadas);
  const minR = Math.min(...razones), maxR = Math.max(...razones);
  const ultimo = mem[mem.length - 1];
  dato(s, 0.5, 2.8, 2.0, "≈ 1,00", "medidas / esperadas (" + num(minR) + "–" + num(maxR) + ")");
  dato(s, 2.6, 2.8, 2.0, num(ultimo.bytes_por_elem_ms, 0) + " B", "extra por elemento de merge sort; quicksort ≈ 0");
  s.addText("Pivote aleatorio: ninguna entrada es mala de forma sistemática (también la ya ordenada). Partición de 3 vías: los k-mers repetidos se fijan de una vez.",
    { x: 0.5, y: 3.95, w: 4.1, h: 0.95, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  const etq = c4.map((f) => kEtiq(f.n));
  s.addChart(pres.charts.LINE, [
    { name: "C4 quicksort, claves distintas", labels: etq, values: c4.map((f) => f.comp_qs_sobre_nlogn) },
    { name: "C1 merge sort", labels: etq, values: c4.map((f) => f.comp_ms_sobre_nlogn) },
    { name: "C4 con k-mers repetidos", labels: etq, values: c4.map((f) => f.comp_qs_repetidos_sobre_nlogn) },
  ], opcionesGrafica({
    title: "Comparaciones / (n log₂ n)", chartColors: [HEX.teal, HEX.coral, HEX.ambar],
    valAxisMinVal: 0, valAxisMaxVal: 1.4, valAxisLabelFormatCode: "0.0", lineDataSymbol: "circle",
  }));
  s.addNotes("KUILMER (≈1 min 15 s). Quicksort elige un pivote al azar y separa en menores, iguales y mayores. El análisis: dos elementos solo se comparan si uno de ellos es el primer pivote elegido entre los que están entre ellos, con probabilidad 2/(j−i+1); sumando, la esperanza es 2(n+1)Hn − 4n, más o menos 2n ln n. Esa esperanza es sobre los pivotes, no sobre los datos: vale para cualquier entrada. Medido: entre 0,99 y 1,03 veces lo esperado. Frente a merge sort hace un 33 % más comparaciones, pero ordena en su lugar: no usa memoria extra, por eso lo usamos en C5. Con k-mers repetidos la partición de 3 vías baja las comparaciones, como predice O(n log u).");
}

// =====================================================================================
// 5. C2 arreglo dinámico (Juan José)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Arreglo dinámico: 3 créditos pagan todo", { placeholder: "title" });
  insignia(s, "C2");
  tarjeta(s, 0.5, 1.15, 4.1, 1.7, "Método contable",
    "Se cobran 3 créditos por append: 1 paga la escritura y 2 se guardan. Al duplicar de c a 2c, los c/2 elementos nuevos guardaron c créditos: justo lo que cuesta copiar c. El saldo nunca es negativo ⇒ costo ≤ 3n ⇒ O(1) amortizado.",
    { tam: 12.5 });
  const peorRazon = Math.max(...c2.map((f) => f.costo_sobre_n_peor));
  dato(s, 0.5, 3.05, 2.0, "< 3", "costo / n en todo n; casi 3 justo después de duplicar");
  dato(s, 2.6, 3.05, 2.0, "0", "saldo mínimo del banco de créditos");
  const pc2 = pendiente(c2.map((f) => f.n), c2.map((f) => f.mediana));
  dato(s, 0.5, 4.1, 2.0, num(pc2), "pendiente log-log del tiempo (teoría: 1)");
  // costo acumulado operación a operación (simulado con la misma regla de duplicación)
  const m = 300, etq = [], real = [], cobrado = [];
  let cap = 1, n = 0, costo = 0;
  for (let i = 1; i <= m; i++) {
    if (n === cap) { costo += n; cap *= 2; }
    costo += 1; n += 1;
    etq.push(String(i)); real.push(costo); cobrado.push(3 * i);
  }
  s.addChart(pres.charts.LINE, [
    { name: "costo real acumulado", labels: etq, values: real },
    { name: "3·i créditos cobrados", labels: etq, values: cobrado },
  ], opcionesGrafica({
    title: "Costo acumulado (escrituras + copias)", chartColors: [HEX.teal, HEX.coral],
    lineDataSymbol: "none", catAxisLabelFrequency: 50, valAxisMinVal: 0, valAxisLabelFormatCode: "0",
  }));
  s.addNotes("JUAN JOSÉ (≈1 min). Cada k-mer tiene una lista de posiciones que crece sin saber cuánto. Usamos un arreglo que duplica su capacidad cuando se llena. Una operación puede costar n, pero con el método contable cobramos 3 créditos por append: uno paga la escritura y dos quedan ahorrados. Cuando hay que duplicar de c a 2c, los c/2 elementos que llegaron desde la última duplicación ahorraron c créditos, exactamente lo que cuesta copiar. El saldo nunca baja de cero, así que n operaciones cuestan a lo sumo 3n: O(1) amortizado. La gráfica es el costo real (escalones en cada duplicación) siempre por debajo de 3i. El código lleva ese banco de créditos y su mínimo medido es 0.");
}

// =====================================================================================
// 6. C5 ordenamiento externo (Juan José)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Ordenamiento externo: E/S exactas", { placeholder: "title" });
  insignia(s, "C5");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 0.6, rectRadius: 0.08,
    fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "formula" });
  s.addText([
    { text: "E/S = 2 · (N/B) · (1 + ⌈log", options: {} },
    { text: "M/B − 1", options: { subscript: true } },
    { text: "(N/M)⌉)", options: {} },
  ], { x: 0.65, y: 1.1, w: 4.6, h: 0.6, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("Corridas de M registros ordenadas con C4; mezcla de k = M/B − 1 corridas a la vez con un min-heap propio.",
    { x: 5.35, y: 1.1, w: 4.0, h: 0.6, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: "middle" });
  const filas = [[
    { text: "M (memoria)", options: { bold: true } }, { text: "k", options: { bold: true } },
    { text: "corridas", options: { bold: true } }, { text: "pasadas", options: { bold: true } },
    { text: "E/S contadas", options: { bold: true } }, { text: "E/S predichas", options: { bold: true } },
  ]];
  c5b.forEach((f) => filas.push([miles(f.M), String(f.k), miles(f.corridas), String(f.pasadas),
    miles(f.es_contadas), miles(f.es_predichas)]));
  s.addTable(filas, { x: 0.5, y: 1.9, w: 5.9, colW: [1.15, 0.6, 0.95, 0.85, 1.2, 1.15], fontSize: 12,
    color: HEX.tinta, fontFace: "Arial", border: { type: "solid", pt: 0.75, color: HEX.grilla },
    fill: { color: "FFFFFF" }, rowH: 0.36, align: "right", valign: "middle", margin: [0.03, 0.08, 0.03, 0.08] });
  s.addText("N = 10⁶ registros de 12 bytes (kmer uint64 + posición uint32), B = 100. Todo acceso pasa por DiscoSimulado.leer_bloque / escribir_bloque.",
    { x: 0.5, y: 4.2, w: 5.9, h: 0.6, fontSize: 11, color: "5B6B70", margin: 0, isTextBox: true, valign: "top" });
  const total = c5a.length + c5b.length;
  const exactas = c5a.concat(c5b).filter((f) => f.es_contadas === f.es_predichas).length;
  dato(s, 6.8, 1.95, 2.7, exactas + " / " + total, "configuraciones con E/S contadas = predichas");
  dato(s, 6.8, 3.0, 2.7, "≤ M", "pico de registros en memoria (instrumentado)");
  dato(s, 6.8, 4.05, 2.7, "+20 000", "E/S por cada pasada extra (= 2N/B)", C.accent2);
  s.addNotes("JUAN JOSÉ (≈1 min 15 s). C5 resuelve el caso en que el índice no cabe en memoria. El disco es la clase DiscoSimulado: solo se puede leer o escribir de a un bloque de B registros, y cada acceso se cuenta. Fase 1: leemos M registros, los ordenamos con quicksort y los escribimos como corrida. Fase 2: mezclamos k = M/B − 1 corridas a la vez, con un bloque de búfer por corrida y uno de salida, y un min-heap propio para elegir el mínimo. Cada pasada lee y escribe todo: 2N/B. La fórmula da las transferencias totales, y en las 10 configuraciones el conteo coincidió exactamente, con 1, 2, 3, 4 y 6 pasadas. Además el código verifica que nunca hay más de M registros en memoria.");
}

// =====================================================================================
// 7. C3 Smith-Waterman (Santiago)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Smith-Waterman: tabla Θ(mn)", { placeholder: "title" });
  insignia(s, "C3");
  tarjeta(s, 0.5, 1.15, 4.1, 1.55, "Recurrencia (+2 / −1 / hueco −2)",
    "H[i][j] = max(0,\n   H[i−1][j−1] + s(aᵢ, bⱼ),\n   H[i−1][j] − 2,  H[i][j−1] − 2)", { tam: 12, mono: true });
  tarjeta(s, 0.5, 2.8, 4.1, 1.25, "Por qué programación dinámica",
    "Subestructura óptima (cortar y pegar) y subproblemas superpuestos: recursión ingenua ≥ 3^min(m,n) llamadas; tabla de (m+1)(n+1) celdas.",
    { tam: 12 });
  const pc = pendiente(c3cuad.map((f) => f.n), c3cuad.map((f) => f.mediana));
  dato(s, 0.5, 4.15, 2.0, num(pc), "pendiente con m = n (teoría: 2)");
  dato(s, 2.6, 4.15, 2.0, "= m·n", "celdas calculadas en toda entrada");
  const etq = c3cuad.map((f) => String(f.n));
  const cte = c3cuad[c3cuad.length - 1].mediana / c3cuad[c3cuad.length - 1].mn;
  s.addChart(pres.charts.LINE, [
    { name: "medido (mediana de 5)", labels: etq, values: c3cuad.map((f) => f.mediana) },
    { name: "c · m · n", labels: etq, values: c3cuad.map((f) => cte * f.mn) },
  ], opcionesGrafica({
    title: "Tiempo con m = n (escala logarítmica)", chartColors: [HEX.teal, HEX.coral],
    valAxisLogScaleBase: 10, valAxisLabelFormatCode: "0.0000", lineDataSymbol: "circle",
    catAxisTitle: "n = m", showCatAxisTitle: true, valAxisTitle: "segundos", showValAxisTitle: true,
  }));
  s.addNotes("SANTIAGO (≈1 min). Smith-Waterman alinea la lectura con la región candidata tolerando errores. Cada columna suma +2 si las letras coinciden, −1 si no, −2 si hay un hueco. H[i][j] es el mejor puntaje de un alineamiento que termina en esas dos letras; se calcula con solo tres vecinas y el 0 permite reiniciar: eso lo hace local. Es programación dinámica porque tiene subestructura óptima, se prueba cortando la última columna, y subproblemas superpuestos: la recursión ingenua es exponencial pero solo hay (m+1)(n+1) celdas. Se llenan todas siempre: Θ(mn) en los tres casos. Medido con m = n: pendiente 2,08. En el pipeline la región es de 70 bases, por eso cada lectura es barata.");
}

// =====================================================================================
// 8. C6 MapReduce (Santiago)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("MapReduce: Amdahl explica el techo", { placeholder: "title" });
  insignia(s, "C6");
  const f8 = c6.find((f) => f.p === 8);
  const fm = c6[0].f_alineamiento, fe = c6[0].f_efectiva, ft = c6[0].f_completo;
  tarjeta(s, 0.5, 1.15, 4.1, 1.3, "Ley de Amdahl",
    "S(p) = 1 / (f + (1 − f)/p) ≤ 1/f\nmap: p procesos alinean bloques de lecturas · reduce: unir en orden", { tam: 12.5 });
  dato(s, 0.5, 2.6, 2.0, num(f8.speedup_alineamiento) + "×", "speedup con 8 procesos (Amdahl con f = " + num(fm, 3) + ": " + num(f8.amdahl_alineamiento) + "×)", C.accent2);
  dato(s, 2.6, 2.6, 2.0, "f ≈ " + num(fe, 2), "fracción serial efectiva (Karp-Flatt), constante p = 2–8");
  dato(s, 0.5, 3.75, 2.0, num(f8.speedup_completo) + "×", "sistema completo: el índice serial fija 1/f ≈ " + num(1 / ft, 1));
  dato(s, 2.6, 3.75, 2.0, "8 + 8", "núcleos físicos + hilos SMT: de 8 a 16 no mejora");
  const etq = c6.map((f) => String(f.p));
  s.addChart(pres.charts.LINE, [
    { name: "medido", labels: etq, values: c6.map((f) => f.speedup_alineamiento) },
    { name: "Amdahl, f serial medida", labels: etq, values: c6.map((f) => f.amdahl_alineamiento) },
    { name: "Amdahl, f de Karp-Flatt", labels: etq, values: c6.map((f) => f.amdahl_f_efectiva) },
  ], opcionesGrafica({
    title: "Speedup T₁/T_p del alineamiento", chartColors: [HEX.teal, HEX.coral, HEX.ambar],
    valAxisMinVal: 0, valAxisLabelFormatCode: "0", lineDataSymbol: "circle",
    catAxisTitle: "procesos p", showCatAxisTitle: true,
  }));
  s.addNotes("SANTIAGO (≈1 min 30 s). Cada lectura se alinea sola, así que repartimos bloques entre p procesos (map) y unimos en orden (reduce). Amdahl dice que si una fracción f es serial, el speedup nunca pasa de 1/f. Medimos directamente la parte serial, crear procesos y el reduce: 0,7 %. Con eso Amdahl predecía 7,6× con 8 procesos y medimos 5,3×: la hipótesis tal cual no se cumplió. La métrica de Karp-Flatt calcula la fracción serial que implica el speedup medido: da 7 %, constante entre 2 y 8 procesos, y con ese valor Amdahl acierta. La explicación más probable es copy-on-write: cada proceso hijo termina copiando las páginas del índice porque Python escribe contadores en cada objeto. Con 16 no mejora porque hay 8 núcleos físicos. Y en el sistema completo, construir el índice es serial, 34 % del tiempo: el techo es 3×, y medimos 2,2×.");
}

// =====================================================================================
// 9. Validación (Juan José)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Validación: la teoría predice el conteo", { placeholder: "title" });
  insignia(s, "✓");
  const pc1 = pendiente(c1.map((f) => f.n), c1.map((f) => f.mediana));
  const pc4 = pendiente(c4.map((f) => f.n), c4.map((f) => f.t_qs));
  const ok = { text: "sí", options: { color: HEX.teal, bold: true } };
  const filas = [
    [{ text: "Comp.", options: { bold: true } }, { text: "Predicción", options: { bold: true } },
      { text: "Medido", options: { bold: true } }, { text: "¿Coincide?", options: { bold: true } }],
    ["C1", "Θ(n log n): pendiente 1,10; comparaciones exactas en mejor y peor caso", "pendiente " + num(pc1) + "; conteos exactos", ok],
    ["C2", "costo ≤ 3n; saldo ≥ 0; Θ(n)", "costo/n < 3; saldo mín. 0; pendiente 1,01", ok],
    ["C3", "Θ(mn): pendiente 1 (m fija) y 2 (m = n)", "1,02 y 2,08; celdas = m·n", ok],
    ["C4", "E[C] = 2(n+1)Hₙ − 4n", "0,99–1,03 veces lo esperado; pendiente " + num(pc4), ok],
    ["C5", "E/S = 2(N/B)(1 + ⌈log_k(N/M)⌉)", "10 de 10 iguales; memoria ≤ M", ok],
    ["C6", "Amdahl con f medida", "5,3× vs 7,6× con p = 8; con f de Karp-Flatt ±3 %", { text: "parcial", options: { color: HEX.coral, bold: true } }],
  ];
  s.addTable(filas, { x: 0.5, y: 1.15, w: 9, colW: [0.75, 3.55, 3.55, 1.15], fontSize: 12.5, color: HEX.tinta,
    fontFace: "Arial", border: { type: "solid", pt: 0.75, color: HEX.grilla }, fill: { color: "FFFFFF" },
    rowH: 0.47, valign: "middle", margin: [0.03, 0.08, 0.03, 0.08] });
  s.addText("Protocolo: perf_counter, 5 repeticiones, mediana y Q1–Q3, datos fuera del tiempo medido, ≥ 5 tamaños en progresión geométrica, pendiente por mínimos cuadrados en log-log.",
    { x: 0.5, y: 4.55, w: 9, h: 0.5, fontSize: 11, color: "5B6B70", margin: 0, isTextBox: true, valign: "top" });
  s.addNotes("JUAN JOSÉ (≈45 s). Resumen de la validación. Seguimos el protocolo: perf_counter, cinco repeticiones, mediana con su dispersión, datos generados fuera del tiempo y pendiente en log-log. Lo importante: todo lo que es un conteo, comparaciones, créditos, celdas, transferencias de bloque, coincide exactamente o dentro de la variación aleatoria, y las pendientes coinciden con la teoría. La única hipótesis que no se cumplió tal cual fue la de Amdahl en C6, y Santiago va a explicar por qué en la discusión.");
}

// =====================================================================================
// 10. Discusión (Santiago)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CONTENIDO" });
  s.addText("Discusión: dónde no coincide y por qué", { placeholder: "title" });
  insignia(s, "≠");
  tarjeta(s, 0.5, 1.15, 4.35, 3.75, "Coincide",
    "• Conteos exactos: comparaciones (C1, C4), créditos (C2), celdas (C3), E/S (C5)\n\n• Pendientes log-log con error ≤ 0,08 en todas las hipótesis de complejidad\n\n• La teoría predice cómo crece el costo, no los segundos",
    { tam: 15.5 });
  tarjeta(s, 5.15, 1.15, 4.35, 3.75, "No coincide (y la causa)",
    "• Intérprete: ≈ 140 ns por comparación, unas 100 veces C; cambia c, no la pendiente\n\n• Caché: T/(n log n) sube 13 % con n ≥ 10⁵; SW con m = n da 2,08\n\n• C6: copy-on-write del índice heredado por fork y SMT (8 núcleos reales)",
    { tam: 15.5, colorTitulo: C.accent2 });
  s.addNotes("SANTIAGO (≈45 s). Donde coincide: en todo lo que es un conteo de operaciones, y en las pendientes. Donde no: los segundos. Python cuesta unas cien veces más por operación que C, pero eso solo cambia la constante. Con n grande los datos dejan de caber en caché y el tiempo por elemento sube un poco, por eso Smith-Waterman con m = n da 2,08 y no 2. Y en C6 aparece un sobrecosto que se comporta como serial: los procesos hijos copian el índice que heredan, y los 16 hilos son en realidad 8 núcleos.");
}

// =====================================================================================
// 11. Cierre (Kuilmer)
// =====================================================================================
{
  const s = pres.addSlide({ masterName: "CIERRE" });
  s.addText("Conclusiones", { placeholder: "title" });
  s.addText([
    { text: "Los seis componentes funcionan integrados: 100/100 lecturas ubicadas, 156 pruebas.", options: { bullet: true, breakLine: true } },
    { text: "Cada cota está respaldada por una prueba y por un experimento; los conteos son exactos.", options: { bullet: true, breakLine: true } },
    { text: "El único desajuste (speedup de C6) queda explicado con Karp-Flatt y Amdahl.", options: { bullet: true } },
  ], { x: 0.6, y: 1.15, w: 8.8, h: 1.6, fontSize: 16, color: C.background1, margin: 0, isTextBox: true,
    valign: "top", paraSpaceAfter: 8 });
  const equipo = [
    ["Kuilmer Santiago Hernández Cruz", "C1 merge sort · C4 quicksort"],
    ["Juan José Berrio Español", "C2 arreglo dinámico · C5 ordenamiento externo"],
    ["Santiago Serrano Cuellar", "C3 Smith-Waterman · C6 MapReduce"],
  ];
  equipo.forEach(([nombre, comp], i) => {
    const x = 0.6 + i * 3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.05, w: 2.8, h: 1.25, rectRadius: 0.08,
      fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "integrante-" + i });
    s.addText(nombre, { x: x + 0.15, y: 3.15, w: 2.5, h: 0.6, fontSize: 13, bold: true, color: C.background1,
      margin: 0, isTextBox: true, valign: "top" });
    s.addText(comp, { x: x + 0.15, y: 3.75, w: 2.5, h: 0.5, fontSize: 12, color: C.background1, margin: 0,
      isTextBox: true, valign: "top" });
  });
  s.addText("¿Preguntas?", { x: 0.6, y: 4.55, w: 8.8, h: 0.5, fontSize: 22, bold: true, color: C.accent3,
    fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
  s.addNotes("KUILMER (≈30 s). Para cerrar: los seis componentes funcionan juntos y ubican correctamente las lecturas; cada afirmación de complejidad tiene una prueba y un experimento, y donde la práctica se alejó de la teoría, en C6, lo explicamos. La lección: el análisis asintótico predice cómo crece el costo y cuántas operaciones se hacen; los segundos dependen también de la memoria, el intérprete y el hardware. Gracias, quedamos atentos a sus preguntas.");
}

(async () => {
  await pres.writeFile({ fileName: SALIDA });
  const rutaTema = process.env.APPLY_THEME;
  if (rutaTema) {
    const { applyTheme } = require(rutaTema);
    await applyTheme(SALIDA, THEME);
  }
  console.log(SALIDA);
})();
