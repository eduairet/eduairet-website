import { getDictionary } from '@/app/[locale]/dictionaries';
import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';
import SectionWrapper from '@/components/wrappers/SectionWrapper/SectionWrapper';
import PageTransition from '@/components/wrappers/PageTransition/PageTransition';
import type { LocaleProps } from '@/models';
import { buildPageMetadata } from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return buildPageMetadata((await params).locale, 'contact');
}

export default async function Contact({ params }: LocaleProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);
  return (
    <PageTransition>
      <SectionWrapper>
        <header>
          <h1>{content.contact.title}</h1>
        </header>
        <ContactForm />
      </SectionWrapper>
    </PageTransition>
  );
}
