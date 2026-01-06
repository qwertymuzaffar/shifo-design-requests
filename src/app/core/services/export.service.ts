import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToCSV(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  exportToExcel(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);

    let excelContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    excelContent += '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
    excelContent += '<body><table>';

    excelContent += '<tr>';
    headers.forEach(header => {
      excelContent += `<th style="background-color: #4CAF50; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd;">${this.escapeHtml(header)}</th>`;
    });
    excelContent += '</tr>';

    data.forEach(row => {
      excelContent += '<tr>';
      headers.forEach(header => {
        const value = row[header];
        excelContent += `<td style="padding: 8px; border: 1px solid #ddd;">${this.escapeHtml(value)}</td>`;
      });
      excelContent += '</tr>';
    });

    excelContent += '</table></body></html>';

    this.downloadFile(excelContent, `${filename}.xls`, 'application/vnd.ms-excel');
  }

  exportToPDF(title: string, headers: string[], data: any[][], filename: string): void {
    let pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4CAF50; color: white; padding: 12px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
    }
  }

  exportLabResultToPDF(labOrder: any): void {
    const headers = ['Test Name', 'Result', 'Normal Range', 'Unit', 'Status'];
    const data = labOrder.items?.map((item: any) => [
      item.test_type?.name || '',
      item.result?.value || 'Pending',
      item.test_type?.normal_range || '',
      item.test_type?.unit || '',
      item.result?.is_abnormal ? 'Abnormal' : 'Normal'
    ]) || [];

    const title = `Laboratory Results - Order ${labOrder.order_number}`;
    this.exportToPDF(title, headers, data, `lab-results-${labOrder.order_number}`);
  }

  exportPrescriptionToPDF(prescription: any): void {
    const headers = ['Medication', 'Dosage', 'Frequency', 'Duration', 'Instructions'];
    const data = prescription.items?.map((item: any) => [
      item.medication?.name || '',
      item.dosage,
      item.frequency,
      `${item.duration_days} days`,
      item.instructions || ''
    ]) || [];

    const title = `Prescription - ${prescription.prescription_number}`;
    this.exportToPDF(title, headers, data, `prescription-${prescription.prescription_number}`);
  }

  private escapeHtml(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  exportInventoryReport(items: any[], filename: string = 'inventory-report'): void {
    const data = items.map(item => ({
      'SKU': item.sku,
      'Name': item.name,
      'Category': item.category?.name || '',
      'Quantity': item.total_quantity || 0,
      'Unit': item.unit,
      'Reorder Level': item.reorder_level,
      'Unit Cost': item.unit_cost,
      'Status': item.total_quantity <= item.reorder_level ? 'Low Stock' : 'OK'
    }));

    this.exportToExcel(data, filename);
  }

  exportFinancialReport(transactions: any[], filename: string = 'financial-report'): void {
    const data = transactions.map(transaction => ({
      'Date': new Date(transaction.date).toLocaleDateString(),
      'Type': transaction.type,
      'Category': transaction.category?.name || '',
      'Description': transaction.description || '',
      'Amount': transaction.amount,
      'Payment Method': transaction.payment_method || '',
      'Status': transaction.status
    }));

    this.exportToExcel(data, filename);
  }

  exportPatientReport(patients: any[], filename: string = 'patients-report'): void {
    const data = patients.map(patient => ({
      'ID': patient.id,
      'Full Name': patient.full_name,
      'Phone': patient.phone,
      'Birth Date': patient.birth_date,
      'Age': this.calculateAge(patient.birth_date),
      'Registration Date': new Date(patient.created_at).toLocaleDateString()
    }));

    this.exportToExcel(data, filename);
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
