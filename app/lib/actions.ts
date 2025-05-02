'use server'
import { z } from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { InvoiceFormData, InvoiceSchema, State } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { require: true } });


export async function createInvoice(prevState: State, formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  const validatedFields = InvoiceSchema.safeParse(obj);

  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
      formData: obj as unknown as InvoiceFormData,
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
