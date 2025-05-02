'use client';
import { useActionState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitMyForm } from '@/app/lib/actions';
import { MyFormSchema } from '@/app/lib/definitions';

const initialState = {
  success: '',
  error: '',
};

const MyForm = () => {
  const [state, formAction, isPending] = useActionState(
    submitMyForm,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      console.log(state.success);
    } else if (state?.error) {
      console.error(state.error);
    }
  }, [state]);

  const form = useForm({
    resolver: zodResolver(MyFormSchema),
    mode: 'all',
    defaultValues: {
      userName: '',
      email: '',
    },
  });

  return (
    <form
      action={formAction}
      onSubmit={form.handleSubmit((_, e) => e?.target.submit())}
    >
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Controller
            name="userName"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="User Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={isPending}
            value={isPending ? 'Submitting...' : 'Submit'}
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MyForm;
