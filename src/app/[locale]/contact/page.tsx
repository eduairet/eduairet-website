import { getDictionary } from '@/app/[locale]/dictionaries';
import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';
import SectionWrapper from '@/components/wrappers/SectionWrapper/SectionWrapper';
import { buildPageMetadata, type LocaleParams } from '@/utils/server';

export async function generateMetadata({ params }: LocaleParams) {
  return buildPageMetadata((await params).locale, 'contact');
}

export default async function Contact({ params }: LocaleParams) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);
  return (
    <SectionWrapper>
      <header>
        <h1>{content.contact.title}</h1>
      </header>
      <ContactForm />
    </SectionWrapper>
  );
}
