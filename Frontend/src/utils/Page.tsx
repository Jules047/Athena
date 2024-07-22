import { Fragment, ReactNode, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

interface PageProps {
 children: ReactNode;
 title?: string;
 meta?: ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, title = '', meta }, ref) => (
 <Fragment>
    <Helmet>
      <title>{`${title} - DepannPC`}</title>
      {meta}
    </Helmet>

    <Box ref={ref}>
      {children}
    </Box>
 </Fragment>
));

export default Page;