import { createAppLogger } from '@archiq/log';

export const log: ReturnType<typeof createAppLogger> = createAppLogger({
  service: 'ai',
  production: process.env?.NODE_ENV === 'production',
});
