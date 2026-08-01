import styles from './ScrollCue.module.scss';
import SvgWrapper from '@/components/wrappers/SvgWrapper';

interface IProps {
  label: string;
  target: string;
}

export default function ScrollCue({ label, target }: IProps) {
  return (
    <a href={`#${target}`} className={styles.cue} aria-label={label}>
      <SvgWrapper width={24} height={24} className={styles.chevron}>
        <path
          d='M6 9L12 15L18 9'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </SvgWrapper>
    </a>
  );
}
