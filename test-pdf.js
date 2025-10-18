import { generateBirthCertificatePDF } from './server/pdfGenerator.ts';
import fs from 'fs';

// Test certificate data
const testCertificate = {
  id: 'test-123',
  trackingNumber: 'BRT14543213',
  childName: 'manish yadav',
  dateOfBirth: '1997-10-10',
  placeOfBirth: 'mumbai',
  fatherName: 'ramnayan yadav',
  motherName: 'mewati yadav',
  address: '301 c wung vedant millenia',
  contact: '9876543210',
  status: 'approved',
  createdAt: new Date()
};

console.log('Generating PDF...');
const pdf = generateBirthCertificatePDF(testCertificate);

// Save to file
const pdfOutput = pdf.output('arraybuffer');
fs.writeFileSync('test-birth-certificate.pdf', Buffer.from(pdfOutput));

console.log('PDF generated successfully: test-birth-certificate.pdf');
