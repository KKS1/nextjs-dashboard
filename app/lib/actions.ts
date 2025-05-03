'use server'
import { z } from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { MyFormSchema } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { require: true } });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a valid customer.',
    required_error: 'Please select a customer.',
  }),
  amount: z.coerce.number({
    invalid_type_error: 'Please enter an amount.'
  }).gt(0, {
    message: 'Please enter an amount greater than $0.'
  }),
  date: z.string(),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select valid invoice type.',
    required_error: 'Please select an invoice type',
  }),
});

const InvoiceSchema = FormSchema.omit({ id: true, date: true });

export type State = {
  message?: string | null;
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  },
}

export async function createInvoice(prevState: State, formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  const validatedFields = InvoiceSchema.safeParse(obj);

  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  let { customerId, amount, status } = validatedFields.data
  amount *= 100; // convert to cents
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      values (${customerId}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    console.error(error)
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  const validatedFields = InvoiceSchema.safeParse(obj);

  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Edit the Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  let { customerId, amount, status } = validatedFields.data
  amount *= 100; // convert to cents
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amount}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error)
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error(error)
  }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}

export async function submitMyForm(prevState: any, formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  const validatedFields = MyFormSchema.safeParse(obj);

  console.log(formData)

  if (!validatedFields.success) {
    return {
      error: 'Missing Fields. Failed to submit form.',
      // errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return {
    success: 'Form submitted successfully',
    error: '',
  }
}

export async function getGithubUser(id: string) {
  const response = await fetch(`https://api.github.com/users/${id}`, {
    next: {
      revalidate: 60,
    },
  });
  const data = await response.json();
  return data;
}
