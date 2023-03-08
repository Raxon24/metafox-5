import { RefOf } from '@metafox/framework';
import { Box } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  onContentSize?: (width: number) => void;
  minHeight?: number;
  rowLength: number;
};

function GridMain(
  { children, onContentSize, minHeight, rowLength }: Props,
  ref: RefOf<HTMLDivElement>
) {
  const handleResize = React.useCallback(() => {
    // eslint-disable-next-line no-console

    if (!ref.current) return;

    if (onContentSize) onContentSize(ref.current.scrollWidth);
  }, [onContentSize, ref, rowLength]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <Box
      sx={{ position: 'relative', overflowX: 'auto', width: '100%', minHeight }}
      component="div"
      ref={ref}
    >
      {children}
    </Box>
  );
}

export default React.forwardRef(GridMain);
