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
  
  // Add Devanagari font support (Note: In production, you'd add a proper Devanagari font)
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.text('महाराष्ट्र शासन', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Government of Maharashtra', 105, 30, { align: 'center' });
  doc.text('आरोग्य विभाग / Health Department', 105, 40, { align: 'center' });
  
  // Title
  doc.setFontSize(18);
  doc.text('जन्म प्रमाणपत्र / BIRTH CERTIFICATE', 105, 55, { align: 'center' });
  
  // Certificate Number
  doc.setFontSize(10);
  doc.text(`प्रमाणपत्र क्र./Certificate No.: ${data.trackingNumber}`, 20, 70);
  
  // Content
  doc.setFontSize(12);
  let y = 85;
  
  doc.text(`बालाचे पूर्ण नाव / Name of Child: ${data.childName}`, 20, y);
  y += 10;
  doc.text(`जन्म तारीख / Date of Birth: ${data.dateOfBirth}`, 20, y);
  y += 10;
  doc.text(`जन्म ठिकाण / Place of Birth: ${data.placeOfBirth}`, 20, y);
  y += 10;
  doc.text(`वडिलांचे पूर्ण नाव / Full Name of Father: ${data.fatherName}`, 20, y);
  y += 10;
  doc.text(`आईचे पूर्ण नाव / Full Name of Mother: ${data.motherName}`, 20, y);
  y += 10;
  doc.text(`पत्ता / Address: ${data.address}`, 20, y);
  y += 10;
  doc.text(`संपर्क क्रमांक / Contact: ${data.contact}`, 20, y);
  y += 15;
  
  // Registration details
  doc.text(`नोंदणी क्रमांक / Registration No.: ${data.trackingNumber}`, 20, y);
  y += 10;
  doc.text(`नोंदणी दिनांक / Date of Registration: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  y += 10;
  doc.text(`प्रमाणपत्र दिल्याचा दिनांक / Certificate Issue Date: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  
  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.text('निर्गमक, जन्म-मृत्यू नोंदणी अधिकारी, किशोर ग्रामपंचायत', 105, y, { align: 'center' });
  doc.text('Registrar, Birth-Death Registration Officer, Kishore Gram Panchayat', 105, y + 7, { align: 'center' });
  
  // Stamp area
  doc.rect(150, y + 15, 40, 20);
  doc.setFontSize(8);
  doc.text('शिक्का / Seal', 170, y + 27, { align: 'center' });
  
  // Bottom text
  doc.setFontSize(9);
  doc.text('प्रत्येक जन्म आणि मृत्यू घटना नोंदविल्याची खात्री करा', 105, 280, { align: 'center' });
  doc.text('Ensure Registration of Every Birth & Death', 105, 287, { align: 'center' });
  
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
  
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.text('महाराष्ट्र शासन', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Government of Maharashtra', 105, 30, { align: 'center' });
  doc.text('आरोग्य विभाग / Health Department', 105, 40, { align: 'center' });
  
  // Title
  doc.setFontSize(18);
  doc.text('मृत्यू प्रमाणपत्र / DEATH CERTIFICATE', 105, 55, { align: 'center' });
  
  // Certificate Number
  doc.setFontSize(10);
  doc.text(`प्रमाणपत्र क्र./Certificate No.: ${data.trackingNumber}`, 20, 70);
  
  // Content
  doc.setFontSize(12);
  let y = 85;
  
  doc.text(`मृताचे पूर्ण नाव / Name of Deceased: ${data.deceasedName}`, 20, y);
  y += 10;
  doc.text(`मृत्यू तारीख / Death Date: ${data.dateOfDeath}`, 20, y);
  y += 10;
  doc.text(`मृत्यू ठिकाण / Place of Death: ${data.placeOfDeath}`, 20, y);
  y += 10;
  doc.text(`वय / Age: ${data.age}`, 20, y);
  y += 10;
  doc.text(`मृत्यूचे कारण / Cause of Death: ${data.causeOfDeath}`, 20, y);
  y += 10;
  doc.text(`अर्जदाराचे नाव / Applicant Name: ${data.applicantName}`, 20, y);
  y += 10;
  doc.text(`नाते / Relation: ${data.relation}`, 20, y);
  y += 10;
  doc.text(`पत्ता / Address: ${data.address}`, 20, y);
  y += 10;
  doc.text(`संपर्क क्रमांक / Contact: ${data.contact}`, 20, y);
  y += 15;
  
  // Registration details
  doc.text(`नोंदणी क्रमांक / Registration No.: ${data.trackingNumber}`, 20, y);
  y += 10;
  doc.text(`नोंदणी दिनांक / Date of Registration: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  y += 10;
  doc.text(`प्रमाणपत्र दिल्याचा दिनांक / Certificate Issue Date: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  
  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.text('निर्गमक, जन्म-मृत्यू नोंदणी अधिकारी, किशोर ग्रामपंचायत', 105, y, { align: 'center' });
  doc.text('Registrar, Birth-Death Registration Officer, Kishore Gram Panchayat', 105, y + 7, { align: 'center' });
  
  // Stamp area
  doc.rect(150, y + 15, 40, 20);
  doc.setFontSize(8);
  doc.text('शिक्का / Seal', 170, y + 27, { align: 'center' });
  
  // Bottom text
  doc.setFontSize(9);
  doc.text('प्रत्येक जन्म आणि मृत्यू घटना नोंदविल्याची खात्री करा', 105, 280, { align: 'center' });
  doc.text('Ensure Registration of Every Birth & Death', 105, 287, { align: 'center' });
  
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
  doc.text('किशोर ग्रामपंचायत', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Kishore Gram Panchayat', 105, 30, { align: 'center' });
  
  // Title
  doc.setFontSize(18);
  doc.text('तक्रार पावती / Complaint Receipt', 105, 50, { align: 'center' });
  
  // Tracking Number - prominent
  doc.setFontSize(16);
  doc.text(`ट्रॅकिंग क्रमांक / Tracking No.: ${data.trackingNumber}`, 105, 65, { align: 'center' });
  
  // Content
  doc.setFontSize(12);
  let y = 85;
  
  doc.text(`तक्रारकर्त्याचे नाव / Complainant Name: ${data.name}`, 20, y);
  y += 10;
  doc.text(`संपर्क क्रमांक / Contact: ${data.contact}`, 20, y);
  y += 10;
  doc.text(`पत्ता / Address: ${data.address}`, 20, y);
  y += 10;
  doc.text(`तक्रार प्रकार / Category: ${data.category}`, 20, y);
  y += 15;
  doc.text('तक्रारीचा तपशील / Complaint Details:', 20, y);
  y += 10;
  
  // Wrap description text
  const splitDescription = doc.splitTextToSize(data.description, 170);
  doc.text(splitDescription, 20, y);
  y += splitDescription.length * 7 + 15;
  
  // Registration date
  doc.text(`नोंदणी दिनांक / Registration Date: ${new Date().toLocaleDateString('en-GB')}`, 20, y);
  y += 10;
  doc.text(`स्थिती / Status: प्रलंबित / Pending`, 20, y);
  
  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.text('कृपया हा क्रमांक जतन करा आणि आपल्या तक्रारीचा मागोवा घ्या', 105, y, { align: 'center' });
  doc.text('Please save this number to track your complaint', 105, y + 7, { align: 'center' });
  
  y += 20;
  doc.text('किशोर ग्रामपंचायत कार्यालय', 105, y, { align: 'center' });
  doc.text('Kishore Gram Panchayat Office', 105, y + 7, { align: 'center' });
  
  // Save the PDF
  doc.save(`Complaint_Receipt_${data.trackingNumber}.pdf`);
}
