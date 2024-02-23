import { getDictionary } from '../dictionaries';
import { Lang } from '@/models';
import SectionWrapper from '@/components/wrappers/SectionWrapper/SectionWrapper';
import ContactForm from '@/components/pages/ContactForm/ContactForm';

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
        <h2>{content.contact.subtitle}</h2>
      </header>
      <ContactForm />
    </SectionWrapper>
  );
}
