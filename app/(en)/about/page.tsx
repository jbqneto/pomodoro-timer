import AboutContent from '@/components/AboutContent';
import MainTemplate from '@/components/templates/main';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('en', 'about');

export default function EnglishAbout() {
  return <MainTemplate initialLanguage="en"><AboutContent /></MainTemplate>;
}
