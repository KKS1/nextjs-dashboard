import MyForm from '@/app/ui/form/my-form';
import { Box, Link } from '@mui/material';
import NextLink from 'next/link';

export default async function Page() {
  return (
    <Box sx={{ padding: 2 }}>
      <Link href="/dashboard/form/user?id=kks1" component={NextLink}>
        Git User
      </Link>
      <Box sx={{ py: 2 }}>MyForm</Box>
      <MyForm />
    </Box>
  );
}
