import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontSize: 12, color: "#6b7280" },
  value: { fontSize: 12, fontWeight: "bold" },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 24, color: "#6366f1" },
});

interface InvoicePdfDocumentProps {
  invoice: Invoice;
}

export function InvoicePdfDocument({ invoice }: InvoicePdfDocumentProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Invoice — {invoice.place}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>NIF</Text>
          <Text style={styles.value}>{invoice.nif}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(invoice.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Concept</Text>
          <Text style={styles.value}>{invoice.concept}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{invoice.accountType}</Text>
        </View>
        {invoice.description && (
          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{invoice.description}</Text>
          </View>
        )}
        <Text style={styles.total}>€{invoice.total.toFixed(2)}</Text>
      </Page>
    </Document>
  );
}
