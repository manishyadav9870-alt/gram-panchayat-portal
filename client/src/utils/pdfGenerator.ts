import { jsPDF } from 'jspdf';

export function generateBirthCertificatePDF(data: {
  trackingNumber: string;
  childName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  address: string;
  contact: string;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Government reference at top
  doc.setFontSize(7);
  doc.text('Government Decision No.: RTS-2015/Pr.No.32/P.Ra.P., Date: 14 July, 2015', 10, 8);
  
  // Border
  doc.setLineWidth(0.5);
  doc.rect(10, 12, pageWidth - 20, 265);
  
  // Certificate number top right
  doc.setFontSize(9);
  doc.text('Certificate No.', pageWidth - 15, 18, { align: 'right' });
  doc.text('Form 5', pageWidth - 15, 23, { align: 'right' });
  
  // Left side emblem box
  doc.rect(12, 26, 35, 35);
  doc.setFontSize(7);
  doc.text('Satyameva Jayate', 29.5, 43, { align: 'center' });
  doc.text('(Government', 29.5, 49, { align: 'center' });
  doc.text('Emblem)', 29.5, 55, { align: 'center' });
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Government of Maharashtra', (pageWidth / 2) + 8, 38, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Health Department', (pageWidth / 2) + 8, 48, { align: 'center' });
  
  // Horizontal line
  doc.line(12, 63, pageWidth - 12, 63);
  
  // Local body name section
  doc.setFontSize(8);
  doc.text('Name of the local body issuing Certificate: Kishore Gram Panchayat', 14, 69);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BIRTH CERTIFICATE', pageWidth / 2, 84, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('(Issued under section 12/17 of the Registration of Births & Deaths Act, 1969 and rule 8/13 of the', 14, 92);
  doc.text('Maharashtra Registration of Births and Death Rules 2000)', 14, 97);
  
  // Certification statement
  doc.setFontSize(8);
  doc.text('This is to certify that the following information has been taken from the original record of birth which is the registrar', 14, 108);
  doc.text('for local body: Kishore Gram Panchayat, Tehsil: _________________, District: _________________, Maharashtra State.', 14, 113);
  
  // Data table
  let y = 126;
  doc.setFontSize(10);
  
  // Field labels with data
  doc.setFont('helvetica', 'bold');
  doc.text('Name of Child:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.childName, 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Sex:', pageWidth - 50, y);
  doc.setFont('helvetica', 'normal');
  doc.text('_______', pageWidth - 35, y);
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Birth:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dateOfBirth, 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Place of Birth:', pageWidth - 80, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.placeOfBirth, pageWidth - 50, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Full Name of Mother:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.motherName, 60, y);
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Full Name of Father:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.fatherName, 60, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Address of parents at', 14, y);
  y += 5;
  doc.text('the time of birth:', 14, y);
  doc.setFont('helvetica', 'normal');
  y -= 2;
  const addressLines = doc.splitTextToSize(data.address, 90);
  doc.text(addressLines, 60, y);
  y += addressLines.length * 5 + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Registration No.:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.trackingNumber, 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Registration:', pageWidth - 80, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB'), pageWidth - 45, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Remarks (if any):', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text('_________________________________________________', 55, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate Issue Date:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB'), 55, y);
  
  // Signature section
  doc.setFont('helvetica', 'bold');
  doc.text('Registrar, Birth-Death Registration Officer', pageWidth - 95, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Kishore Gram Panchayat', pageWidth - 80, y);
  y += 8;
  
  // Seal box
  doc.rect(pageWidth - 50, y, 35, 20);
  doc.setFontSize(8);
  doc.text('Official Seal', pageWidth - 32.5, y + 12, { align: 'center' });
  
  // Bottom footer
  doc.setFontSize(8);
  doc.text('Ensure Registration of Every Birth & Death', 14, 268);
  doc.text('Verify at: https://aarsam.mahaonline.gov.in', pageWidth - 95, 268);
  
  doc.setFontSize(7);
  doc.text('2015 - Year of Digitized & Time Bound Services', pageWidth - 80, 273);
  
  // Save the PDF
  doc.save(`Birth_Certificate_${data.trackingNumber}.pdf`);
}

