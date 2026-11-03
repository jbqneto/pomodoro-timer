import FocusHome from '@/components/FocusHome';
import { pageMetadata, webApplicationJsonLd } from '@/lib/seo';

export const metadata = pageMetadata('pt', 'home');

export default function PortugueseHome() {
  return (
    <>
      <FocusHome initialLanguage="pt" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webApplicationJsonLd('pt') }} />
    </>
  );
}
