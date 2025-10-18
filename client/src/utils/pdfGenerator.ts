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
  contact: string;
  address: string;
  category: string;
  description: string;
}) {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.text('Kishore Gram Panchayat', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Complaint Receipt', 105, 35, { align: 'center' });
  
  // Tracking Number - prominent
  doc.setFontSize(16);
  doc.text(`Tracking No.: ${data.trackingNumber}`, 105, 55, { align: 'center' });
  
  // Content
  doc.setFontSize(12);
  let y = 75;
  
  doc.text(`Complainant Name: ${data.name}`, 20, y);
  y += 10;
  doc.text(`Contact: ${data.contact}`, 20, y);
  y += 10;
  doc.text(`Address: ${data.address}`, 20, y);
  y += 10;
  doc.text(`Category: ${data.category}`, 20, y);
  y += 15;
  doc.text('Complaint Details:', 20, y);
  y += 10;
  
  // Wrap description text
  const splitDescription = doc.splitTextToSize(data.description, 170);
  doc.text(splitDescription, 20, y);
  y += splitDescription.length * 7 + 15;
  
  // Registration date
  doc.text(`Registration Date: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  y += 10;
  doc.text(`Status: Pending`, 20, y);
  
  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.text('Please save this number to track your complaint', 105, y, { align: 'center' });
  
  y += 15;
  doc.text('Kishore Gram Panchayat Office', 105, y, { align: 'center' });
  
  // Save the PDF
  doc.save(`Complaint_Receipt_${data.trackingNumber}.pdf`);
}
