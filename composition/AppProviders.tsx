"use client";
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { TimerProvider } from '@/context/TimerContext';
import { FeedbackStateProvider } from '@/context/FeedbackContext';
import { AppServices, createFreeAppServices } from './create-free-app-services';
import { getLocalDateKey } from '@/infrastructure/persistence/local-storage-timer.storage';
function Runtime({services,children}:{services:AppServices;children:ReactNode}){const [visible,setVisible]=useState(false);const {interfaceMode,askForOccasionalFeedback}=useConfig();const completed=useCallback(()=>{const result=services.engagementService.completeFocus(getLocalDateKey(new Date(services.clock.now())),askForOccasionalFeedback);if(result.gap)try{services.analytics.track({name:'returning_focus_completed',properties:{gap_bucket:result.gap,interface_mode:interfaceMode}})}catch{};setVisible(result.prompt)},[askForOccasionalFeedback,interfaceMode,services]);return <FeedbackStateProvider visible={visible} hide={()=>setVisible(false)}><TimerProvider storage={services.timerStorage} clock={services.clock} analytics={services.analytics} onFocusCompleted={completed}>{children}</TimerProvider></FeedbackStateProvider>}
export function AppProviders({children,services}:{children:ReactNode;services?:AppServices}){const selected=useMemo(()=>services??createFreeAppServices(),[services]);return <ThemeProvider><LanguageProvider><ConfigProvider repository={selected.configRepository} analytics={selected.analytics}><Runtime services={selected}>{children}</Runtime></ConfigProvider></LanguageProvider></ThemeProvider>}
