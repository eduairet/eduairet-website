import styles from './BarTint.module.scss';

// iOS Safari tints its bars from fixed elements touching the screen edges and
// skips gradient backgrounds, so these strips carry the theme's plain color.
export default function BarTint() {
  return (
    <>
      <div aria-hidden='true' className={`${styles.strip} ${styles.top}`} />
      <div aria-hidden='true' className={`${styles.strip} ${styles.bottom}`} />
    </>
  );
}
