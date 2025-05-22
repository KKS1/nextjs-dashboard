import { Box, Button, TextField } from '@mui/material';
import Form from 'next/form';

export const SearchForm = ({
  data,
}: {
  data: {
    id?: string;
  };
}) => {
  const { id = '' } = data;
  return (
    <Box>
      <Box sx={{ py: 2 }}>Search Form</Box>
      <Form action="/dashboard/form/user">
        {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
        <TextField
          label="User ID"
          name="id"
          defaultValue={id}
          required
          autoFocus
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Form>
    </Box>
  );
};
export default SearchForm;
