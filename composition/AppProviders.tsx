import type { Language } from '@/i18n/types';
"use client";
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { TimerProvider } from '@/context/TimerContext';
import { FeedbackStateProvider } from '@/context/FeedbackContext';
import { AppServices, createFreeAppServices } from './create-free-app-services';
import { getLocalDateKey } from '@/infrastructure/persistence/local-storage-timer.storage';
function Runtime({services,children}:{services:AppServices;children:ReactNode}){const [visible,setVisible]=useState(false);const {askForOccasionalFeedback}=useConfig();const completed=useCallback(()=>{const result=services.engagementService.completeFocus(getLocalDateKey(new Date(services.clock.now())),askForOccasionalFeedback);setVisible(result.prompt)},[askForOccasionalFeedback,services]);return <FeedbackStateProvider visible={visible} hide={()=>setVisible(false)}><TimerProvider storage={services.timerStorage} clock={services.clock} analytics={services.analytics} onFocusCompleted={completed}>{children}</TimerProvider></FeedbackStateProvider>}
export function AppProviders({children,services,initialLanguage='en'}:{children:ReactNode;services?:AppServices;initialLanguage?:Language}){const selected=useMemo(()=>services??createFreeAppServices(),[services]);return <AnalyticsProvider analytics={selected.analytics}><ThemeProvider><LanguageProvider initialLanguage={initialLanguage}><ConfigProvider repository={selected.configRepository} analytics={selected.analytics}><Runtime services={selected}>{children}</Runtime></ConfigProvider></LanguageProvider></ThemeProvider></AnalyticsProvider>}
