import { getAccessToken } from "./auth.js";

const BASE_URL = "https://api.powerbi.com/v1.0/myorg";

async function callApi(path, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Power BI API ${method} ${path} -> ${res.status}: ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function listWorkspaces() {
  const data = await callApi("/groups?$top=200");
  return data.value.map((g) => ({ id: g.id, name: g.name, type: g.type }));
}

export async function listDatasets(workspaceId) {
  const data = await callApi(`/groups/${workspaceId}/datasets`);
  return data.value.map((d) => ({
    id: d.id,
    name: d.name,
    configuredBy: d.configuredBy,
    isRefreshable: d.isRefreshable,
  }));
}

export async function listReports(workspaceId) {
  const data = await callApi(`/groups/${workspaceId}/reports`);
  return data.value.map((r) => ({
    id: r.id,
    name: r.name,
    datasetId: r.datasetId,
    webUrl: r.webUrl,
  }));
}

export async function listReportPages(workspaceId, reportId) {
  const data = await callApi(`/groups/${workspaceId}/reports/${reportId}/pages`);
  return data.value.map((p) => ({
    name: p.name,
    displayName: p.displayName,
    order: p.order,
  }));
}

export async function executeDax(workspaceId, datasetId, daxQuery) {
  const data = await callApi(`/groups/${workspaceId}/datasets/${datasetId}/executeQueries`, {
    method: "POST",
    body: {
      queries: [{ query: daxQuery }],
      serializerSettings: { includeNulls: true },
    },
  });
  return data.results[0].tables[0];
}

export async function refreshDataset(workspaceId, datasetId) {
  await callApi(`/groups/${workspaceId}/datasets/${datasetId}/refreshes`, {
    method: "POST",
    body: { notifyOption: "NoNotification" },
  });
  return { status: "refresh_started" };
}
