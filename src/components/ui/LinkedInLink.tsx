import IconButtonLink from './IconButton/IconButtonLink';

export default function LinkedInLink() {
  return (
    <IconButtonLink
      title='LinkedIn'
      ariaLabel='LinkedIn Link'
      href='https://www.linkedin.com/in/eduairet/'
      external
    >
      <path d='M80 15H20c-2.8 0-5 2.3-5 5v60c0 2.8 2.2 5 5 5h60c2.8 0 5-2.3 5-5V20c0-2.7-2.2-5-5-5zM36.2 75H25.8V41.6h10.4V75zM31 37c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm44 38H64.7V58.8c0-3.9-.1-8.9-5.4-8.9-5.4 0-6.2 4.2-6.2 8.6V75H42.7V41.6h10v4.6h.1c1.4-2.6 4.8-5.4 9.8-5.4 10.5 0 12.5 6.9 12.5 15.9V75z' />
    </IconButtonLink>
  );
}
