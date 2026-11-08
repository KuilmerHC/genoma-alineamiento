# Proyecto Final Integrador: Análisis de Algoritmos (SIST0175)

Grupo 3: alineamiento de lecturas genómicas sintéticas sobre un genoma de referencia sintético, usando k-mers como semillas.

Documentos (versiones PDF para entregar en [docs/pdf/](docs/pdf/)):
- [docs/guia_del_equipo.md](docs/guia_del_equipo.md): **empiecen por aquí**. Todo el proyecto explicado de forma sencilla, con preguntas probables de la sustentación.
- [docs/requerimientos.md](docs/requerimientos.md): requerimientos del enunciado y checklist.
- [docs/analisis_teorico_c1_c3.md](docs/analisis_teorico_c1_c3.md): análisis teórico de C1–C3 (avance de la sesión 2).
- [docs/plan_experimentos.md](docs/plan_experimentos.md): hipótesis, protocolo y resultados preliminares.

## Estructura

| Carpeta | Contenido | Estado |
|---|---|---|
| `datos/generar.py` | Genoma y lecturas sintéticas con semilla fija | hecho |
| `c1_mergesort/` | C1: merge sort de k-mers con contador de comparaciones | hecho |
| `c2_arreglo_dinamico/` | C2: arreglo dinámico (contadores de escrituras y copias) | hecho |
| `c3_smith_waterman/` | C3: Smith-Waterman con reconstrucción del alineamiento | hecho |
| `c4_quicksort/` | C4: quicksort aleatorizado | pendiente |
| `comun/` | k-mers en 2 bits, índice de semillas (C1 + C2 + búsqueda binaria), alineador | hecho (falta `DiscoSimulado`) |
| `c5_external_sort/` | C5: external merge sort | pendiente |
| `c6_mapreduce/` | C6: MapReduce con `multiprocessing` | pendiente |
| `experimentos/` | `bench.py` (harness) + un script por componente; `resultados/` (CSV) y `graficas/` (PNG) | C1, C2, C3 |
| `tests/` | Pruebas pytest por componente | C1, C2, C3, comun |

## Ejecución

Requiere Python 3.10+ y pytest. Todos los comandos se corren desde la raíz del repo.

    python -m datos.generar 10000 100 42   # genera datos/genoma.txt y datos/lecturas.txt
    python -m datos.generar 10000 100 42 0.01   # igual, con 1 % de inserciones/borrados
    pytest -q                              # corre todas las pruebas
    python -m experimentos.exp_c1_mergesort         # ~1 min
    python -m experimentos.exp_c2_arreglo_dinamico  # ~15 s
    python -m experimentos.exp_c3_smith_waterman    # ~30 s

Requiere además `numpy` y `matplotlib` para los experimentos.

Los archivos `datos/*.txt` no se versionan: se regeneran con el comando anterior (la semilla fija garantiza los mismos datos).

## Declaración de uso de IA

Se usó un asistente de IA (Claude) para apoyar el diseño, la organización del repositorio y la depuración. Todo el código fue revisado por el equipo.
