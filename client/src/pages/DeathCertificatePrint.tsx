import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';

interface DeathCertificateData {
  id: string;
  certificateNumber: string;
  registrationNumber: string;
  deceasedNameEn: string;
  deceasedNameMr: string;
  sex: string;
  dateOfDeath: string;
  dateOfRegistration: string;
  placeOfDeathEn: string;
  placeOfDeathMr: string;
  ageAtDeath: string;
  fatherHusbandNameEn: string;
  fatherHusbandNameMr: string;
  permanentAddressEn: string;
  permanentAddressMr: string;
  issueDate: string;
  issuingAuthority: string;
  remarksEn: string;
  remarksMr: string;
}

export default function DeathCertificatePrint() {
  const [, params] = useRoute('/death-certificate/print/:id');
  const [certificate, setCertificate] = useState<DeathCertificateData | null>(null);
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
      console.log('Fetching death certificate with ID:', id);
      const response = await fetch(`/api/death-certificates/id/${id}`);
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
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
          @page { margin: 0; }
          body { margin: 1cm; }
        }
      `}</style>
      
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden mb-4 flex justify-end gap-2">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
      <div className="max-w-4xl mx-auto border-4 border-black p-8">
        {/* Header */}
        <div className="text-center mb-4 border-b-2 border-black pb-2">
          <div className="text-sm">शासन निर्णय क्रमांक: आरटीएस-२०१५/प्र.क्र.३२/पं.रा-५, दिनांक १४ जुलै, २०१५</div>
        </div>

        {/* Certificate Number */}
        <div className="text-right text-sm mb-4">
          प्रमाणपत्र क्र./Certificate No. <span className="ml-16">नमुना २/Form ५</span>
        </div>

        {/* Government Header */}
        <div className="flex items-start gap-6 mb-6">
          {/* Emblem */}
          <div className="w-24 h-24 flex-shrink-0 border-2 border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">⚖️</div>
              <div className="text-xs mt-1">सत्यमेव जयते</div>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold mb-1">महाराष्ट्र शासन</h1>
            <h2 className="text-xl mb-1">Government of Maharashtra</h2>
            <h3 className="text-lg mb-1">आरोग्य विभाग</h3>
            <h4 className="text-lg">Health Department</h4>
          </div>
        </div>

        {/* Issuing Authority */}
        <div className="text-center mb-4 text-sm">
          <div>प्रमाणपत्र निर्गमित करणारा स्थानिक प्राधिकरण नाव _________________</div>
          <div>Name of the local body issuing Certificate _________________</div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-700">मृत्यू प्रमाणपत्र / DEATH CERTIFICATE</h2>
        </div>

        <div className="text-xs mb-4 leading-relaxed">
          (जन्म व मृत्यू नोंदणी अधिनियम, १९६९ चा कलम १२/१७ आणि महाराष्ट्र जन्म व मृत्यू नोंदणी नियम २००० चा २/१३ अन्वये देण्यात आले आहे.)
          <br />
          (Issued under section १२/१७ of the Registration of Births & Deaths Act, १९६९ and rule २/१३ of the Maharashtra Registration of Births and Death Rules २०००)
        </div>

        {/* Certificate Details */}
        <div className="space-y-2 text-sm mb-6">
          {/* Row 1: Deceased Name Marathi */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">मृत व्यक्तीचे पूर्ण नाव:</span>
              <span className="font-semibold">{certificate.deceasedNameMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">लिंग:</span>
              <span className="font-semibold">{certificate.sex === 'male' ? 'पुरुष' : certificate.sex === 'female' ? 'स्त्री' : 'इतर'}</span>
            </div>
          </div>

          {/* Row 2: Deceased Name English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Name of Deceased:</span>
              <span className="font-semibold">{certificate.deceasedNameEn}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Sex:</span>
              <span className="font-semibold">{certificate.sex === 'male' ? 'Male' : certificate.sex === 'female' ? 'Female' : 'Other'}</span>
            </div>
          </div>

          {/* Row 3: Date of Death */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">मृत्यू तारीख:</span>
              <span className="font-semibold">{certificate.dateOfDeath}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">मृत्यू वेळी वय:</span>
              <span className="font-semibold">{certificate.ageAtDeath}</span>
            </div>
          </div>

          {/* Row 4: Date of Death English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Date of Death:</span>
              <span className="font-semibold">{certificate.dateOfDeath}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Age at Death:</span>
              <span className="font-semibold">{certificate.ageAtDeath}</span>
            </div>
          </div>

          {/* Row 5: Place of Death */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">मृत्यू ठिकाण:</span>
              <span className="font-semibold">{certificate.placeOfDeathMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">वडील/पती यांचे नाव:</span>
              <span className="font-semibold">{certificate.fatherHusbandNameMr}</span>
            </div>
          </div>

          {/* Row 6: Place of Death English */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Place of Death:</span>
              <span className="font-semibold">{certificate.placeOfDeathEn}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Father's/Husband's Name:</span>
              <span className="font-semibold">{certificate.fatherHusbandNameEn}</span>
            </div>
          </div>

          {/* Row 7: Address */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-2">
              <span className="whitespace-nowrap">कायमचा पत्ता:</span>
              <span className="font-semibold">{certificate.permanentAddressMr}</span>
            </div>
            <div className="flex gap-2">
              <span className="whitespace-nowrap">Permanent Address:</span>
              <span className="font-semibold">{certificate.permanentAddressEn}</span>
            </div>
          </div>

          {/* Row 8: Registration */}
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

          {/* Row 9: Registration English */}
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
        <div className="mb-6 text-sm">
          <div className="flex justify-between border-b border-gray-300 pb-1 mb-2">
            <span>शेरा:</span>
            <span className="font-semibold">{certificate.remarksMr || 'ok'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1 mb-2">
            <span>Remarks (if any):</span>
            <span className="font-semibold">{certificate.remarksEn || 'ok'}</span>
          </div>
        </div>

        {/* Issue Details */}
        <div className="grid grid-cols-2 gap-8 text-sm mb-6">
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
