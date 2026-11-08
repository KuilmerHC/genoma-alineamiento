# Requerimientos del proyecto (Grupo 3)

Extraídos del enunciado (`docs/Proyecto Final Integrador – ... .pdf`) y de `CLAUDE.md`. Marcar `[x]` al cumplir.

## 1. Componentes

| Comp | Algoritmo obligatorio | Evidencia teórica | Evidencia empírica |
|---|---|---|---|
| C1 | Merge sort de k-mers | Recurrencia T(n)=2T(n/2)+Θ(n) **planteada desde el código**; Teorema Maestro caso 2 (a=2, b=2, f(n)=n); cota inferior Ω(n log n) por árbol de decisión (log₂ n!) | T(n)/(n log n) → constante; comparaciones contadas vs n log₂ n |
| C2 | Arreglo dinámico de posiciones de coincidencia | Método contable (créditos por operación) | Costo acumulado medido ≤ 3n |
| C3 | Smith-Waterman (alineamiento local) | Recurrencia, subestructura óptima, subproblemas superpuestos, tabla; Θ(mn) | Log-log en m·n, pendiente ≈ 1 respecto a mn |
| C4 | Quicksort aleatorizado | Número esperado de comparaciones ≈ 2n ln n | Comparaciones medidas vs 2n ln n; comparación empírica con C1 |
| C5 | External merge sort de k-mers sobre `DiscoSimulado` | Fórmula de E/S con N, M, B: 2(N/B)(1+⌈log_{M/B−1}(N/M)⌉) | **Tabla E/S contadas vs predichas** |
| C6 | MapReduce con `multiprocessing` (lecturas repartidas entre p procesos) | Trabajo, profundidad, speedup, ley de Amdahl (enunciado y argumento formal) | Speedup medido vs Amdahl; fracción serial medida |
| Bonus | Árbol wavelet sobre {A,C,G,T} con rank sobre vectores de bits | Hasta +0,3/5,0 | **Solo cuenta si C1–C6 están completos** |

Para todos: cotas O/Ω/Θ en mejor, peor y caso esperado, y qué datos provocan cada caso.

## 2. Reglas técnicas

- [ ] Python 3.10+; NumPy permitido; C++ opcional solo para rendimiento.
- [ ] Núcleo de cada componente implementado por el equipo: prohibido `sorted`, `list.sort`, `heapq`, `networkx`, `scikit-learn` (permitidos solo para generar datos o como oráculo en tests).
- [ ] `DiscoSimulado`: bloques de tamaño fijo en archivo binario; cuenta cada `leer_bloque(i)` y `escribir_bloque(i, datos)`; **prohibido leer el archivo por fuera de la clase**; memoria interna ≤ M registros (M/B bloques de búfer).
- [x] Datos con script propio y semilla fija (`datos/generar.py`).
- [ ] Tamaños: C1–C4 con n ∈ [10³, 10⁶]; C5 con N ∈ [10⁵, 10⁶] y M ≤ N/20; ≥ 5 tamaños en progresión geométrica (duplicar n).
- [x] Protocolo de medición (harness `experimentos/bench.py`, aplicado a C1–C3):
  - `time.perf_counter()`, ≥ 5 repeticiones por punto, mediana + dispersión.
  - Generación de datos fuera del tiempo medido.
  - Gráfica log-log con pendiente estimada vs predicha.
  - Para n log n: graficar T(n)/(n log n) y ver que tiende a constante.
  - C5: E/S contadas vs predichas, no solo tiempo.
  - El enunciado (U.C. 3.3) menciona también **memoria**: conviene medirla (p. ej. `tracemalloc`) al menos en C1/C4/C5.
- [ ] Repositorio: README con instrucciones, carpeta por componente, `datos/` con generador, `experimentos/` con benchmarks, pytest por componente.
- [x] Declarar uso de asistentes de IA en el README.

## 3. Entregables y cronograma

| Sesión | Entregable | Peso |
|---|---|---|
| 1 | Documento de diseño (2–3 págs): componentes, estructuras, complejidades esperadas | Formativo |
| 2 | **Avance**: código C1, C2, C3 con pruebas + análisis teórico C1–C3 + plan de experimentos con hipótesis y generador | Se promedia con el corte |
| 3 | Repositorio preliminar + borrador del informe | Formativo |
| 4 | **Entrega final**: repositorio, informe (≤ 15 págs sin anexos), diapositivas (≤ 12). Subir al aula virtual (Teams) el día de la sesión 4 antes de las 23:59. Sustentación 10–12 min + 5 min de preguntas individuales | 20 % de la nota final |

### Rúbrica del avance (sesión 2)
- C1 (35 %): recurrencia correcta, caso del Teorema Maestro y código que funciona.
- C2 (25 %): método contable correcto e implementación.
- C3 (25 %): recurrencia de DP e implementación.
- Plan de experimentos (15 %): hipótesis explícitas y generador de datos.

### Rúbrica de la entrega final
- Análisis teórico (35 %): O/Ω/Θ correctas en los seis componentes, recurrencias resueltas, pruebas de optimalidad, amortización y garantía de C6.
- Implementación (35 %): los seis componentes funcionan, código modular, pruebas, README reproducible.
- Validación empírica (30 %): gráficas claras, pendientes contrastadas con la teoría, E/S contadas vs predichas, discrepancias explicadas.
- Sustentación: 50 % presentación grupal, 50 % preguntas individuales sobre **cualquiera** de los seis componentes.

## 4. Informe técnico (≤ 15 páginas)

1. Descripción del caso (≤ 1 pág): problema, supuestos, generador.
2. Arquitectura: diagrama de los seis componentes y sus conexiones.
3. Análisis teórico por componente: pseudocódigo, cotas mejor/peor/esperado; Teorema Maestro (C1), método contable (C2), recurrencia DP (C3), análisis probabilístico (C4), fórmula de E/S (C5), garantía formal (C6).
4. Validación empírica: hipótesis, gráfica, pendiente medida, comparación con la teoría; tabla de E/S en C5.
5. Discusión: coincidencias y discrepancias (constantes, caché, intérprete de Python).
6. Conclusiones y reparto del trabajo por integrante.
7. Referencias (cualquier estilo consistente).

## 5. Resultados de aprendizaje que se evalúan en la sustentación

Cada integrante debe poder:
1. Explicar mejor, peor y caso esperado de cada algoritmo y qué datos los provocan.
2. Resolver la recurrencia de C1 e identificar el caso del Teorema Maestro.
3. Justificar subestructura óptima y subproblemas superpuestos de Smith-Waterman.
4. Predecir las transferencias de bloque de C5 y comprobarlo midiendo.
5. Diseñar un experimento que valide una hipótesis de complejidad y leer una gráfica log-log.
