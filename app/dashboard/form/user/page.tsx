import { getGithubUser } from '@/app/lib/actions';
import { Box } from '@mui/material';

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
      <Box sx={{ py: 2 }}>Name: {data.name}</Box>
    </Box>
  );
}
