import SvgWrapper from '../layout/SvgWrapper/SvgWrapper';

interface IProps {
  on: boolean;
}

export default function Bulb({ on = true }: IProps) {
  return (
    <SvgWrapper>
      {on ? (
        <path d='M14 42.2c0-2.1 1.1-3.2 3.2-3.2h9l-.1 6.4h-9c-2 0-3.1-1.1-3.1-3.2zm9.4 23.1c0-.8.4-1.5 1.2-2.2l5.5-5.5 3.5 5.4-4.6 4.6c-.7.7-1.4 1.1-2.2 1.1s-1.6-.4-2.3-1.1c-.8-.7-1.1-1.5-1.1-2.3zm0-46.4c0-.8.4-1.5 1.1-2.3.7-.7 1.5-1.1 2.3-1.1.8 0 1.5.4 2.2 1.2l6.4 6.4-4.4 4.5-6.4-6.4c-.8-.7-1.2-1.5-1.2-2.3zm15.3 45.2c-.6-1.3-1.6-3-2.9-5-1.9-2.8-3.3-5.4-4.3-7.8-1-2.4-1.5-5.4-1.5-9.1 0-3.6.9-7 2.7-10 1.8-3.1 4.2-5.5 7.3-7.3 3.1-1.8 6.4-2.7 10-2.7 3.6 0 7 .9 10 2.7 3.1 1.8 5.5 4.2 7.3 7.3 1.8 3.1 2.7 6.4 2.7 10 0 3.7-.5 6.7-1.5 9.1-1 2.4-2.4 5-4.3 7.8-1.3 2-2.3 3.6-2.9 5-.6 1.3-.9 2.8-.9 4.5H39.6c0-1.7-.3-3.2-.9-4.5zm2.1 16.7c-.8-.8-1.2-1.9-1.2-3.4v-4.9h20.8v4.9c0 1.5-.4 2.6-1.2 3.4-.7.8-1.8 1.2-3.2 1.2H44c-1.4 0-2.5-.4-3.2-1.2zM50 6.2c2.1 0 3.2 1.1 3.2 3.2v9h-6.4v-9c0-2.2 1.1-3.2 3.2-3.2zm14.6 16.9 6.4-6.4c.7-.7 1.4-1.1 2.2-1.2.8 0 1.5.3 2.3 1.1.7.7 1.1 1.5 1.1 2.3 0 .8-.4 1.5-1.1 2.3L69 27.6l-4.4-4.5zM66.4 63l3.5-5.4 5.5 5.5c.7.7 1.1 1.4 1.2 2.2 0 .8-.3 1.5-1.1 2.3-.7.7-1.5 1.1-2.3 1.1-.8 0-1.5-.4-2.3-1.1L66.4 63zm7.4-24h9c2.1 0 3.2 1.1 3.2 3.2s-1.1 3.2-3.2 3.2h-9V39z' />
      ) : (
        <path d='M38.7 64.1c-.6-1.3-1.6-3-2.9-5-1.9-2.8-3.3-5.4-4.3-7.8-1-2.4-1.5-5.4-1.5-9.1 0-3.6.9-7 2.7-10 1.8-3.1 4.2-5.5 7.3-7.3 3.1-1.8 6.4-2.7 10-2.7 3.6 0 7 .9 10 2.7 3.1 1.8 5.5 4.2 7.3 7.3 1.8 3.1 2.7 6.4 2.7 10 0 3.7-.5 6.7-1.5 9.1-1 2.4-2.4 5-4.3 7.8-1.3 2-2.3 3.6-2.9 5-.6 1.3-.9 2.8-.9 4.5H39.6c0-1.7-.3-3.2-.9-4.5zM30 42.2c0-2.1 1.1-3.2 3.2-3.2h17.1v6.4H33.2c-2.1 0-3.2-1.1-3.2-3.2zM35.4 31c0-.8.3-1.5 1.1-2.3.7-.7 1.5-1.1 2.3-1.1s1.5.4 2.2 1.1l12.2 12.2-4.5 4.5-12.1-12.2c-.8-.7-1.2-1.4-1.2-2.2zm0 22.4c0-.8.4-1.5 1.1-2.2L48.7 39l4.5 4.5L41 55.6c-.7.7-1.4 1.1-2.2 1.2-.8 0-1.5-.3-2.3-1.1-.7-.8-1.1-1.5-1.1-2.3zm5.4 27.4c-.8-.8-1.2-1.9-1.2-3.4v-4.9h20.8v4.9c0 1.5-.4 2.6-1.2 3.4-.7.8-1.8 1.2-3.2 1.2H44c-1.4 0-2.5-.4-3.2-1.2zM50 22.2c2.1 0 3.2 1.1 3.2 3.2v17.1h-6.4V25.4c0-2.2 1.1-3.2 3.2-3.2zm-3.2 18.7L59 28.7c.7-.7 1.5-1.1 2.3-1.1.8 0 1.5.4 2.3 1.1.7.7 1.1 1.5 1.1 2.3 0 .8-.4 1.5-1.2 2.2L51.3 45.4l-4.5-4.5zm0 2.5 4.5-4.5 12.2 12.2c.7.7 1.1 1.4 1.1 2.2s-.4 1.6-1.1 2.3c-.7.7-1.5 1.1-2.3 1.1-.8 0-1.5-.4-2.2-1.2L46.8 43.4zm2.9-4.4h17.1c2.1 0 3.2 1.1 3.2 3.2s-1.1 3.2-3.2 3.2H49.7V39z' />
      )}
    </SvgWrapper>
  );
}
