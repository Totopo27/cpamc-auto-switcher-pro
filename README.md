# ⚡ Auto Switcher Pro & CPAMC Quota Card
### Balanceador Inteligente, Failover Reactivo y Telemetría en Vivo para Pi & Gentle-Shell

[![Plataformas](https://img.shields.io/badge/Plataformas-Linux%20%7C%20macOS%20(M1--M4)%20%7C%20Windows-blue?style=flat-square)](#-instalación-rápida-multiplataforma)
[![Harnesses Soportados](https://img.shields.io/badge/Harness-Gentle--Shell%20%7C%20Wilox--Pi%20%7C%20Pi%20Vanilla-emerald?style=flat-square)](#-harnesses-y-entornos-compatibles)
[![Backend Engine](https://img.shields.io/badge/Backend-CPAMC%20v8%20(CLIProxyAPI)-violet?style=flat-square)](#-arquitectura-del-motor-zero-disk-mutation)
[![Tests Passing](https://img.shields.io/badge/Tests-77%2F77%20Passing-brightgreen?style=flat-square)](#-validación-y-calidad-de-código)

**Auto Switcher Pro & CPAMC Quota Card** es la solución definitiva de alta disponibilidad para desarrolladores que trabajan con agentes de codificación autónomos (**Gentle-Shell**, **Wilox-Pi**, **Pi Vanilla**) conectados a **CLIProxyAPI (CPAMC)**.

Combina una **arquitectura convergente de 4 pilares**:
1. **Plugin CGO (`.so` / `.dll`)**: Interceptor en memoria RAM para balanceo predictivo y rescate reactivo instantáneo ante `HTTP 429`.
2. **Base SQLite WAL (`rotations.db`)**: Bitácora forense de rotaciones, latencias y auditoría de incidentes.
3. **Extensión Agente**: Publicación limpia de fachadas soberanas (`Pool-XX-<familia>`) en `/model` y `/cpamc-model`.
4. **Tarjeta TUI `cpamc-quota-card`**: Doble reloj concéntrico en el riel derecho de Gentle-Shell (debajo de Status) con 48 columnas y acordeón interactivo.

---

## 🎯 ¿Qué problemas resuelve?

| Problema Habitual sin Auto Switcher Pro | Solución con Auto Switcher Pro |
|---|---|
| **Pared de HTTP 429 (Rate Limit)**: El agente se detiene en seco a mitad de un refactor o test TDD porque la cuenta física agotó su cuota. | **Failover Reactivo Inmediato**: Conmuta transparentemente a una cuenta de reserva en memoria RAM (`ActiveLeader`) en <5ms sin perder el hilo de la conversación. |
| **Ceguera de Cuotas en el Terminal**: No sabes cuánto tiempo falta para que se recargue tu ventana de 5 horas o semanal sin abrir el navegador. | **Sidebar Quota Card**: Doble reloj concéntrico en vivo en el riel derecho con barras de uso, tiempo de reseteo exacto y ritmo predictivo de consumo. |
| **Bucles Descontrolados de Agentes**: Un agente atrapado en bucle cíclico quema 100k+ tokens en minutos. | **Disyuntor Anti-Bucle (Circuit Breaker)**: Frena el bucle de raíz, calcula los tokens salvados (~85k) y genera un link a la autopsia forense web (`/incident`). |
| **Pérdida de Prompt Caching (KV Cache)**: Cambiar de cuenta aleatoriamente destruye la caché del proveedor, duplicando latencias y costes. | **Preservación Estricta de Líder**: El líder físico se mantiene caliente mientras esté sano, superando el 90% de Cache Hit Rate. |
| **Sobrediseño y Código Basura (Overengineering)**: El agente inventa capas abstractas, librerías innecesarias, migraciones no pedidas y código redundante. | **Guardián Anti-Sobrediseño (KISS / YAGNI)**: Skill transversal distribuido universalmente que prohíbe abstracciones prematuras y activa un disyuntor ante complejidad especulativa. |

---

## 🖥️ La Experiencia en Terminal: `cpamc-quota-card`

En **Gentle-Shell**, la tarjeta se monta orgánicamente en el riel lateral derecho, inmediatamente debajo del bloque de *Status*:

```text
╭─ ⚡ POOL: Gemini ─ [● Activo LIVE] ──────────╮
│ Periodo: Hoy (24h)    Caché Afinidad: 92% ok │
│ Modelo                        Pool-01-gemini │
│ Cuentas: 2 · listas        Enfoque: Normal   │
├──────────────────────────────────────────────┤
│ 🔄 ROTACIONES & LIDERAZGO: Pool-01-gemini    │
│ Rotaciones hoy: 4    │Líder actual: 1h 45m   │
│ Rescates 429: 0      │Tokens consumidos: 420k│
│ Turnos sostenidos:       38 turnos sin corte │
├──────────────────────────────────────────────┤
│ ⚡ acc-1 (Líder hace 42m)     ○ agy (95% ok) │
│ ╭─ 5 HORAS ───────────── Quedan 3h 18m ────╮ │
│ │ ⏱  ▰▰▰▰▱▱▱▱▱▱▱  36%      ▲ Ritmo holgado │ │
│ │ Uso ▰▰▱▱▱▱▱▱▱▱▱ 18%            82% libre │ │
│ ╰──────────────────────────────────────────╯ │
│ ╭─ SEMANAL ───────────── Quedan 5d 12h ────╮ │
│ │ ⏱  ▰▰▰▱▱▱▱▱▱▱▱  28%      ▲ Ritmo holgado │ │
│ │ Uso ▰▰▰▱▱▱▱▱▱▱▱ 25%            75% libre │ │
│ ╰──────────────────────────────────────────╯ │
│ Candidato a Líder: acc-2      ○ agy_1 (100%) │
├──────────────────────────────────────────────┤
│ 🛡 [CUIDANDO EL CHAT] ──────── [○ VIGILANDO] │
│ Subagentes             0/3 llamadas          │
│ Comandos cíclicos      0 detectados          │
│ Terminal Bash          0/5 llamadas          │
├──────────────────────────────────────────────┤
│ ▶ [Ver más: Contexto, Historial y Líderes]   │
╰──────────────────────────────────────────────╯
```

### 🪗 Acordeón Tri-Modal Inteligente
Interactúa pulsando **`Ctrl+Alt+X`** o haciendo **clic con el ratón** directamente sobre la tarjeta:
1. 🟢 **Modo Colapsado (`COLLAPSED`)**: Vista compacta que finaliza tras el bloque defensivo. Ideal para sesiones de programación continua sin distracciones visuales.
2. 🟡 **Modo Peek 20s (`PEEK`)**: Se despliega automáticamente ante alertas de disyuntor, rescates 429 o rotaciones, mostrando una cuenta regresiva de 20s. **Inmunidad de foco**: Se auto-colapsa en cuanto el modelo comienza a generar código (`turn_start`) para no obstruir tu lectura.
3. 🔴 **Modo Pin Fijo (`PINNED`)**: Si haces clic o pulsas `Ctrl+Alt+X`, el acordeón se expande completamente mostrando:
   - 🔄 **Liderazgo & Rotaciones**: Rotaciones del día, duración del líder actual, rescates 429, tokens acumulados y turnos continuos.
   - 📦 **Contexto & Compresión**: Tokens consumidos vs ventana máxima, compactaciones y eventos críticos.
   - ⚠️ **Causas de Rotación Recientes**: Historial cronológico con causas exactas (HTTP 429, Fatiga >80%, Histéresis).
   - 🛡️ **Guardián Anti-Sobrediseño**: Certificación visual del estado activo de las políticas de simplicidad suficiente (KISS/YAGNI).

---

## 🛡️ Guardián Anti-Sobrediseño (Anti-Overengineering)

A diferencia de los entornos genéricos donde los agentes agregan capas de abstracción no solicitadas, adaptadores redundantes o limpiezas oportunistas, Auto Switcher Pro incorpora un **estándar estricto de ingeniería de software** (`skills/anti-overengineering/SKILL.md`):

- **Principios Rectores**: Obligatoriedad de **KISS** (*Keep It Simple, Stupid*) y **YAGNI** (*You Aren't Gonna Need It*).
- **Prohibición de Código Huérfano**: Ningún subagente ni orquestador puede introducir dependencias no aprobadas, migraciones implícitas ni capas de compatibilidad innecesarias.
- **Circuit Breaker Preventivo**: Si una propuesta altera la arquitectura o añade complejidad especulativa, el agente frena en seco y devuelve `BLOCKED` solicitando una decisión explícita antes de mutar cualquier archivo.
- **Distribución Universal**: Sincronizado automáticamente en `~/.gentle-shell/agent/skills/`, `~/.pi/agent-wilox/skills/` y `~/.pi/agent/skills/`. Detectable y activo de forma nativa en cualquier arnés.

---

## 🚀 Instalación Todo-en-Uno (Suite Convergente)

El instalador detecta automáticamente tu entorno (Docker local, procesos en RAM, WSL2, LAN o VPS) e instala en paralelo el **Plugin CPAMC**, la base **SQLite WAL**, la **Extensión de Gentle-Shell/Pi** y la tarjeta **`cpamc-quota-card`**.

### Vía 1: Magic Pairing Express (1 Clic desde tu Servidor CPAMC)
Si tu servidor CPAMC ya está encendido en tu red o VPS, basta con ejecutar desde tu terminal cliente:

```bash
# Obtiene el instalador dinámico autoconfigurado con la IP y puerto de tu CPAMC:
curl -sSL http://<IP_CPAMC>:8317/auto-switcher-pro/pair | bash
```

---

### Vía 2: Instalador Universal Multiplataforma

#### 🐧 Linux & 🍏 macOS (Apple Silicon M1-M4 & Intel)
Ejecuta directamente:

```bash
# 1. Instalación automática (auto-descubrimiento en localhost, Docker o WSL):
./install.sh

# 2. Conectar tu agente a un servidor en Red Local (LAN) o Proxmox:
./install.sh http://192.168.1.100:8317

# 3. Conectar a un VPS remoto o nube con Management Key:
./install.sh --url "https://cpamc.tudominio.com:8317" --key "<MANAGEMENT_KEY>"

# 4. Modo solo cliente (instalar únicamente la extensión en este equipo):
./install.sh --ext-only --url "http://192.168.1.100:8317"
```

#### 🪟 Windows (PowerShell)
Ejecuta desde PowerShell:

```powershell
# 1. Instalación local automática:
.\scripts\install-windows.ps1

# 2. Conexión a servidor CPAMC en LAN o VPS remoto:
.\scripts\install-windows.ps1 -Url "http://192.168.1.100:8317" -Key "<MANAGEMENT_KEY>"
```

---

## 🩺 Diagnóstico Integral y Autocorrección (`/cpamc doctor`)

En cualquier momento puedes certificar que los 4 pilares del ecosistema convergen de forma saludable ejecutando en tu terminal:

```bash
/cpamc doctor
```

El asistente evaluará en tiempo real la conectividad, el motor CGO, SQLite WAL y el estado de la tarjeta en el TUI:

```text
╭─ 🩺 CPAMC AUTO-SWITCHER · DIAGNÓSTICO INTEGRAL ──────────╮
│ Endpoint evaluado: http://192.168.1.100:8317            │
├──────────────────────────────────────────────────────────┤
│ [✓] Servidor CPAMC                                       │
│     ↳ En línea en http://192.168.1.100:8317 (HTTP 200)   │
│ [✓] Motor CGO (Auto Switcher Pro)                        │
│     ↳ Plugin activo (auto-switcher-pro, v0.1.1)          │
│ [✓] SQLite WAL & Telemetría                              │
│     ↳ Canal activo (cuentas y rotaciones registradas)    │
│ [✓] Tarjeta cpamc-quota-card                             │
│     ↳ Montada e interceptada en el riel de Gentle-Shell │
├──────────────────────────────────────────────────────────┤
│ ✔ Los 4 componentes convergen en perfecta armonía.       │
╰──────────────────────────────────────────────────────────╯
```

> **Autoreparación rápida**: Si alguna verificación falla (por ejemplo, caché desactualizada o TUI en espera), ejecuta `/cpamc doctor fix` para re-sincronizar automáticamente el catálogo y la tarjeta.

---

## 🌐 Conectividad Universal "Zero-Config"

El plugin está diseñado bajo el principio de **cero configuraciones manuales complejas**. Descubre automáticamente el endpoint de CPAMC evaluando la siguiente cascada en tiempo de ejecución:

1. **Variables de entorno**: `CLIPROXYAPI_BASE_URL` o `CPAMC_URL`.
2. **Archivo de enlace persistente (`~/.cliproxy_url`)**: Si tu CPAMC corre en otra máquina, basta con escribir `http://<ip>:<puerto>` en este archivo una sola vez.
3. **Auto-descubrimiento en `config.yaml`**: Lee automáticamente el puerto real configurado en CPAMC (`server.port: 8080`, `9000`, etc.), sin asumir puertos fijos.
4. **Loopbacks estándar**: `http://127.0.0.1:8317` y `http://localhost:8317`.
5. **Entornos de contenedor Docker / WSL**: Detección nativa de `http://host.docker.internal:8317`.

---

## 🎮 Comandos y Atajos en tu Agente

Una vez instalado, abre tu terminal con **`gentle-shell`** o **`pi`**:

- **`/model`**: Selector oficial donde verás tus **Pools Soberanos** publicados limpiamente (`cpamc/Pool-01-gemini`, `cpamc/Pool-02-gemini`, etc.). Todas las cuentas físicas rotan de forma opaca y protegida detrás de esta fachada.
- **`/cpamc-model`**: Selector complementario de modelos con balanceo inteligente.
- **`/cpamc doctor`**: Diagnóstico integral de los 4 componentes con autoreparación asistida.
- **`/incident`** o **`/autopsia`**: Abre en tu navegador la autopsia forense de CPAMC Console si el disyuntor anti-bucle frenó una anomalía.
- **`/model-default`**: Restablece el modelo del proyecto actual al default global de Pi.
- **`Ctrl+Alt+X`**: Alterna cíclicamente el modo del acordeón de la tarjeta lateral.

---

## 🔒 Arquitectura del Motor (Pure Virtual Isolation)

- **100% en RAM (Zero Disk Mutation)**: Todas las rotaciones de cuentas se realizan en la memoria del plugin (`ActiveLeader`). Los archivos OAuth físicos en disco (`/root/.cli-proxy-api/*.json` o `~/.cli-proxy-api/`) permanecen intactos y jamás son mutados ni renombrados.
- **Coexistencia Granular**:
  - Las cuentas físicas pertenecientes a pools se ocultan de `/model` para no saturar el catálogo.
  - Las cuentas libres (OpenAI, DeepSeek, Claude nativo, cuentas de prueba) conservan **100% el comportamiento nativo de CPAMC** ("Auth Files Management"), pasando limpiamente a `/model` con sus exclusiones de disco originales.
- **Inmunidad a Actualizaciones (`Anti-Update Safe`)**:
  - Interceptor en tiempo de ejecución sobre el Map `state.parts.set` de Gentle-Shell. Aunque actualices `gentle-pi` desde npm o se restaure el layout predeterminado, la tarjeta se re-envuelve de forma indestructible.

---

## 🧪 Validación y Calidad de Código

El repositorio cuenta con una suite completa de pruebas unitarias y de integración continua bajo metodología TDD:

```bash
# Probar la extensión de TypeScript (TUI, Acordeón, Guards, Red)
cd extensions/cpamc-auto-switcher
npm test

# Probar el motor en Go
go test ./...
cd plugins/auto-switcher-pro && go test ./...
```

**Resultado de Validación**: **77 de 77 pruebas unitarias pasando en verde**.

---

## 👥 Harnesses y Entornos Compatibles

- **Gentle-Shell**: Soporte visual completo en el riel lateral derecho (`cpamc-quota-card`), acordeón 3 modos, captura de mouse y carga nativa de skills en `~/.gentle-shell/agent/skills/`.
- **Wilox-Pi** (`~/.pi/agent-wilox/`): Soporte de orquestación Planned Workflow, integración de subagentes, telemetría y sensor anti-sobrediseño.
- **Pi Vanilla** (`~/.pi/agent/`): Integración fluida en terminal estándar con telemetría en Footer y skills transversales aprovisionados.
- **CLIProxyAPI Console (CPAMC v8.0.13+)**: Soporte nativo de plugin dinámico para Linux, macOS y Windows.

---

## 📄 Licencia

Este software está protegido por acuerdos de licencia comercial y uso autorizado bajo el ecosistema WiloxDev / CPAMC.
Para más información, consulta `plugins/auto-switcher-pro/internal/license/`.
