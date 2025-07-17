import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@skillsmatch/api';

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3333/trpc',
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
