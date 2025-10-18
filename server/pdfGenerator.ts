import { jsPDF } from 'jspdf';
import type { BirthCertificate } from '@shared/schema';

export function generateBirthCertificatePDF(certificate: BirthCertificate): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header - Government Decision (Bilingual)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Shasan Nirnay Kramank: ARTIPES-2015/Pr.Kr.32/Pa.Ra-5, Dinank 14 Julai, 2015', 20, 10);
  
  // Top border line
  doc.setLineWidth(1);
  doc.line(15, 14, pageWidth - 15, 14);
  
  // Main border
  doc.setLineWidth(0.8);
  doc.rect(15, 18, pageWidth - 30, pageHeight - 30);
  
  // Certificate Number and Form Number (top corners inside border)
  doc.setFontSize(8);
  doc.text('Pramanpatra Kr./Certificate No.', 18, 24);
  doc.text('Namuna 4/ Form 4', pageWidth - 50, 24);
  
  // Government Emblem Box (Left side)
  doc.setLineWidth(0.5);
  doc.rect(18, 28, 45, 45);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Satyameva Jayate', 40.5, 52, { align: 'center' });
  
  // Government Header (Center) - Bilingual
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Maharashtra Shasan', pageWidth / 2, 38, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Government of Maharashtra', pageWidth / 2, 45, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text('Arogya Vibhag', pageWidth / 2, 52, { align: 'center' });
  doc.text('Health Department', pageWidth / 2, 58, { align: 'center' });
  
  // Horizontal line below header
  doc.setLineWidth(0.8);
  doc.line(15, 75, pageWidth - 15, 75);
  
  // Local body issuing certificate
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const localBody = (certificate as any).localBodyName || 'Kishore Gram Panchayat';
  doc.text(`Pramanpatra Nirgamit Karanara Sthanik Kshetre che Nav _______________`, 18, 80);
  doc.text(`Name of the local body issuing Certificate_______________`, 18, 84);
  
  // Birth Certificate Title (Bilingual)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Janma Pramanpatra / BIRTH CERTIFICATE', pageWidth / 2, 94, { align: 'center' });
  
  // Registration Act Reference
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('(Janma va Mrutyu Nondani Adhiniyam, 1969 chya Kalam 12/17 ani Maharashtra Janma va Mrutyu Niyam 2000 che Niyam 8/13 Anusar Deyat Ahe.)', 18, 100);
  doc.text('(Issued under section 12/17 of the Registration of Births & Deaths Act, 1969 and rule 8/13 of the Maharashtra Registration of Births and', 18, 104);
  doc.text('Death Rules 2000)', 18, 108);
  
  // Certificate Body
  doc.setFontSize(8);
  let yPos = 115;
  
  doc.text('Pramanit Kuranyat Yeil Ahi Ki Khalil Mahiti Janmachya Mul Abhilekhatun Ghetleli Ahe Jyala (Sthanik Kshetre/', 18, yPos);
  yPos += 4;
  doc.text('Taluka) _______________. Maharashtra Rajyachya Nondnichi Uddesh Ahe.', 18, yPos);
  yPos += 4;
  doc.text('This is to certify that the following information has been taken from the original record of birth which is the registrar (local area / local body)', 18, yPos);
  yPos += 4;
  doc.text('of tehsil / block _______________. _______________of Maharashtra State.', 18, yPos);
  
  yPos += 10;
  
  // Two column layout for certificate details
  const leftCol = 20;
  const rightCol = pageWidth / 2 + 5;
  const lineHeight = 6;
  
  doc.setFontSize(9);
  
  // Aadhaar Card Number
  doc.setFont('helvetica', 'normal');
  doc.text('Aadharkard Kramank:', leftCol, yPos);
  doc.text('Adhar Card', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Balache Purn Nav:', leftCol, yPos);
  doc.text('Number:', rightCol, yPos);
  yPos += lineHeight;
  
  // Name of Child
  doc.text('Name of Child:', leftCol, yPos);
  doc.text('Ling:', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text((certificate as any).childName || certificate.childName || '', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Sex:', rightCol, yPos);
  yPos += lineHeight;
  
  // Date of Birth
  doc.text('Janma Tarekh:', leftCol, yPos);
  doc.text('Janma Dinanank:', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Date of Birth:', leftCol, yPos);
  doc.text('Place of Birth:', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.dateOfBirth || '', leftCol, yPos);
  doc.text((certificate as any).placeOfBirth || certificate.placeOfBirth || '', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  // Mother's Name
  doc.text('Aiche Purn Nav:', leftCol, yPos);
  doc.text('Vadilanche Purn Nav', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Full Name of Mother:', leftCol, yPos);
  doc.text('Full Name of', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.motherName || '', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Father:', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.fatherName || '', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  // Address at Birth
  doc.text('Balache Janmavelechya Ai', leftCol, yPos);
  doc.text('Ai Vadilanche', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Vadilanche Patta:', leftCol, yPos);
  doc.text('Kayamcha Patta:', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Address of parents at the', leftCol, yPos);
  doc.text('Permanent', rightCol, yPos);
  yPos += lineHeight;
  doc.text('time of birth of the child:', leftCol, yPos);
  doc.text('Address of the parents:', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text((certificate as any).addressAtBirth || certificate.address || '', leftCol, yPos, { maxWidth: 85 });
  doc.text((certificate as any).permanentAddress || certificate.address || '', rightCol, yPos, { maxWidth: 85 });
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight + 5;
  
  // Registration Number
  doc.text('Nondani Kramank:', leftCol, yPos);
  doc.text('Nondani Dinank:', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Registration No.:', leftCol, yPos);
  doc.text('Date of', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.trackingNumber || '', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Registration:', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(certificate.createdAt).toLocaleDateString('en-IN'), rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight + 5;
  
  // Remarks
  doc.text('Shera:', leftCol, yPos);
  yPos += lineHeight;
  doc.text('Remarks (if any):', leftCol, yPos);
  yPos += lineHeight + 5;
  
  // Certificate Issue Details
  doc.text('Pramanpatra Vistyacha Dinank:', leftCol, yPos);
  doc.text('Nirgamak, Janma-Mrutyu Nondani Adhikari, Gramapanchayat', rightCol, yPos);
  yPos += lineHeight;
  doc.text('Certificate Issue Date:', leftCol, yPos);
  doc.text('________, Ta.______, Ji. ________', rightCol, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text(new Date().toLocaleDateString('en-IN'), leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight + 10;
  
  // Seal
  doc.text('Shikka / Seal', pageWidth / 2, yPos, { align: 'center' });
  
  // Footer
  doc.setFontSize(7);
  yPos = pageHeight - 15;
  doc.text('Pratyek Janma Ani Mrutyu Pratyacha Nondanivarya Suchi Kara', 18, yPos);
  doc.text('Ensure Registration of Every Birth & Death', pageWidth - 18, yPos, { align: 'right' });
  yPos += 4;
  doc.text('Sadar Sahayaki Seveta Tapasunyachi Aslyachi https://aaplesarkar.mahaonline.gov.in/Certificate Validation.aspx ya Maharashtra Shashan', 18, yPos);
  doc.text('2015-Year of Digitized & Time Bound Services', pageWidth - 18, yPos, { align: 'right' });
  
  return doc;
}

export function generateDeathCertificatePDF(certificate: any): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Similar structure for death certificate
  doc.setFont('helvetica');
  doc.setFontSize(10);
  doc.text('शासन निर्णय क्रमांक: आरटीएस-२०१५/प्र.क्र.३२/पं.रा-५, दिनांक १४ जुलै, २०१५', pageWidth / 2, 15, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(15, 20, pageWidth - 15, 20);
  
  doc.setFontSize(9);
  doc.text(`प्रमाणपत्र क्र./Certificate No.`, 20, 30);
  doc.text(`नमुना २/ Form 2`, pageWidth - 60, 30);
  
  doc.rect(20, 35, 50, 50);
  doc.setFontSize(8);
  doc.text('सत्यमेव जयते', 35, 80, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('महाराष्ट्र शासन', pageWidth / 2, 45, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Government of Maharashtra', pageWidth / 2, 52, { align: 'center' });
  doc.setFontSize(11);
  doc.text('आरोग्य विभाग', pageWidth / 2, 59, { align: 'center' });
  doc.text('Health Department', pageWidth / 2, 66, { align: 'center' });
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('मृत्यू प्रमाणपत्र / DEATH CERTIFICATE', pageWidth / 2, 110, { align: 'center' });
  
  let yPos = 130;
  const leftCol = 25;
  const lineHeight = 7;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  doc.text('मृत व्यक्तीचे नाव:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.deceasedName || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Name of Deceased:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('मृत्यूची तारीख:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.dateOfDeath || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Date of Death:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('मृत्यूचे ठिकाण:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.placeOfDeath || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Place of Death:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('वय:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.age || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Age:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('मृत्यूचे कारण:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.causeOfDeath || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Cause of Death:', leftCol, yPos);
  yPos += lineHeight + 5;
  
  doc.text('अर्जदाराचे नाव:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.applicantName || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Applicant Name:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('संबंध:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.relation || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Relation:', leftCol, yPos);
  yPos += lineHeight;
  
  doc.text('नोंदणी क्रमांक:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(certificate.trackingNumber || '', leftCol + 50, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Registration No.:', leftCol, yPos);
  yPos += lineHeight + 10;
  
  doc.text('प्रमाणपत्र विस्त्याचा दिनांक:', leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date().toLocaleDateString('en-IN'), leftCol + 60, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  doc.text('Certificate Issue Date:', leftCol, yPos);
  yPos += lineHeight + 10;
  
  doc.text('शिक्का / Seal', pageWidth / 2, yPos, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.rect(15, 25, pageWidth - 30, pageHeight - 35);
  
  return doc;
}
