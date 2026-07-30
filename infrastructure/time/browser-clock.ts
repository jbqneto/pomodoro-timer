import { Clock } from '@/application/ports/clock';
export class BrowserClock implements Clock { now(): number { return Date.now(); } }
