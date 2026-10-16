import styles from './ArrowIcon.module.scss';

const PATHS = {
  left: 'M15.5 12h-7M11.5 8.5 8 12l3.5 3.5',
  right: 'M8.5 12h7M12.5 8.5 16 12l-3.5 3.5',
  out: 'M9.5 14.5l5-5M10.5 9.5h4v4',
};

interface IProps {
  direction: keyof typeof PATHS;
}

export default function ArrowIcon({ direction }: IProps) {
  return (
    <svg
      className={`${styles.arrow} ${styles[direction]}`}
      viewBox='0 0 24 24'
      width='24'
      height='24'
      aria-hidden='true'
      focusable='false'
    >
      <circle cx='12' cy='12' r='10.5' />
      <path d={PATHS[direction]} />
    </svg>
  );
}
