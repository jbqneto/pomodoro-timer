import { ConfigRepository } from '@/infrastructure/persistence/config.repository';
import { defaultConfigRepository } from '@/infrastructure/persistence/local-storage-config.repository';
import { TimerStorage } from '@/infrastructure/persistence/timer-storage';
import { defaultTimerStorage } from '@/infrastructure/persistence/local-storage-timer.storage';
import { Clock } from '@/application/ports/clock';
import { ProductAnalytics } from '@/application/ports/product-analytics';
import { BrowserClock } from '@/infrastructure/time/browser-clock';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';
import { VercelProductAnalytics } from '@/infrastructure/analytics/vercel-product-analytics';
import { EngagementService } from '@/application/engagement/engagement-service';
import { browserEngagementRepository } from '@/infrastructure/persistence/local-storage-engagement.repository';
export type AppServices={configRepository:ConfigRepository;timerStorage:TimerStorage;clock:Clock;analytics:ProductAnalytics;engagementService:EngagementService};
export function createFreeAppServices(enabled=process.env.NODE_ENV==='production'&&process.env.NEXT_PUBLIC_PRODUCT_ANALYTICS_ENABLED==='true'):AppServices{return {configRepository:defaultConfigRepository,timerStorage:defaultTimerStorage,clock:new BrowserClock(),analytics:enabled?new VercelProductAnalytics():new NoopProductAnalytics(),engagementService:new EngagementService(browserEngagementRepository)};}
