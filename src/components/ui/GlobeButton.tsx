'use client';

import { useContext } from 'react';
import IconButton from '@/components/ui/IconButton/IconButton';
import { LanguageContext } from '@/store/LanguageProvider';

interface IProps {
  isActive: boolean;
  onClick: () => void;
}

export default function GlobeButton({ isActive, onClick }: IProps) {
  const { content } = useContext(LanguageContext);

  return (
    <IconButton
      title={content.buttons.langsButton.title}
      ariaLabel={content.buttons.langsButton.ariaLabel}
      isActive={isActive}
      onClick={onClick}
    >
      <path d='M50 10c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm30.7 24H66.8c-1.4-7-3.7-12.9-6.5-17.1 8.9 2.8 16.2 9 20.4 17.1zm4 16c0 3.7-.6 7.3-1.7 10.7H67.7c.4-3.4.7-7 .7-10.7s-.2-7.3-.7-10.7H83c1.1 3.4 1.7 7 1.7 10.7zM50 84.7c-3.8 0-8.8-6.9-11.4-18.7h22.8C58.8 77.7 53.8 84.7 50 84.7zm-12.3-24c-.5-3.3-.7-6.9-.7-10.7s.3-7.4.7-10.7h24.6c.5 3.3.7 6.9.7 10.7s-.3 7.4-.7 10.7H37.7zM15.3 50c0-3.7.6-7.3 1.7-10.7h15.3c-.4 3.4-.7 7-.7 10.7s.2 7.3.7 10.7H17c-1.1-3.4-1.7-7-1.7-10.7zM50 15.3c3.8 0 8.8 6.9 11.4 18.7H38.6c2.6-11.7 7.6-18.7 11.4-18.7zm-10.3 1.6C36.8 21.1 34.6 27 33.2 34H19.3c4.2-8.1 11.5-14.3 20.4-17.1zM19.3 66h13.9c1.4 7 3.7 12.9 6.5 17.1-8.9-2.8-16.2-9-20.4-17.1zm41 17.1c2.8-4.2 5.1-10.1 6.5-17.1h13.9c-4.2 8.1-11.5 14.3-20.4 17.1z' />
    </IconButton>
  );
}
