import { getGithubUser } from '@/app/lib/data';
import { BackButton } from '@/app/ui/back-button';
import SearchForm from '@/app/ui/form/search-form';
import Search from '@/app/ui/search';
import { Box, Button, TextField } from '@mui/material';
import Form from 'next/form';

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
      <SearchForm data={{ id }} />
    </Box>
  );
}
