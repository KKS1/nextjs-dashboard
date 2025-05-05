'use client';
import { useActionState, useEffect, useTransition } from 'react';
import Grid from '@mui/material/Grid';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitMyForm } from '@/app/lib/actions';
import { MyFormSchema, MyFormValues } from '@/app/lib/definitions';

const initialState = {
  success: '',
  error: '',
};

const MyForm = () => {
  const [, startTransition] = useTransition();
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

  const onSubmit = (data: MyFormValues) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      await formAction(formData);
      form.reset();
    });
  };

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
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
