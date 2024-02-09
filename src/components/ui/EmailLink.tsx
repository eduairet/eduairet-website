import IconButtonLink from './IconButton/IconButtonLink';

export default function EmailLink() {
  return (
    <IconButtonLink
      title='Email'
      ariaLabel='Email Link'
      href='mailto:hola@eduairet.com'
      external
    >
      <path d='M27.5 33.1c-1 0-1.9.8-1.9 1.9v2.6l20.2 16.6c2.4 2 5.9 2 8.3 0l20.2-16.6V35c0-1-.8-1.9-1.9-1.9H27.5zm-1.9 11.8V65c0 1 .8 1.9 1.9 1.9h45c1 0 1.9-.8 1.9-1.9V44.9L57.7 58.5c-4.5 3.7-11 3.7-15.5 0L25.6 44.9zM20 35c0-4.1 3.4-7.5 7.5-7.5h45c4.1 0 7.5 3.4 7.5 7.5v30c0 4.1-3.4 7.5-7.5 7.5h-45c-4.1 0-7.5-3.4-7.5-7.5V35z' />
    </IconButtonLink>
  );
}
