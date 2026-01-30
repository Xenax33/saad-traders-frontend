import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import type { Invoice } from '@/types/api';

// Professional PDF Styles - Clean, No Shiny Colors
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    paddingBottom: 120, // Extra space for footer with logo and QR
    fontFamily: 'Helvetica',
  },
  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLeftText: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginTop: 3,
  },
  // Info Sections
  infoSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
    paddingBottom: 3,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoColumn: {
    width: '48%',
  },
  infoRow: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },
  // Items Table
  table: {
    marginTop: 10,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderTopWidth: 2,
    borderBottomWidth: 1,
    borderTopColor: '#000000',
    borderBottomColor: '#000000',
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    borderBottomStyle: 'solid',
    paddingVertical: 7,
    paddingHorizontal: 6,
    minHeight: 32,
  },
  tableColHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    lineHeight: 1.3,
  },
  tableCol: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.3,
  },
  // Column Widths - Fixed widths optimized for content
  col1: {
    width: '4%',
    paddingRight: 4,
  },
  col2: {
    width: '10%',
    paddingRight: 4,
  },
  col3: {
    width: '16%',
    paddingRight: 6,
  },
  col4: {
    width: '5%',
    paddingRight: 3,
    textAlign: 'center',
  },
  col5: {
    width: '10%',
    paddingRight: 4,
    textAlign: 'center',
  },
  col6: {
    width: '8%',
    paddingRight: 4,
    textAlign: 'center',
  },
  colSroSchedule: {
    width: '10%',
    paddingRight: 4,
    textAlign: 'center',
  },
  colSroItem: {
    width: '8%',
    paddingRight: 4,
    textAlign: 'center',
  },
  col7: {
    width: '11%',
    paddingRight: 4,
    textAlign: 'right',
  },
  col8: {
    width: '9%',
    paddingRight: 4,
    textAlign: 'right',
  },
  col9: {
    width: '9%',
    textAlign: 'right',
  },
  // Totals Section
  totalsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
    color: '#000000',
    width: 150,
    textAlign: 'right',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    width: 100,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 150,
    textAlign: 'right',
    marginRight: 20,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 100,
    textAlign: 'right',
  },
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    borderTopStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  logoQRContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyLogo: {
    width: 72,
    height: 72,
    objectFit: 'contain',
  },
  fbrLogo: {
    width: 72,
    height: 72,
    objectFit: 'contain',
  },
  qrCode: {
    width: 72,
    height: 72,
    objectFit: 'contain',
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
  companyBranding: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  websiteText: {
    fontSize: 9,
    color: '#666666',
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  qrCodeDataURL?: string;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalSalesTax = 0;
    let totalDiscount = 0;
    let totalFED = 0;

    invoice.items?.forEach((item) => {
      subtotal += parseFloat(item.valueSalesExcludingST?.toString() || '0');
      totalSalesTax += parseFloat(item.salesTaxApplicable?.toString() || '0');
      totalDiscount += parseFloat(item.discount?.toString() || '0');
      totalFED += parseFloat(item.fedPayable?.toString() || '0');
    });

    const grandTotal = subtotal + totalSalesTax - totalDiscount + totalFED;

    return {
      subtotal,
      totalSalesTax,
      totalDiscount,
      totalFED,
      grandTotal,
    };
  };

  const totals = calculateTotals();
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Invoice Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Invoice Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>FBR Invoice Number</Text>
                <Text style={styles.infoValue}>{invoice.fbrInvoiceNumber || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reference Number</Text>
                <Text style={styles.infoValue}>{invoice.invoiceRefNo || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Date</Text>
                <Text style={styles.infoValue}>
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Type</Text>
                <Text style={styles.infoValue}>{invoice.invoiceType}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seller Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{invoice.user?.businessName || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NTN/CNIC</Text>
                <Text style={styles.infoValue}>{invoice.user?.ntncnic || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Province</Text>
                <Text style={styles.infoValue}>{invoice.user?.province || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{invoice.user?.address || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buyer Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Buyer Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{invoice.buyer?.businessName || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NTN/CNIC</Text>
                <Text style={styles.infoValue}>{invoice.buyer?.ntncnic || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Province</Text>
                <Text style={styles.infoValue}>{invoice.buyer?.province || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Registration Type</Text>
                <Text style={styles.infoValue}>{invoice.buyer?.registrationType || 'N/A'}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{invoice.buyer?.address || 'N/A'}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHeader, styles.col1]}>#</Text>
            <Text style={[styles.tableColHeader, styles.col2]}>HS Code</Text>
            <Text style={[styles.tableColHeader, styles.col3]}>Description</Text>
            <Text style={[styles.tableColHeader, styles.col4]}>Qty</Text>
            <Text style={[styles.tableColHeader, styles.col5]}>UoM</Text>
            <Text style={[styles.tableColHeader, styles.col6]}>Rate</Text>
            <Text style={[styles.tableColHeader, styles.colSroSchedule]}>SRO Schedule</Text>
            <Text style={[styles.tableColHeader, styles.colSroItem]}>SRO Item</Text>
            <Text style={[styles.tableColHeader, styles.col7]}>Value (Excl.)</Text>
            <Text style={[styles.tableColHeader, styles.col8]}>Sales Tax</Text>
            <Text style={[styles.tableColHeader, styles.col9]}>Total</Text>
          </View>

          {/* Table Rows */}
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.col1]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.col2]}>
                {item.hsCode?.hsCode || 'N/A'}
              </Text>
              <Text style={[styles.tableCol, styles.col3]}>
                {item.productDescription}
              </Text>
              <Text style={[styles.tableCol, styles.col4]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCol, styles.col5]}>
                {item.uoM}
              </Text>
              <Text style={[styles.tableCol, styles.col6]}>
                {item.rate}
              </Text>
              <Text style={[styles.tableCol, styles.colSroSchedule]}>
                {item.sroScheduleNo || '—'}
              </Text>
              <Text style={[styles.tableCol, styles.colSroItem]}>
                {item.sroItemSerialNo || '—'}
              </Text>
              <Text style={[styles.tableCol, styles.col7]}>
                Rs. {parseFloat(item.valueSalesExcludingST?.toString() || '0').toFixed(2)}
              </Text>
              <Text style={[styles.tableCol, styles.col8]}>
                Rs. {parseFloat(item.salesTaxApplicable?.toString() || '0').toFixed(2)}
              </Text>
              <Text style={[styles.tableCol, styles.col9]}>
                Rs. {parseFloat(item.totalValues?.toString() || '0').toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal (Excl. Tax):</Text>
            <Text style={styles.totalValue}>Rs. {totals.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sales Tax:</Text>
            <Text style={styles.totalValue}>Rs. {totals.totalSalesTax.toFixed(2)}</Text>
          </View>
          {totals.totalDiscount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>- Rs. {totals.totalDiscount.toFixed(2)}</Text>
            </View>
          )}
          {totals.totalFED > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>FED Payable:</Text>
              <Text style={styles.totalValue}>Rs. {totals.totalFED.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotalValue}>Rs. {totals.grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.companyBranding}>Invoice Generated by Saad Traders</Text>
            <Link style={styles.websiteText} src="https://saadtrader.pk">
              To make FBR Compliant invoices for your business visit: saadtrader.pk
            </Link>
            <Text style={styles.footerText}>
              Generated: {new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
            </Text>
          </View>
          
          <View style={styles.footerRight}>
            <Image src="/logos/company-logo.png" style={styles.companyLogo} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src="/logos/fbr-qr-code.png" style={styles.qrCode} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src="/logos/fbr-logo.png" style={styles.fbrLogo} />
          </View>
        </View>
      </Page>
    </Document>
  );
};
