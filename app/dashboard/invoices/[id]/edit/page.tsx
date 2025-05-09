import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { notFound } from "next/navigation";

export default async function Page({params}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound()
  }

  return <main>
    <Breadcrumbs breadcrumbs={[
      { label: 'Invoices', href: '/dashboard/invoices' },
      { label: 'Edit Invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
    ]} />
    <EditInvoiceForm customers={customers} invoice={invoice} />
  </main>;
}
