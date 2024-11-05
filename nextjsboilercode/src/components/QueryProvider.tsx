// page.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/app/page';

const queryClient = new QueryClient();

const QueryProvider= ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);

export default QueryProvider;
