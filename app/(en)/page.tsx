import FocusHome from '@/components/FocusHome';
import { pageMetadata, webApplicationJsonLd } from '@/lib/seo';

export const metadata = pageMetadata('en', 'home');

export default function EnglishHome() {
  return (
    <>
      <FocusHome initialLanguage="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webApplicationJsonLd('en') }} />
    </>
  );
}
