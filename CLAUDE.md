# Proyecto Final — Análisis de Algoritmos (SIST0175) · Grupo 3

Alineamiento de lecturas genómicas sintéticas sobre un genoma de referencia sintético, usando k-mers como semillas. Equipo de 3 estudiantes. Enunciado completo en `docs/enunciado.pdf`.

**Objetivo académico, no de producción:** demostrar elección de estrategia algorítmica, corrección, complejidad, y validar experimentalmente que la teoría predice el comportamiento real. Cada integrante debe poder explicar cada línea en la sustentación: prioriza código claro y comentado sobre código ingenioso.

## Pipeline

genoma sintético → extracción de k-mers → ordenamiento (C1 / C4 / C5 externo) → índice de semillas (posiciones en C2) → búsqueda binaria de semillas de cada lectura → regiones candidatas → Smith-Waterman (C3) → paralelización por lecturas (C6)

## Componentes (algoritmo obligatorio)

| Comp | Algoritmo | Evidencia teórica requerida |
|---|---|---|
| C1 | Merge sort de k-mers | T(n)=2T(n/2)+Θ(n), Teorema Maestro caso 2 (a=2,b=2,f=n) → Θ(n log n); cota inferior Ω(n log n) por árbol de decisión (log₂ n!) |
| C2 | Arreglo dinámico de posiciones (duplicación) | Método contable: 3 créditos por append → O(1) amortizado; medir costo acumulado ≤ 3n |
| C3 | Smith-Waterman (alineamiento local, DP) | Recurrencia, subestructura óptima, subproblemas superpuestos, tabla; Θ(mn) |
| C4 | Quicksort aleatorizado | E[comparaciones] ≈ 2n ln n; comparación empírica con C1 |
| C5 | External merge sort sobre `DiscoSimulado` | E/S = 2(N/B)(1+⌈log_{M/B−1}(N/M)⌉); E/S contadas vs predichas |
| C6 | MapReduce con `multiprocessing` | Trabajo, profundidad, speedup, ley de Amdahl; medir fracción serial |
| Bonus | Árbol wavelet sobre {A,C,G,T} con rank | Solo si C1–C6 están completos |

## Reglas obligatorias del enunciado

- Python 3.10+, NumPy permitido. C++ opcional solo para módulos de rendimiento.
- **PROHIBIDO** usar `sorted`, `list.sort`, `heapq`, `networkx`, `scikit-learn` u otras librerías para el núcleo de un componente. Permitido solo para generar datos o como referencia en tests/benchmarks.
- C5: todo acceso a datos en disco pasa por `DiscoSimulado.leer_bloque(i)` / `escribir_bloque(i, datos)`. Prohibido leer el archivo por fuera de esa clase. Memoria interna limitada a M registros (M/B bloques de búfer controlados por nosotros).
- Datos generados con script propio y **semilla fija**.
- Tamaños: C1–C4 con n entre 10³ y 10⁶ (exponenciales n ≤ 20); C5 con N entre 10⁵ y 10⁶ y M ≤ N/20. Mínimo 5 tamaños por experimento en progresión geométrica (duplicar n).
- Medición: `time.perf_counter()`, ≥5 repeticiones por punto, reportar mediana y dispersión, generación de datos fuera del tiempo medido, gráfica log-log con pendiente estimada; para n log n graficar T(n)/(n log n). En C5 reportar E/S contadas vs predichas.
- Uso de asistentes de IA debe declararse en el README.

## Decisiones de diseño

- k-mers codificados en 2 bits/base (A=0, C=1, G=2, T=3) como enteros; k ≤ 31 cabe en uint64. Comparación O(1).
- Registro en disco de tamaño fijo: kmer (uint64) + posición (uint32), empaquetado con `struct`.
- Quicksort con partición de 3 vías (muchos k-mers duplicados).
- Merge k-way de C5 con min-heap o árbol de torneo **implementado por nosotros**.
- Contadores de comparaciones instrumentables en C1 y C4 para validar el análisis teórico.

## Estructura del repo

```
README.md
docs/                 enunciado, documento de diseño, informe
datos/                generar.py (semilla fija)
comun/                disco_simulado.py, kmers.py (codificación)
c1_mergesort/
c2_arreglo_dinamico/
c3_smith_waterman/
c4_quicksort/
c5_external_sort/
c6_mapreduce/
bonus_wavelet/
experimentos/         bench.py (harness común) + un script por componente; resultados/ y graficas/
tests/                pytest por componente
```

## Convenciones

- Docstrings en español con la complejidad del caso mejor/peor/esperado.
- Cada componente: implementación + test pytest (contra `sorted` como oráculo cuando aplique) + script de benchmark.
- Correr tests: `pytest -q`. Benchmarks: `python -m experimentos.<script>`.
- Antes de implementar un componente nuevo, proponer el plan y esperar aprobación.

## Entregas

- Sesión 2 (avance): C1, C2, C3 con pruebas + análisis teórico C1–C3 + plan de experimentos con hipótesis y generador. Pesos: C1 35%, C2 25%, C3 25%, plan 15%.
- Sesión 4 (final): repo completo, informe técnico (≤15 págs: caso, arquitectura, análisis teórico, validación empírica, discusión, reparto, referencias) y diapositivas (≤12).
