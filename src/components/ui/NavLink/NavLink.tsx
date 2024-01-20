'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface IProps {
  href: string;
  text: string;
}

export default function NavLink({ href, text }: IProps) {
  const pathname = usePathname();

  return (
    <Link href={href} className={pathname == href ? 'active' : ''}>
      {text}
    </Link>
  );
}
