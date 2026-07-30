"use client";
import { createContext, ReactNode, useContext, useState } from 'react';
const FeedbackContext=createContext<{visible:boolean;hide():void}|undefined>(undefined);
export function FeedbackStateProvider({visible,hide,children}:{visible:boolean;hide():void;children:ReactNode}){return <FeedbackContext.Provider value={{visible,hide}}>{children}</FeedbackContext.Provider>}
export function useFeedback(){return useContext(FeedbackContext)??{visible:false,hide:()=>{}};}
