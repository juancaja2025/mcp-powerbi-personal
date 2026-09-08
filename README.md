# MCP Power BI Personal

MCP para que Claude pueda consultar tu Power BI Service (workspaces, datasets, reportes, consultas DAX) usando **tu propia cuenta** de OCASA. No usa una cuenta de servicio compartida: cada persona ve exactamente los workspaces a los que ya tiene acceso en Power BI, ni más ni menos.

## Requisitos

- Windows con [Node.js](https://nodejs.org) 18 o superior instalado.
- [Claude Code](https://claude.com/claude-code) instalado (comando `claude` disponible en la terminal).
- Tu cuenta de Power BI de OCASA (la misma que usás para entrar a app.powerbi.com).

## Instalación (una sola vez)

1. Cloná el repo:

   ```powershell
   git clone https://github.com/juancaja2025/mcp-powerbi-personal.git
   cd mcp-powerbi-personal
   ```

2. Abrí PowerShell en esta carpeta y corré:

   ```powershell
   .\install.ps1
   ```

3. El script va a:
   - Instalar las dependencias.
   - Pedirte loguearte: te va a mostrar un **código** y una URL (`https://login.microsoft.com/device`). Abrila en el navegador, pegá el código, y confirmá con tu cuenta de OCASA.
   - Registrar el MCP en Claude Code automáticamente.

4. Reiniciá Claude Code (cerrá y abrí una sesión nueva).

Listo. A partir de ahí, en cualquier conversación con Claude podés pedirle que liste tus workspaces, exploré datasets, o corra consultas DAX contra tus tableros.

## Qué puede hacer Claude con esto

- `list_workspaces` — lista tus workspaces de Power BI.
- `list_datasets` — lista los datasets (modelos semánticos) de un workspace.
- `list_reports` — lista los reportes de un workspace.
- `list_report_pages` — lista las páginas de un reporte.
- `execute_dax` — ejecuta una consulta DAX contra un dataset (para traer datos puntuales).
- `refresh_dataset` — dispara un refresh de un dataset.

## Seguridad

- El login queda guardado en un archivo local `.token-cache.json`, **dentro de tu carpeta, en tu máquina**. No lo compartas ni lo subas a ningún lado — es equivalente a tu sesión de Power BI.
- Este MCP no otorga ningún permiso nuevo: solo te deja consultar, desde Claude, lo mismo que ya podés ver logueándote en app.powerbi.com con tu cuenta.
- El login usa el client ID público de "Microsoft Azure PowerShell", una app oficial de Microsoft — no requiere que un administrador de OCASA apruebe nada.

## Problemas comunes

- **"No se encontró Node.js"**: instalalo desde https://nodejs.org y volvé a correr `install.ps1`.
- **El código de dispositivo expiró**: volvé a correr `npm run login` dentro de la carpeta del proyecto.
- **No ves un workspace que esperabas**: es el mismo criterio que en app.powerbi.com — si no lo ves ahí logueado con tu cuenta, tampoco lo va a ver Claude. Pedí acceso al dueño del workspace.
