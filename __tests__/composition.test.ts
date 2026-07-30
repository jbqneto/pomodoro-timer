import { describe, expect, it } from 'vitest';
import { createFreeAppServices } from '@/composition/create-free-app-services';
import { BrowserClock } from '@/infrastructure/time/browser-clock';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';
import { VercelProductAnalytics } from '@/infrastructure/analytics/vercel-product-analytics';
describe('free app composition',()=>{it('selects local services and Noop when disabled',()=>{const s=createFreeAppServices(false);expect(s.clock).toBeInstanceOf(BrowserClock);expect(s.analytics).toBeInstanceOf(NoopProductAnalytics);expect(s.configRepository).toBeTruthy();expect(s.timerStorage).toBeTruthy();expect(s.engagementService.repository).toBeTruthy()});it('selects Vercel when enabled',()=>expect(createFreeAppServices(true).analytics).toBeInstanceOf(VercelProductAnalytics))});
