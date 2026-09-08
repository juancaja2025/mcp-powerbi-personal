import { PublicClientApplication } from "@azure/msal-node";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, "..", ".token-cache.json");

// Client ID publico de "Microsoft Azure PowerShell", app first-party de
// Microsoft habilitada para pedir tokens delegados contra la Power BI Service
// API sin necesidad de registrar una app propia ni admin consent adicional.
const CLIENT_ID = "1950a258-227b-4e31-a9cf-717495945fc2";
const AUTHORITY = "https://login.microsoftonline.com/organizations";
const SCOPES = ["https://analysis.windows.net/powerbi/api/.default"];

function loadCache() {
  try {
    return fs.readFileSync(CACHE_PATH, "utf-8");
  } catch {
    return null;
  }
}

function persistCache(data) {
  fs.writeFileSync(CACHE_PATH, data, { encoding: "utf-8", mode: 0o600 });
}

const cachePlugin = {
  beforeCacheAccess: async (ctx) => {
    const data = loadCache();
    if (data) ctx.tokenCache.deserialize(data);
  },
  afterCacheAccess: async (ctx) => {
    if (ctx.cacheHasChanged) persistCache(ctx.tokenCache.serialize());
  },
};

const pca = new PublicClientApplication({
  auth: { clientId: CLIENT_ID, authority: AUTHORITY },
  cache: { cachePlugin },
});

export async function getAccessToken({ onDeviceCode } = {}) {
  const accounts = await pca.getTokenCache().getAllAccounts();

  if (accounts.length > 0) {
    try {
      const result = await pca.acquireTokenSilent({
        account: accounts[0],
        scopes: SCOPES,
      });
      return result.accessToken;
    } catch {
      // el token/refresh venció o no es valido: cae al device code flow
    }
  }

  const result = await pca.acquireTokenByDeviceCode({
    scopes: SCOPES,
    deviceCodeCallback: (response) => {
      if (onDeviceCode) onDeviceCode(response.message);
      else console.error(response.message);
    },
  });
  return result.accessToken;
}
