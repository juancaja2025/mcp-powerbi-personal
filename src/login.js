import { getAccessToken } from "./auth.js";
import * as pbi from "./powerbi-client.js";

console.log("Iniciando login con tu cuenta de Power BI...\n");

await getAccessToken({ onDeviceCode: (msg) => console.log(msg + "\n") });
console.log("Login OK. Token guardado localmente en .token-cache.json\n");

const workspaces = await pbi.listWorkspaces();
console.log(`Workspaces visibles con tu cuenta (${workspaces.length}):`);
for (const ws of workspaces) console.log(`  - ${ws.name}`);
