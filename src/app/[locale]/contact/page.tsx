import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';
import SectionWrapper from '@/components/wrappers/SectionWrapper/SectionWrapper';

export { generateMetadata } from '@/utils/server';

interface IProps {
  params: {
    locale: string;
  };
}

export default async function Contact({ params: { locale } }: IProps) {
  const content = await getDictionary(locale as Lang);

  return (
    <SectionWrapper>
      <header>
        <h1>{content.contact.title}</h1>
      </header>
      <ContactForm />
    </SectionWrapper>
  );
}
