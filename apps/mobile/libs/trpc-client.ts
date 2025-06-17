import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@skillsmatch/api';

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://192.168.100.25:3000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...(options as RequestInit),
          credentials: 'include',
        });
      },
    }),
  ],
});

export default trpcClient;
