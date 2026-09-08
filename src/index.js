import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as pbi from "./powerbi-client.js";

const server = new McpServer({
  name: "powerbi-personal",
  version: "1.0.0",
});

function asText(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

server.registerTool(
  "list_workspaces",
  {
    title: "Listar workspaces",
    description: "Lista los workspaces de Power BI accesibles con tu cuenta personal.",
    inputSchema: {},
  },
  async () => asText(await pbi.listWorkspaces())
);

server.registerTool(
  "list_datasets",
  {
    title: "Listar datasets",
    description: "Lista los datasets (modelos semanticos) de un workspace.",
    inputSchema: { workspaceId: z.string().describe("ID del workspace") },
  },
  async ({ workspaceId }) => asText(await pbi.listDatasets(workspaceId))
);

server.registerTool(
  "list_reports",
  {
    title: "Listar reportes",
    description: "Lista los reportes de un workspace.",
    inputSchema: { workspaceId: z.string().describe("ID del workspace") },
  },
  async ({ workspaceId }) => asText(await pbi.listReports(workspaceId))
);

server.registerTool(
  "list_report_pages",
  {
    title: "Listar paginas de un reporte",
    description: "Lista las paginas (pestanas) de un reporte.",
    inputSchema: {
      workspaceId: z.string().describe("ID del workspace"),
      reportId: z.string().describe("ID del reporte"),
    },
  },
  async ({ workspaceId, reportId }) => asText(await pbi.listReportPages(workspaceId, reportId))
);

server.registerTool(
  "execute_dax",
  {
    title: "Ejecutar consulta DAX",
    description: "Ejecuta una consulta DAX contra un dataset y devuelve la tabla resultante.",
    inputSchema: {
      workspaceId: z.string().describe("ID del workspace"),
      datasetId: z.string().describe("ID del dataset"),
      daxQuery: z.string().describe("Consulta DAX, ej: EVALUATE INFO.VIEW.TABLES()"),
    },
  },
  async ({ workspaceId, datasetId, daxQuery }) =>
    asText(await pbi.executeDax(workspaceId, datasetId, daxQuery))
);

server.registerTool(
  "refresh_dataset",
  {
    title: "Refrescar dataset",
    description: "Dispara un refresh asincronico de un dataset.",
    inputSchema: {
      workspaceId: z.string().describe("ID del workspace"),
      datasetId: z.string().describe("ID del dataset"),
    },
  },
  async ({ workspaceId, datasetId }) => asText(await pbi.refreshDataset(workspaceId, datasetId))
);

const transport = new StdioServerTransport();
await server.connect(transport);
