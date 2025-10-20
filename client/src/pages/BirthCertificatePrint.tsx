import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';

interface BirthCertificateData {
  id: string;
  certificateNumber: string;
  registrationNumber: string;
  childNameEn: string;
  childNameMr: string;
  sex: string;
  dateOfBirth: string;
  dateOfRegistration: string;
  placeOfBirthEn: string;
  placeOfBirthMr: string;
  motherNameEn: string;
  motherNameMr: string;
  motherAadhar: string;
  fatherNameEn: string;
  fatherNameMr: string;
  fatherAadhar: string;
  permanentAddressEn: string;
  permanentAddressMr: string;
  issueDate: string;
  issuingAuthority: string;
  remarksEn: string;
  remarksMr: string;
}

export default function BirthCertificatePrint() {
  const [, params] = useRoute('/birth-certificate/print/:id');
  const [certificate, setCertificate] = useState<BirthCertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchCertificate(params.id);
    }
  }, [params?.id]);

  const fetchCertificate = async (id: string) => {
    try {
      setLoading(true);
      console.log('Fetching certificate with ID:', id);
      const response = await fetch(`/api/birth-certificates/id/${id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Certificate data:', data);
        setCertificate(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching certificate:', errorData);
        setError('Certificate not found. Please make sure the certificate has been saved first.');
      }
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
      setError('Failed to load certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading certificate...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <div className="text-red-600 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">Certificate Not Found</h2>
        <p className="text-gray-600 text-center max-w-md">
          {error || 'The certificate you are looking for does not exist. Please save the certificate first before trying to print.'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <style>{`
        @media print {
          @page { 
            size: A4 portrait;
            margin: 0.3cm;
          }
          body { 
            margin: 0 !important;
            padding: 0 !important;
          }
          .certificate-container {
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            transform: scale(0.85) !important;
            transform-origin: top center !important;
            padding: 1rem !important;
            margin: 0 auto !important;
          }
          .print-compact {
            font-size: 0.75rem !important;
            line-height: 1.2 !important;
          }
          .print-compact-xs {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
      
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden mb-4 flex justify-end gap-2">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {/* Certificate Container */}
      <div className="certificate-container max-w-4xl mx-auto border-4 border-black p-8 print:p-4">
        {/* Header */}
        <div className="text-center mb-3 print:mb-2 border-b-2 border-black pb-1 print-compact-xs">
          <div className="text-sm">शासन निर्णय क्रमांक: आरटीएस-२०१५/प्र.क्र.३२/पं.रा-५, दिनांक १४ जुलै, २०१५</div>
        </div>

        {/* Certificate Number */}
        <div className="text-right text-sm mb-3 print:mb-2 print-compact-xs">
          प्रमाणपत्र क्र./Certificate No. <span className="ml-16">नमुना १/Form ४</span>
        </div>

        {/* Government Header */}
        <div className="flex items-start gap-4 mb-3 print:mb-2 print:gap-2">
          {/* Emblem */}
          <div className="w-20 h-20 print:w-16 print:h-16 flex-shrink-0 border-2 border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl print:text-2xl">⚖️</div>
              <div className="text-xs">सत्यमेव जयते</div>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 text-center print-compact">
            <h1 className="text-2xl print:text-lg font-bold mb-1 print:mb-0">महाराष्ट्र शासन</h1>
            <h2 className="text-xl print:text-base mb-1 print:mb-0">Government of Maharashtra</h2>
            <h3 className="text-lg print:text-sm mb-1 print:mb-0">आरोग्य विभाग</h3>
            <h4 className="text-lg print:text-sm">Health Department</h4>
          </div>
        </div>

        {/* Issuing Authority */}
        <div className="text-center mb-2 print:mb-1 text-sm print-compact-xs">
          <div>प्रमाणपत्र निर्गमित करणारा स्थानिक प्राधिकरण नाव _________________</div>
          <div>Name of the local body issuing Certificate _________________</div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-3 print:mb-2">
          <h2 className="text-2xl print:text-lg font-bold">जन्म प्रमाणपत्र / BIRTH CERTIFICATE</h2>
        </div>

        <div className="text-xs mb-2 print:mb-1 leading-snug print-compact-xs">
          (जन्म व मृत्यू नोंदणी अधिनियम, १९६९ चा कलम १२/१७ आणि महाराष्ट्र जन्म व मृत्यू नोंदणी नियम २००० चा २/१३ अन्वये देण्यात आले आहे.)
          <br />
          (Issued under section १२/१७ of the Registration of Births & Deaths Act, १९६९ and rule २/१३ of the Maharashtra Registration of Births and Death Rules २०००)
        </div>

        <div className="text-xs mb-4">
          प्रमाणित करण्यात येते आहे की खालील माहिती जन्माच्या मूळ अभिलेखाच्या नोंदवहीच्या (स्थानिक प्राधिकरण / ब्लॉक) _________________ of Maharashtra State.
          <br />
          This is to certify that the following information has been taken from the register for (local area/block) _________________ of tehsil / block _________________ of district _________________ of Maharashtra State.
        </div>

        {/* Certificate Details - Side by Side Format */}
        <div className="space-y-1 print:space-y-0.5 text-sm mb-3 print:mb-2 print-compact">
          {/* Row 1: Aadhar Card */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">आधारकार्ड क्रमांक:</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Aadhar Card Number:</span>
            </div>
          </div>

          {/* Row 2: Child Name Marathi */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">बालकाचे पूर्ण नाव:</span>
              <span className="font-semibold">{certificate.childNameMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">लिंग:</span>
              <span className="font-semibold">{certificate.sex === 'male' ? 'पुरुष' : certificate.sex === 'female' ? 'स्त्री' : 'इतर'}</span>
            </div>
          </div>

          {/* Row 3: Child Name English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Name of Child:</span>
              <span className="font-semibold">{certificate.childNameEn}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Sex:</span>
              <span className="font-semibold">{certificate.sex === 'male' ? 'Male' : certificate.sex === 'female' ? 'Female' : 'Other'}</span>
            </div>
          </div>

          {/* Row 4: Date of Birth */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">जन्म तारीख:</span>
              <span className="font-semibold">{certificate.dateOfBirth}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">जन्म ठिकाण:</span>
              <span className="font-semibold">{certificate.placeOfBirthMr}</span>
            </div>
          </div>

          {/* Row 5: Date of Birth English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Date of Birth:</span>
              <span className="font-semibold">{certificate.dateOfBirth}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Place of Birth:</span>
              <span className="font-semibold">{certificate.placeOfBirthEn}</span>
            </div>
          </div>

          {/* Row 6: Mother Name Marathi */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">आईचे पूर्ण नाव:</span>
              <span className="font-semibold">{certificate.motherNameMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">वडिलांचे पूर्ण नाव:</span>
              <span className="font-semibold">{certificate.fatherNameMr}</span>
            </div>
          </div>

          {/* Row 7: Mother Name English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Full Name of Mother:</span>
              <span className="font-semibold">{certificate.motherNameEn}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Full Name of Father:</span>
              <span className="font-semibold">{certificate.fatherNameEn}</span>
            </div>
          </div>

          {/* Row 8: Address at birth */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">बालाचे जन्मवेळी आई-वडिलांचे पत्ता:</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">आई वडिलांचा कायमचा पत्ता:</span>
            </div>
          </div>

          {/* Row 9: Address */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Address of parents at the time of birth:</span>
              <span className="font-semibold">{certificate.permanentAddressMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Permanent Address:</span>
              <span className="font-semibold">{certificate.permanentAddressEn}</span>
            </div>
          </div>

          {/* Row 10: Registration */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">नोंदणी क्रमांक:</span>
              <span className="font-semibold">{certificate.registrationNumber}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">नोंदणी दिनांक:</span>
              <span className="font-semibold">{certificate.dateOfRegistration}</span>
            </div>
          </div>

          {/* Row 11: Registration English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Registration No.:</span>
              <span className="font-semibold">{certificate.registrationNumber}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Date of Registration:</span>
              <span className="font-semibold">{certificate.dateOfRegistration}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-2 print:mb-1 text-sm print-compact">
          <div className="flex justify-between border-b border-gray-300 pb-1 mb-1">
            <span>शेरा:</span>
            <span className="font-semibold">{certificate.remarksMr || 'ok'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1 mb-1">
            <span>Remarks (if any):</span>
            <span className="font-semibold">{certificate.remarksEn || 'ok'}</span>
          </div>
        </div>

        {/* Issue Details */}
        <div className="grid grid-cols-2 gap-8 text-sm mb-2 print:mb-1 print-compact">
          <div>
            <div className="border-b border-gray-300 pb-1 mb-2">
              <span>प्रमाणपत्र निर्गमित दिनांक:</span>
            </div>
            <div className="border-b border-gray-300 pb-1 mb-2">
              <span>Certificate Issue Date:</span>
              <span className="ml-4 font-semibold">{certificate.issueDate}</span>
            </div>
          </div>
          <div>
            <div className="border-b border-gray-300 pb-1 mb-2">
              <span>निर्गमक, जन्म-मृत्यू नोंदणी अधिकारी, ग्रामपंचायत</span>
            </div>
            <div className="border-b border-gray-300 pb-1 mb-2">
              <span className="font-semibold">{certificate.issuingAuthority}</span>
            </div>
            <div className="mt-4 text-right">
              <span>शिक्का / Seal</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-2 text-xs">
          <div className="flex justify-between">
            <span>सदर जन्म आणि मृत्यू घटना नोंदवहीच्या खात्री करा</span>
            <span>Ensure Registration of Every Birth & Death</span>
          </div>
        </div>
      </div>
    </div>
  );
}
