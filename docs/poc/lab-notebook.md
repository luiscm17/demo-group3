# PoCs Analysis - Lab Notebook AI Assistant

## PoC 1: SensorLab AI Assistant (Física / Sensores – Kaggle Datasets)

**Descripción actualizada**  
Asistente multi-agente para laboratorios de sensores (temperatura, presión, vibración, IoT). El investigador sube protocolo textual + CSV de sensores + foto del setup. El sistema interpreta, sugiere 2-3 variaciones seguras para el siguiente paso y devuelve análisis con gráficos + explicación probabilística.

**Estudio de mercado detallado**  
El segmento de sensores industriales e IoT en labs crece a doble dígito (impulsado por digital twins y predictive maintenance). Universidades y labs de I+D necesitan reducir tiempo de análisis de 4-6 horas a <5 min. Oportunidad clara: 40% de los labs reportan cuellos de botella en iteración experimental (datos Kaggle sensor + tendencias Azure ML 2026).

**Pros y contras**  

**Pros**:  

- Bajo riesgo regulatorio (no clínico).  
- Fácil adopción en academia/industria ligera.  
- ROI rápido (acelera experimentos 3-5x).  

**Contras**:  

- Menor impacto financiero vs. energía.  
- Datos menos críticos → menor exigencia de guardrails.  
- Competencia con herramientas open-source gratuitas.

**Casos de uso concretos**  

1. Lab universitario de control: protocolo de calibración de sensor + CSV → sugiere variación de frecuencia segura y explica con series temporales (ganancia 25% en precisión).  
2. Industria manufacturera: foto de vibración + datos → detecta anomalía y recomienda próximo paso (reduce downtime 30%).  
3. IoT R&D: análisis multimodal para predecir fallo.

**Arquitectura Azure (9 servicios)**  

- App Service (Blazor)  
- Azure Functions (4 agentes)  
- Azure OpenAI GPT-4o + Vision  
- Azure AI Agent Service
- Blob Storage + AI Search  
- Content Safety + Responsible AI Toolbox  
- Azure ML (series temporales)  
- Azure DevOps + Monitor  

## PoC 2: ChemProtocol AI Assistant (Química Segura – OpenML Datasets)

**Descripción actualizada**  
Interpreta protocolos de síntesis/materiales. Sugiere variaciones de temperatura/concentración solo dentro de rangos OSHA pre-aprobados. Analiza CSV de yields + imágenes de espectros. Nunca genera fórmulas de sustancias controladas.

**Estudio de mercado detallado**  
El mercado de química verde y materiales avanzados supera los $12B (2026). El 65% de laboratorios químicos pierde tiempo en iteraciones manuales y errores de seguridad (OpenML community + reportes Responsible AI). Oportunidad: asistente que acelere R&D sostenible mientras cumple REACH/TSCA.

**Pros y contras**  

**Pros**:  

- Alto valor en sostenibilidad (química verde).  
- Guardrails químicos muy maduros.  
- Integración fácil con Azure ML models de regresión.  

**Contras**:  

- Riesgo regulatorio medio-alto (sustancias peligrosas).  
- Necesidad de ontologías personalizadas.  
- Menor escala que energía upstream.

**Casos de uso concretos**  

1. Lab de polímeros: protocolo de polimerización + CSV → sugiere ±5°C seguro y explica yield con SHAP.  
2. Materiales para baterías: imagen espectro + datos → recomienda variación de concentración y justifica estadísticamente.  
3. Control de calidad industrial: análisis batch para cumplimiento normativo.

**Arquitectura Azure (10 servicios)**  

- App Service  
- Functions (agentes + Safety Checker)  
- OpenAI multimodal  
- AI Agent Service
- Storage + Table  
- AI Search (vector store protocolos)  
- Content Safety Studio + Responsible AI Toolbox  
- Azure ML (regresión)  
- Key Vault  
- DevOps + Container Instances  

## PoC 3: HydroLab AI Assistant (Hidrocarburos / Energía Upstream – Kaggle 3W + Drilling Datasets)

**Descripción**  

