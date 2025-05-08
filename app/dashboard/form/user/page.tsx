import { getGithubUser } from '@/app/lib/data';
import { BackButton } from '@/app/ui/back-button';
import { Box, Link } from '@mui/material';

import NextLink from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
  }>;
}) {
  const { id = '' } = await searchParams;
  const data = await getGithubUser(id);

  return (
    <Box sx={{ padding: 2 }}>
      <BackButton>Back</BackButton>
      <Box sx={{ py: 2 }}>Name: {data.name}</Box>
    </Box>
  );
}