export function generateDeathCertificatePDF(data: {
  trackingNumber: string;
  deceasedName: string;
  dateOfDeath: string;
  placeOfDeath: string;
  age: string;
  causeOfDeath: string;
  applicantName: string;
  relation: string;
  contact: string;
  address: string;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Government reference at top
  doc.setFontSize(7);
  doc.text('Government Decision No.: RTS-2015/Pr.No.32/P.Ra.P., Date: 14 July, 2015', 10, 8);
  
  // Border
  doc.setLineWidth(0.5);
  doc.rect(10, 12, pageWidth - 20, 265);
  
  // Certificate number top right
  doc.setFontSize(9);
  doc.text('Certificate No.', pageWidth - 15, 18, { align: 'right' });
  doc.text('Form 5', pageWidth - 15, 23, { align: 'right' });
  
  // Left side emblem box
  doc.rect(12, 26, 35, 35);
  doc.setFontSize(7);
  doc.text('Satyameva Jayate', 29.5, 43, { align: 'center' });
  doc.text('(Government', 29.5, 49, { align: 'center' });
  doc.text('Emblem)', 29.5, 55, { align: 'center' });
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Government of Maharashtra', (pageWidth / 2) + 8, 38, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Health Department', (pageWidth / 2) + 8, 48, { align: 'center' });
  
  // Horizontal line
  doc.line(12, 63, pageWidth - 12, 63);
  
  // Local body name section
  doc.setFontSize(8);
  doc.text('Name of the local body issuing Certificate: Kishore Gram Panchayat', 14, 69);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DEATH CERTIFICATE', pageWidth / 2, 84, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('(Issued under section 12/17 of the Registration of Births & Deaths Act, 1969 and rule 8/13 of the', 14, 92);
  doc.text('Maharashtra Registration of Births and Death Rules 2000)', 14, 97);
  
  // Certification statement
  doc.setFontSize(8);
  doc.text('This is to certify that the following information has been taken from the original record of death which is the registrar', 14, 108);
  doc.text('for local body: Kishore Gram Panchayat, Tehsil: _________________, District: _________________, Maharashtra State.', 14, 113);
  
  // Data table
  let y = 126;
  doc.setFontSize(10);
  
  // Field labels with data
  doc.setFont('helvetica', 'bold');
  doc.text('Name of Deceased:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.deceasedName, 60, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Sex:', pageWidth - 50, y);
  doc.setFont('helvetica', 'normal');
  doc.text('_______', pageWidth - 35, y);
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Death Date:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dateOfDeath, 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Place of Death:', pageWidth - 80, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.placeOfDeath, pageWidth - 50, y);
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Age at Death:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.age, 55, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Cause of Death:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.causeOfDeath, 60, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Address of deceased at', 14, y);
  y += 5;
  doc.text('the time of Death:', 14, y);
  doc.setFont('helvetica', 'normal');
  y -= 2;
  const addressLines = doc.splitTextToSize(data.address, 90);
  doc.text(addressLines, 60, y);
  y += addressLines.length * 5 + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Registration No.:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.trackingNumber, 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Registration:', pageWidth - 80, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB'), pageWidth - 45, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Remarks (if any):', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Applicant: ${data.applicantName} (${data.relation})`, 55, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate Issue Date:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB'), 55, y);
  
  // Signature section
  doc.setFont('helvetica', 'bold');
  doc.text('Registrar, Birth-Death Registration Officer', pageWidth - 95, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Kishore Gram Panchayat', pageWidth - 80, y);
  y += 8;
  
  // Seal box
  doc.rect(pageWidth - 50, y, 35, 20);
  doc.setFontSize(8);
  doc.text('Official Seal', pageWidth - 32.5, y + 12, { align: 'center' });
  
  // Bottom footer
  doc.setFontSize(8);
  doc.text('Ensure Registration of Every Birth & Death', 14, 268);
  doc.text('Verify at: https://aarsam.mahaonline.gov.in', pageWidth - 95, 268);
  
  doc.setFontSize(7);
  doc.text('2015 - Year of Digitized & Time Bound Services', pageWidth - 80, 273);
  
  // Save the PDF
  doc.save(`Death_Certificate_${data.trackingNumber}.pdf`);
}

