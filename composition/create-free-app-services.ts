import { ConfigRepository } from '@/infrastructure/persistence/config.repository';
import { defaultConfigRepository } from '@/infrastructure/persistence/local-storage-config.repository';
import { TimerStorage } from '@/infrastructure/persistence/timer-storage';
import { defaultTimerStorage } from '@/infrastructure/persistence/local-storage-timer.storage';
import { Clock } from '@/application/ports/clock';
import { ProductAnalytics } from '@/application/ports/product-analytics';
import { BrowserClock } from '@/infrastructure/time/browser-clock';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';
import { UmamiProductAnalytics } from '@/infrastructure/analytics/umami-product-analytics';
import { EngagementService } from '@/application/engagement/engagement-service';
import { browserEngagementRepository } from '@/infrastructure/persistence/local-storage-engagement.repository';
export type AppServices={configRepository:ConfigRepository;timerStorage:TimerStorage;clock:Clock;analytics:ProductAnalytics;engagementService:EngagementService};
export function createFreeAppServices(enabled=process.env.NODE_ENV==='production'):AppServices{return {configRepository:defaultConfigRepository,timerStorage:defaultTimerStorage,clock:new BrowserClock(),analytics:enabled?new UmamiProductAnalytics():new NoopProductAnalytics(),engagementService:new EngagementService(browserEngagementRepository)};}