Asistente especializado en laboratorios de petróleo y gas (pruebas PVT, fluidos de perforación, sensores de pozos). Interpreta protocolos experimentales, sugiere variaciones seguras de presión/temperatura (solo rangos API/OSHA pre-aprobados), analiza CSV de sensores + imágenes de setups de laboratorio. **Nunca da consejos operativos en campo ni sobre perforación real** (solo labs académicos/industriales controlados). Bloquea cualquier prompt que intente obtener información de explosivos o fugas en producción.

**Estudio de mercado detallado**  

El mercado global AI en Oil & Gas vale entre **USD 4.04-7.64 mil millones en 2025** y se proyecta a **USD 7.5-15 mil millones en 2030-2035** (CAGR 12.8-22.9%). El segmento **upstream** domina con **61%** de share: optimización de drilling, análisis PVT en labs, predictive maintenance y safety.  
Los laboratorios upstream necesitan acelerar iteraciones (actualmente 4-8 horas por experimento) y cumplir ESG + regulaciones de seguridad (explosiones, metano, fugas).  
Datasets perfectos encontrados:  

- Kaggle 3W Dataset (eventos indeseables reales en pozos – 8 variables de sensores).  
- Drilling Log Dataset + Oil Well sensors (Siberia).  
- Anomaly Detection in Oil & Gas Chemical Plants (temperatura, presión, flujo, vibración).  
Oportunidad de negocio: reducir downtime 20-30%, mejorar safety y acelerar R&D de fluidos de perforación en labs (mercado digital oilfield ~USD 45B en 2026).

**Pros y contras**  

**Pros**:  

- ROI más alto del sector (ahorro millones en exploración).  
- Demanda explosiva en upstream (Permian Basin, Aramco, SLB).  
- Datasets públicos ricos + Azure energy use cases reales.  
- Impacto ESG medible (reducción emisiones vía optimización lab).  

**Contras**:  

- Datos altamente sensibles (seguridad nacional y confidencialidad).  
- Regulaciones estrictas (API, OSHA, IEA) → guardrails más pesados.  
- Necesidad de domain experts para validar rangos seguros.  
- Mayor complejidad en validación de modelos (variabilidad real de pozos).

**Casos de uso concretos y medibles**  

1. **Pruebas PVT en laboratorio**: investigador sube protocolo de Constant Composition Expansion + CSV de presión-volumen + foto del equipo. El agente sugiere variación de temperatura ±3°C (solo rango seguro), predice comportamiento fase y explica con gráficos + probabilidad (reduce tiempo análisis 85%).  
2. **Análisis de fluidos de perforación**: CSV de viscosidad + imagen del reómetro → detecta anomalía (usando 3W dataset) y recomienda próximo paso controlado (evita fallos en simulación).  
3. **Optimización de experimentos de reservoir**: protocolo de simulación + datos históricos → sugiere 2 variaciones seguras de presión y devuelve dashboard Responsible AI con SHAP + trazabilidad completa.  
4. **Detección temprana de anomalías en labs de pruebas**: combina sensor data + imagen para alertar sobre riesgo de sobrepresión antes de que ocurra (cumple safety-critical).

**Arquitectura Azure (10 servicios – máxima amplitud)**  

- **App Service** (frontend notebook interactivo con drag-and-drop).  
- **Azure Functions** (5 agentes orquestados: Protocol Parser, Safety-First Checker, Variation Suggester, Analyzer + Refusal Engine).  
- **Azure OpenAI** (GPT-4o + vision para imágenes de setups PVT).  
- **Azure AI Agent Service + Agent Framework** (orquestación con memoria de experimentos + human-in-the-loop).  
- **Azure Blob Storage + Data Lake** (datos sensibles de sensores).  
- **Azure AI Search** (vector store de protocolos API/OSHA).  
- **Content Safety Studio + Responsible AI Toolbox** (guardrails máximos: score >95%, bloqueo automático de cualquier mención operativa o explosiva).  
- **Azure ML** (modelos de series temporales + clustering para anomalías 3W).  
- **Azure Key Vault + Monitor**.  
- **Azure DevOps Pipelines + Application Insights**.  
