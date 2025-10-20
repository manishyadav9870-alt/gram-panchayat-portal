import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';

interface MarriageCertificate {
  id: string;
  certificateNumber: string;
  registrationNumber: string;
  registrationDate: string;
  husbandNameEn: string;
  husbandNameMr: string;
  husbandAadhar: string;
  wifeNameEn: string;
  wifeNameMr: string;
  wifeAadhar: string;
  marriageDate: string;
  marriagePlace: string;
  taluka: string;
  district: string;
  state: string;
  issuingAuthority: string;
  issueDate: string;
  placeOfIssue: string;
}

export default function MarriageCertificatePrint() {
  const [, params] = useRoute('/marriage-certificate/print/:id');
  const [certificate, setCertificate] = useState<MarriageCertificate | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchCertificate(params.id);
    }
  }, [params?.id]);

  const fetchCertificate = async (id: string) => {
    try {
      const response = await fetch(`/api/marriage-certificates/${id}`);
      const data = await response.json();
      setCertificate(data);
      setTimeout(() => window.print(), 1000);
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
    }
  };

  if (!certificate) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const toMarathiDigits = (num: string) => {
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
  };

  return (
    <div className="p-8 bg-white print:p-0">
      <style>{`
        @media print {
          @page { 
            margin: 8mm;
            size: A4 portrait;
          }
          body { 
            margin: 0 !important;
            padding: 0 !important;
          }
          .certificate-wrapper {
            page-break-inside: avoid !important;
            transform: scale(0.87) !important;
            transform-origin: top center !important;
          }
        }
        .cert-border { border: 3px solid black; padding: 12px; }
        .header-text { font-size: 10px; text-align: center; margin-bottom: 8px; line-height: 1.3; }
        .title { font-size: 16px; font-weight: bold; text-align: center; margin: 6px 0; }
        .subtitle { font-size: 12px; text-align: center; margin: 3px 0; }
        .content { font-size: 12px; line-height: 1.5; margin: 6px 0; }
        .content p { margin: 2px 0; }
        .photo-box { width: 80px; height: 100px; border: 2px solid black; display: inline-block; text-align: center; padding-top: 40px; font-size: 11px; }
      `}</style>

      <div className="certificate-wrapper">
      <div className="cert-border">
        <div className="header-text">
          शासन निर्णय क्रमांक: आरटीआय-२०१५/प्र.क्र.३२/पि.स.-५, दिनांक १४ जुलै, २०१५
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div className="photo-box">फोटो</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ margin: '20px 0' }}>
              <img src="/emblem.png" alt="Maharashtra" style={{ height: '60px', margin: '0 auto' }} onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div className="title">महाराष्ट्र शासन</div>
            <div className="subtitle">(नाम नंबर-अ) महाराष्ट्र शासन राजपत्र, भाग २०, १९९९/पैकी ३०, जून १९९९</div>
            <div className="subtitle">नमुना-ई FORM-E</div>
            <div className="title" style={{ marginTop: '15px' }}>विवाह नोंदणीचे प्रमाणपत्र</div>
            <div className="subtitle">CERTIFICATE OF REGISTRATION OF MARRIAGE</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>(यथा कलम (४)) आणि नियम (४)</div>
            <div style={{ fontSize: '12px' }}>(See Section (4)) and Rule (4)</div>
          </div>
          <div className="photo-box">फोटो</div>
        </div>

        <div className="content">
          <p>प्रमाणित करण्यात येतो की,</p>
          <p>Certified that the marriage between</p>
        </div>

        <div className="content">
          <p>पतीचे नाव {certificate.husbandNameMr} आधारकार्ड क्रमांक : {toMarathiDigits(certificate.husbandAadhar)}</p>
          <p style={{ color: '#0066cc' }}>Husbands Name {certificate.husbandNameEn} Adhar Card Number : {certificate.husbandAadhar}</p>
        </div>

        <div className="content">
          <p>पत्नीचे नाव {certificate.wifeNameMr} आणि</p>
          <p style={{ color: '#0066cc' }}>Wife Name {certificate.wifeNameEn} and</p>
        </div>

        <div className="content">
          <p>पत्नीचे नाव {certificate.wifeNameMr} आधारकार्ड क्रमांक : {toMarathiDigits(certificate.wifeAadhar)}</p>
          <p style={{ color: '#0066cc' }}>Wife Name {certificate.wifeNameEn} Adhar Card Number : {certificate.wifeAadhar}</p>
        </div>

        <div className="content">
          <p>विवाह दिनांक {formatDate(certificate.marriageDate)} रोजी {certificate.marriagePlace} येथे (स्थळाची)</p>
          <p style={{ color: '#0066cc' }}>Solemnized on {formatDate(certificate.marriageDate)} at {certificate.marriagePlace} (Place)</p>
        </div>

        <div className="content">
          <p>विवाह नियम १९६८ अंतर्गत महाराष्ट्र विवाह मंडळ आणि नोंदणी अधिनियम आणि विवाह नोंदणी अधिनियम १९६८.</p>
          <p>Registered of Marriages maintained under the Maharashtra Regulation of Marriage Bureaus and Registration of Marriages Act and Registration of Marriages Act 1968.</p>
        </div>

        <div className="content" style={{ marginTop: '20px' }}>
          <p>अनुक्रमांकाचे कार्यालय नोंदणीकृत नोंदणीच्या सदर क्रमांक {certificate.registrationNumber} च्या अनुक्रमांक -------------------- वर</p>
          <p style={{ color: '#0066cc' }}>On {formatDate(certificate.registrationDate)} at Serial No. {certificate.registrationNumber} registered by me.</p>
        </div>

        <div className="content" style={{ marginTop: '20px' }}>
          <p>दिनांक :- {formatDate(certificate.issueDate)}</p>
          <p style={{ color: '#0066cc' }}>Date :- {formatDate(certificate.issueDate)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
          <div>
            <p>दिठकाण : {certificate.placeOfIssue}</p>
            <p>Place : {certificate.placeOfIssue}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>निबंधक / विवाह नोंदणी तथा Registrar of Marriage</p>
            <p>ग्रामसेवक / ग्रामविकास अधिकारी / ग्रामपंचायत</p>
            <p>Gramsevak / Village Development Officer</p>
            <p>Grampanchayat</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px' }}>
          <p>शिक्का / Seal</p>
          <p style={{ marginTop: '15px' }}>अर्जदाराची सही / अंगठा / Applicant Signature</p>
        </div>

        <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '10px' }}>
          पृष्ठ २२ पैकी ११
        </div>
      </div>
      </div>
    </div>
  );
}
