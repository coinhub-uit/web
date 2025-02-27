import { SWRConfig } from 'swr';

export default function SwrConfig({ children }: { children: React.ReactNode }) {
  return <SWRConfig>{children}</SWRConfig>;
}
