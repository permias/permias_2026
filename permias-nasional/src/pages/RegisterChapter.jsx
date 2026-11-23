import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { ClubRegisterForm } from '../components/forms/ClubRegisterForm.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';

export function RegisterChapter() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title="Club Registration | PERMIAS Nasional"
        description="Register your student club with PERMIAS Nasional."
        path="/chapters/register"
      />
      <PageHeader image={PAGE_PHOTOS.register}
        eyebrow={t('chapters.register')}
        title={t('chapterRegister.title')}
        description={t('chapterRegister.sub')}
      />
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <ClubRegisterForm showBackLink />
        </Reveal>
      </div>
    </>
  );
}
