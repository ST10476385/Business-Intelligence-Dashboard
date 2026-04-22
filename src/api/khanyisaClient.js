// API client wrapper for the application.
// This file centralizes the backend client configuration and exposes it to pages and components.
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Create the main SDK client using configured app parameters.
export const khanyisaApi = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});
