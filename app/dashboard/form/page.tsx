import MyForm from "@/app/ui/form/my-form";
import { Box } from "@mui/material";

export default async function Form() {
  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ py: 2 }}>MyForm</Box>
      <MyForm />
    </Box>
  )
}