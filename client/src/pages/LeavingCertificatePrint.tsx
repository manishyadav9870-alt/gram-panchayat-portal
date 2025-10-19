import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';

interface LeavingCertificate {
  id: string;
  certificateNumber: string;
  dispatchNumber: string;
  dispatchDate: string;
  applicantNameEn: string;
  applicantNameMr: string;
  aadharNumber: string;
  residentOfEn: string;
  residentOfMr: string;
  taluka: string;
  district: string;
  state: string;
  issuingAuthority: string;
  issueDate: string;
  placeOfIssue: string;
}

export default function LeavingCertificatePrint() {
  const [, params] = useRoute('/leaving-certificate/print/:id');
  const [certificate, setCertificate] = useState<LeavingCertificate | null>(null);
  const [talukaMr, setTalukaMr] = useState('');
  const [districtMr, setDistrictMr] = useState('');
  const [applicantNameMr, setApplicantNameMr] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetchCertificate(params.id);
    }
  }, [params?.id]);

  const fetchCertificate = async (id: string) => {
    try {
      const response = await fetch(`/api/leaving-certificates/${id}`);
      const data = await response.json();
      setCertificate(data);
      
      // Auto-translate to Marathi if not already in Marathi
      if (data.taluka) {
        translateToMarathi(data.taluka, setTalukaMr);
      }
      if (data.district) {
        translateToMarathi(data.district, setDistrictMr);
      }
      // Translate applicant name if Marathi name is not available
      if (!data.applicantNameMr && data.applicantNameEn) {
        translateToMarathi(data.applicantNameEn, setApplicantNameMr);
      } else {
        setApplicantNameMr(data.applicantNameMr);
      }
      
      // Auto print after data loads
      setTimeout(() => window.print(), 1500);
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
    }
  };

  const translateToMarathi = async (text: string, setter: (value: string) => void) => {
    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=mr-t-i0-und&num=1`);
      const data = await response.json();
      if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
        setter(data[1][0][1][0]);
      } else {
        setter(text);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setter(text);
    }
  };

  if (!certificate) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toMarathiDigits = (num: string) => {
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.replace(/\d/g, (digit) => marathiDigits[parseInt(digit)]);
  };

  return (
    <div className="p-8 bg-white print:p-0">
      <style>{`
        @media print {
          @page { margin: 15mm; }
          body { margin: 0; padding: 0; }
        }
        .header {
          text-align: left;
          margin-bottom: 20px;
          border-bottom: 2px solid black;
          padding-bottom: 10px;
        }
        .header p {
          font-size: 11px;
          margin: 0;
        }
        .office-section {
          margin: 20px 0;
        }
        .office-line {
          margin: 5px 0;
          font-size: 14px;
        }
        .title-section {
          text-align: center;
          margin: 20px 0;
          border-top: 2px solid black;
          border-bottom: 2px solid black;
          padding: 10px 0;
        }
        .title-section h3 {
          margin: 5px 0;
          font-size: 18px;
          text-decoration: underline;
        }
        .dispatch-section {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          font-size: 14px;
        }
        .content-line {
          margin: 15px 0;
          font-size: 14px;
          line-height: 1.8;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
        }
        .page-number {
          text-align: right;
          margin-top: 40px;
          font-size: 12px;
        }
      `}</style>

      <div className="header">
        <p>शासन निर्णय क्रमांक: आरटीआइ-२०१५/प्र.क्र.३२/पि.स.-५, दिनांक १५ जुलै, २०१५</p>
      </div>
      
      <div className="office-section">
        <div className="office-line">
          ग्रामपंचायत कार्यालय ----------------------ता.{certificate.taluka}----------------------जि.{certificate.district}---------
        </div>
        <div className="office-line">
          Grampanchayat Office -------------------Tal.{certificate.taluka}---------------------------Dist.{certificate.district}-------------
        </div>
      </div>

      <div className="title-section">
        <h3>रहिवासी दाखला</h3>
        <h3>Living Certificate</h3>
      </div>

      <div className="dispatch-section">
        <div>
          <div>जा.क्र. {certificate.dispatchNumber}</div>
          <div>Dispatch no. {certificate.dispatchNumber}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>दिनांक :- {formatDate(certificate.dispatchDate)}</div>
          <div>Date :- {formatDate(certificate.dispatchDate)}</div>
        </div>
      </div>

      <div className="content-line">
        सरपंच/ग्रामसेवक/ग्रामविकास अधिकारी<br/>
        Sarpanch/Gramsevak/Village Development Officer
      </div>

      <div className="content-line">
        ग्रामपंचायत {(certificate as any).grampanchayatNameMr || 'किशोर'} ता.{talukaMr || certificate.taluka} जि.{districtMr || certificate.district}, महाराष्ट्र<br/>
        Grampanchayat {(certificate as any).grampanchayatNameEn || 'Kishore'} Tal.{certificate.taluka} Dist.{certificate.district}, Maharashtra
      </div>

      <div className="content-line">
        यांजकडून तयारीस येणारा देत आहे. श्री/श्रीमती {applicantNameMr}<br/>
        is issuing the certificate to Mr./Mrs. {certificate.applicantNameEn}
      </div>

      <div className="content-line">
        आधार कार्ड क्रमांक {toMarathiDigits(certificate.aadharNumber)}<br/>
        Adhar Card Number {certificate.aadharNumber}
      </div>

      <div className="content-line">
        रा.{certificate.residentOfMr} ता.{talukaMr || certificate.taluka} जि.{districtMr || certificate.district} येथील रहिवासी आहेत.<br/>
        is a resident of {certificate.residentOfEn} Tal.{certificate.taluka} Dist.{certificate.district}
      </div>

      <div className="content-line">
        हे/ती, आज दिनांक {formatDate(certificate.issueDate)} रोजी हयात आहेत व त्यांची माझ्या समक्ष सही / अंगठा ठेवला आहे.<br/>
        He/She is alive till today, & signing this document in front of me
      </div>

      <div className="content-line">
        सदर दाखला अर्जदाराच्या मागणीनुसार देण्यात येत आहे.<br/>
        This certificate is issued on request of the applicant.
      </div>

      <div className="signature-section">
        <div>
          <div>दिठकाण : {certificate.placeOfIssue}</div>
          <div>Place : {certificate.placeOfIssue}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>सही व शिक्का</div>
          <div>Signature with Stamp</div>
          <div style={{ marginTop: '10px' }}>सरपंच/ग्रामसेवक/ग्रामविकास अधिकारी</div>
          <div>Sarpanch/Gramsevak/Village Development Officer</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        अर्जदाराची सही / अंगठा / Applicant Signature
      </div>

      <div className="page-number">
        पृष्ठ २२ पैकी १५
      </div>
    </div>
  );
}
