import { ProductAnalytics, ProductEvent } from '@/application/ports/product-analytics';
export class NoopProductAnalytics implements ProductAnalytics { track(_event: ProductEvent): void {} }
