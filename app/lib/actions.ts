'use server'
import {z} from 'zod'
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: {require: true}});

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  date: z.string(),
  status: z.enum(['pending', 'paid']),
});

const InvoiceSchema = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  let {customerId, amount, status} = InvoiceSchema.parse(obj);
  amount *= 100; // convert to cents
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    values (${customerId}, ${amount}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const obj = Object.fromEntries(formData.entries().filter(([_, value]) => !!value));
  let {customerId, amount, status} = InvoiceSchema.parse(obj);
  amount *= 100; // convert to cents
  const date = new Date().toISOString().split('T')[0];

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amount}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}