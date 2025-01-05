import { InvoiceForm, Title } from "@/components";
import { getAccounts, getConcepts } from "@/actions";

import { Concept } from '../../../../../interfaces/Invoices/invoice.interface';

interface Props {
  params: {
    slug: string;
  };
}

export default async function InvoicePage({ params }: Props) {
  const { slug } = params;

  const title = slug === "new" ? "New Invoice" : "Edit Invoice";

  const { concepts } = await getConcepts();
  const { accounts } = await getAccounts();

  return (
    <>
      <Title title={title} />

      <InvoiceForm invoice={{}} concepts={concepts} accounts={accounts} />
    </>
  );
}
