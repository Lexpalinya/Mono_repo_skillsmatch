import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@skillsmatch/api';

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export default trpcClient;
