import AboutContent from '@/components/AboutContent';
import MainTemplate from '@/components/templates/main';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('pt', 'about');

export default function PortugueseAbout() {
  return <MainTemplate initialLanguage="pt"><AboutContent /></MainTemplate>;
}
