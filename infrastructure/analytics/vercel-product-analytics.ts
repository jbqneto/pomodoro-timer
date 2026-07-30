import { track } from '@vercel/analytics';
import { ProductAnalytics, ProductEvent } from '@/application/ports/product-analytics';
export class VercelProductAnalytics implements ProductAnalytics {
  track(event: ProductEvent): void { try { track(event.name, event.properties); } catch { /* Metrics are always best-effort. */ } }
}
