// Shared React Query client for the whole app.
// This config controls default fetch behavior for all queries.
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Avoid refetching data when the user switches tabs.
			retry: 1, // Retry failed queries once before showing an error.
		},
	},
});