export function generateComplaintReceiptPDF(data: {
  trackingNumber: string;
  name: string;
  nameMr?: string;
  contact: string;
  address: string;
  addressMr?: string;
  category: string;
  categoryMr?: string;
  description: string;
  descriptionMr?: string;
}) {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  
  // Header - Bilingual
  doc.setFontSize(20);
  doc.text('Kishore Gram Panchayat', 105, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('किशोर ग्राम पंचायत', 105, 28, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Complaint Receipt / तक्रार पावती', 105, 42, { align: 'center' });
  
  // Tracking Number - prominent
  doc.setFontSize(16);
  doc.text(`Tracking No. / ट्रॅकिंग क्रमांक: ${data.trackingNumber}`, 105, 62, { align: 'center' });
  
  // Content - Display in Marathi if available, otherwise English
  doc.setFontSize(12);
  let y = 82;
  
  // Name - Show Marathi version in print
  const displayName = data.nameMr || data.name;
  doc.text(`नाव / Name: ${displayName}`, 20, y);
  y += 10;
  
  doc.text(`संपर्क / Contact: ${data.contact}`, 20, y);
  y += 10;
  
  // Address - Show Marathi version in print
  const displayAddress = data.addressMr || data.address;
  const splitAddress = doc.splitTextToSize(displayAddress, 170);
  doc.text('पत्ता / Address:', 20, y);
  y += 7;
  doc.text(splitAddress, 20, y);
  y += splitAddress.length * 7 + 5;
  
  // Category - Show Marathi version in print
  const displayCategory = data.categoryMr || data.category;
  doc.text(`प्रकार / Category: ${displayCategory}`, 20, y);
  y += 15;
  
  doc.text('तक्रार तपशील / Complaint Details:', 20, y);
  y += 10;
  
  // Description - Show Marathi version in print
  const displayDescription = data.descriptionMr || data.description;
  const splitDescription = doc.splitTextToSize(displayDescription, 170);
  doc.text(splitDescription, 20, y);
  y += splitDescription.length * 7 + 15;
  
  // Registration date
  doc.text(`नोंदणी तारीख / Registration Date: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  y += 10;
  doc.text(`स्थिती / Status: प्रलंबित / Pending`, 20, y);
  
  // Footer - Bilingual
  y += 20;
  doc.setFontSize(10);
  doc.text('कृपया आपल्या तक्रारीचा मागोवा घेण्यासाठी हा क्रमांक जतन करा', 105, y, { align: 'center' });
  y += 6;
  doc.text('Please save this number to track your complaint', 105, y, { align: 'center' });
  
  y += 15;
  doc.text('किशोर ग्राम पंचायत कार्यालय / Kishore Gram Panchayat Office', 105, y, { align: 'center' });
  
  // Save the PDF
  doc.save(`Complaint_Receipt_${data.trackingNumber}.pdf`);
}

// Print function for complaint receipt (opens print dialog with Marathi text)
export function printComplaintReceipt(data: {
  trackingNumber: string;
  name: string;
  nameMr?: string;
  contact: string;
  address: string;
  addressMr?: string;
  category: string;
  categoryMr?: string;
  description: string;
  descriptionMr?: string;
}) {
  // Create a print-friendly HTML window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the receipt');
    return;
  }

  // Display Marathi text in print if available
  const displayName = data.nameMr || data.name;
  const displayAddress = data.addressMr || data.address;
  const displayCategory = data.categoryMr || data.category;
  const displayDescription = data.descriptionMr || data.description;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>तक्रार पावती / Complaint Receipt - ${data.trackingNumber}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body {
          font-family: 'Noto Sans Devanagari', Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 5px 0;
          font-size: 28px;
          color: #2c5282;
        }
        .header h2 {
          margin: 5px 0;
          font-size: 22px;
          color: #2c5282;
        }
        .header h3 {
          margin: 10px 0;
          font-size: 18px;
          color: #555;
        }
        .tracking {
          text-align: center;
          background: #f7fafc;
          padding: 15px;
          margin: 20px 0;
          border: 2px solid #2c5282;
          border-radius: 8px;
        }
        .tracking-number {
          font-size: 24px;
          font-weight: bold;
          color: #2c5282;
          margin: 5px 0;
        }
        .content {
          margin: 20px 0;
        }
        .field {
          margin: 15px 0;
          padding: 10px;
          background: #f9f9f9;
          border-left: 4px solid #2c5282;
        }
        .field-label {
          font-weight: bold;
          color: #2c5282;
          margin-bottom: 5px;
        }
        .field-value {
          color: #333;
          line-height: 1.6;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .button-container {
          text-align: center;
          margin: 20px 0;
        }
        button {
          background: #2c5282;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          margin: 0 10px;
        }
        button:hover {
          background: #1a365d;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Kishore Gram Panchayat</h1>
        <h2>किशोर ग्राम पंचायत</h2>
        <h3>Complaint Receipt / तक्रार पावती</h3>
      </div>

      <div class="tracking">
        <div style="font-size: 16px; margin-bottom: 5px;">ट्रॅकिंग क्रमांक / Tracking Number</div>
        <div class="tracking-number">${data.trackingNumber}</div>
      </div>

      <div class="content">
        <div class="field">
          <div class="field-label">नाव / Name</div>
          <div class="field-value">${displayName}</div>
        </div>

        <div class="field">
          <div class="field-label">संपर्क / Contact</div>
          <div class="field-value">${data.contact}</div>
        </div>

        <div class="field">
          <div class="field-label">पत्ता / Address</div>
          <div class="field-value">${displayAddress}</div>
        </div>

        <div class="field">
          <div class="field-label">प्रकार / Category</div>
          <div class="field-value">${displayCategory}</div>
        </div>

        <div class="field">
          <div class="field-label">तक्रार तपशील / Complaint Details</div>
          <div class="field-value">${displayDescription}</div>
        </div>

        <div class="field">
          <div class="field-label">नोंदणी तारीख / Registration Date</div>
          <div class="field-value">${new Date().toLocaleDateString('en-GB')}</div>
        </div>

        <div class="field">
          <div class="field-label">स्थिती / Status</div>
          <div class="field-value">प्रलंबित / Pending</div>
        </div>
      </div>

      <div class="footer">
        <p><strong>कृपया आपल्या तक्रारीचा मागोवा घेण्यासाठी हा क्रमांक जतन करा</strong></p>
        <p>Please save this number to track your complaint</p>
        <p style="margin-top: 15px;">किशोर ग्राम पंचायत कार्यालय / Kishore Gram Panchayat Office</p>
      </div>

      <div class="button-container no-print">
        <button onclick="window.print()">🖨️ प्रिंट करा / Print</button>
        <button onclick="window.close()">बंद करा / Close</button>
      </div>

      <script>
        // Auto-print when page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
