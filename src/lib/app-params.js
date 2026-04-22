// App parameter helper: reads settings from query params, localStorage, or environment variables.

const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
  // Convert camelCase or snake_case names into lowercase snake_case.
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    // In a Node environment, browser APIs are unavailable.
    return defaultValue;
  }

  const storageKey = `khanyisa_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    // Clean the query string after reading sensitive token values.
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    // Persist URL-provided values into localStorage for later use.
    if (typeof storage?.setItem === 'function') storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue) {
    // Fall back to environment-provided defaults.
    if (typeof storage?.setItem === 'function') storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  const storedValue = typeof storage?.getItem === 'function' ? storage.getItem(storageKey) : null;
  if (storedValue) {
    return storedValue;
  }

  return null;
}

const getAppParams = () => {
  if (getAppParamValue("clear_access_token") === 'true') {
    // Allow the app to clear saved tokens using a query param flag.
    if (typeof storage?.removeItem === 'function') {
      storage.removeItem('khanyisa_access_token');
      storage.removeItem('token');
    }
  }

  return {
    appId: getAppParamValue("app_id", { defaultValue: import.meta.env?.VITE_KHANYISA_APP_ID }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: getAppParamValue("from_url", { defaultValue: typeof window !== 'undefined' ? window.location.href : '' }),
    functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env?.VITE_KHANYISA_FUNCTIONS_VERSION }),
    appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env?.VITE_KHANYISA_APP_BASE_URL }),
  }
}

export const appParams = {
  ...getAppParams()
}
