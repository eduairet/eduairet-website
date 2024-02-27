import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';
import SectionWrapper from '@/components/wrappers/SectionWrapper/SectionWrapper';
import GoogleCaptchaWrapper from '@/components/external/GoogleCaptchaWrapper/GoogleCaptchaWrapper';

export { generateMetadata } from '@/utils/server';

interface IProps {
  params: {
    locale: string;
  };
}

export default async function Contact({ params: { locale } }: IProps) {
  const content = await getDictionary(locale as Lang);

  return (
    <GoogleCaptchaWrapper>
      <SectionWrapper>
        <header>
          <h1>{content.contact.title}</h1>
          <h2>{content.contact.subtitle}</h2>
        </header>
        <ContactForm />
      </SectionWrapper>
    </GoogleCaptchaWrapper>
  );
}
