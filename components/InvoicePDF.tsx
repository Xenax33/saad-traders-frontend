import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import type { Invoice, PrintSettings, DefaultPrintSettings, CustomFieldOption } from '@/types/api';

// Professional PDF Styles - Clean, No Shiny Colors
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    paddingBottom: 60,
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
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    paddingHorizontal: 4,
  },
  tableCol: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.3,
    borderRightWidth: 0.5,
    borderRightColor: '#303030',
    borderRightStyle: 'solid',
    paddingHorizontal: 4,
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
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
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
  printSettings?: PrintSettings | DefaultPrintSettings | null;
  customFields?: CustomFieldOption[];
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, printSettings, customFields }) => {
  // Default settings if none provided
  const defaultVisibleFields = [
    'itemNumber',
    'productDescription',
    'hsCode',
    'quantity',
    'uoM',
    'rate',
    'totalValues',
    'valueSalesExcludingST',
    'salesTaxApplicable'
  ];

  const visibleFields = printSettings?.visibleFields || defaultVisibleFields;
  const columnWidths = printSettings?.columnWidths || {};
  const fontSize = printSettings?.fontSize || 'small';
  const tableBorders = printSettings?.tableBorders !== false;
  const showItemNumbers = printSettings?.showItemNumbers !== false;

  // Font sizes
  const fontSizeMap = {
    small: 9,
    medium: 10,
    large: 11,
  };
  const cellFontSize = fontSizeMap[fontSize];

  // Field labels and getter functions
  const fieldConfig: Record<string, { label: string; getValue: (item: any, index: number) => string }> = {
    itemNumber: {
      label: '#',
      getValue: (item, index) => String(index + 1),
    },
    productDescription: {
      label: 'Description',
      getValue: (item) => item.productDescription || 'N/A',
    },
    hsCode: {
      label: 'HS Code',
      getValue: (item) => item.hsCode?.hsCode || 'N/A',
    },
    quantity: {
      label: 'Qty',
      getValue: (item) => String(item.quantity || 0),
    },
    uoM: {
      label: 'UoM',
      getValue: (item) => item.uoM || 'N/A',
    },
    rate: {
      label: 'Sale Tax',
      getValue: (item) => String(item.rate || 0),
    },
    totalValues: {
      label: 'Total',
      getValue: (item) => parseFloat(item.totalValues?.toString() || '0').toFixed(2),
    },
    valueSalesExcludingST: {
      label: 'Total (Excl. Tax)',
      getValue: (item) => parseFloat(item.valueSalesExcludingST?.toString() || '0').toFixed(2),
    },
    fixedNotifiedValueOrRetailPrice: {
      label: 'Retail Price',
      getValue: (item) => parseFloat(item.fixedNotifiedValueOrRetailPrice?.toString() || '0').toFixed(2),
    },
    salesTaxApplicable: {
      label: 'Sales Tax',
      getValue: (item) => parseFloat(item.salesTaxApplicable?.toString() || '0').toFixed(2),
    },
    salesTaxWithheldAtSource: {
      label: 'Tax Withheld',
      getValue: (item) => parseFloat(item.salesTaxWithheldAtSource?.toString() || '0').toFixed(2),
    },
    furtherTax: {
      label: 'Further Tax',
      getValue: (item) => parseFloat(item.furtherTax?.toString() || '0').toFixed(2),
    },
    fedPayable: {
      label: 'FED Payable',
      getValue: (item) => parseFloat(item.fedPayable?.toString() || '0').toFixed(2),
    },
    discount: {
      label: 'Discount',
      getValue: (item) => parseFloat(item.discount?.toString() || '0').toFixed(2),
    },
    sroScheduleNo: {
      label: 'SRO Schedule',
      getValue: (item) => item.sroScheduleNo || '—',
    },
    sroItemSerialNo: {
      label: 'SRO Item',
      getValue: (item) => item.sroItemSerialNo || '—',
    },
  };

  // Add custom fields to fieldConfig dynamically
  if (customFields && customFields.length > 0) {
    customFields.forEach(cf => {
      fieldConfig[cf.key] = {
        label: cf.label,
        getValue: (item) => {
          if (item.customFieldValues && Array.isArray(item.customFieldValues)) {
            const customFieldValue = item.customFieldValues.find(
              (icf: any) => icf.customFieldId === cf.id
            );
            if (customFieldValue && customFieldValue.value !== null && customFieldValue.value !== undefined) {
              return String(customFieldValue.value);
            }
          }
          if (item.customFields && Array.isArray(item.customFields)) {
            const legacyField = item.customFields.find(
              (icf: any) => icf.customFieldId === cf.id
            );
            if (legacyField && legacyField.value !== null && legacyField.value !== undefined) {
              return String(legacyField.value);
            }
          }
          return '—';
        },
      };
    });
  }

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
      <Page size="A4" style={styles.page} wrap>

        {/* Invoice Information */}
        <View style={styles.infoSection} wrap={false}>
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
        <View style={styles.infoSection} wrap={false}>
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
        <View style={styles.infoSection} wrap={false}>
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
        <View style={styles.table} wrap={false}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          
          {/* Table Header */}
          <View style={[
            styles.tableHeader,
            ...(tableBorders ? [] : [{ borderTopWidth: 1, borderBottomWidth: 1 }])
          ]}>
            {visibleFields.map((fieldKey) => {
              const config = fieldConfig[fieldKey];
              if (!config) return null;

              const width = columnWidths[fieldKey] || 10;
              
              return (
                <Text 
                  key={fieldKey}
                  style={[
                    styles.tableColHeader,
                    { 
                      width: `${width}%`,
                      fontSize: cellFontSize
                    }
                  ]}
                >
                  {config.label}
                </Text>
              );
            })}
          </View>

          {/* Table Rows */}
          {invoice.items?.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                ...(tableBorders ? [] : [{ borderBottomWidth: 0.5 }])
              ]}
              wrap={false}
            >
              {visibleFields.map((fieldKey) => {
                const config = fieldConfig[fieldKey];
                if (!config) return null;

                const width = columnWidths[fieldKey] || 10;
                const value = config.getValue(item, index);
                
                return (
                  <Text 
                    key={fieldKey}
                    style={[
                      styles.tableCol,
                      { 
                        width: `${width}%`,
                        fontSize: cellFontSize
                      }
                    ]}
                  >
                    {value}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection} wrap={false}>
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
