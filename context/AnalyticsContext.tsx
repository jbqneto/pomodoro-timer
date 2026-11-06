"use client";

import { createContext, ReactNode, useContext } from 'react';
import { ProductAnalytics } from '@/application/ports/product-analytics';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';

const AnalyticsContext = createContext<ProductAnalytics>(new NoopProductAnalytics());

export function AnalyticsProvider({ analytics, children }: { analytics: ProductAnalytics; children: ReactNode }) {
  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
}

export function useProductAnalytics(): ProductAnalytics {
  return useContext(AnalyticsContext);
}
