import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  return <main>
    <Breadcrumbs breadcrumbs={[
      { label: 'Invoices', href: '/dashboard/invoices' },
      { label: 'Create Invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
    ]} />
    <EditInvoiceForm customers={customers} invoice={invoice} />
  </main>;
}
