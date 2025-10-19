import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, User, MapPin, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LeavingCertificateForm() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/leaving-certificate/:id');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditMode = params?.id && params.id !== 'new';
  
  // Generate auto certificate number
  const generateCertificateNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LC/${year}/${month}/${random}`;
  };

  const [formData, setFormData] = useState({
    certificateNumber: generateCertificateNumber(),
    dispatchNumber: '',
    dispatchDate: new Date().toISOString().split('T')[0],
    applicantNameEn: '',
    applicantNameMr: '',
    aadharNumber: '',
    grampanchayatNameEn: 'Kishore',
    grampanchayatNameMr: 'किशोर',
    residentOfEn: '',
    residentOfMr: '',
    taluka: '',
    district: '',
    state: 'Maharashtra',
    issuingAuthority: 'ग्रामपंचायत किशोर',
    issueDate: new Date().toISOString().split('T')[0],
    placeOfIssue: 'किशोर',
  });

  useEffect(() => {
    if (isEditMode && params?.id) {
      fetchCertificate(params.id);
    }
  }, [isEditMode, params?.id]);

  const fetchCertificate = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaving-certificates/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Failed to load certificate', 'प्रमाणपत्र लोड करण्यात अयशस्वी'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.applicantNameEn || !formData.applicantNameMr || !formData.aadharNumber) {
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Please fill all required fields', 'कृपया सर्व आवश्यक फील्ड भरा'),
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Saving data:', formData);
      const response = await fetch('/api/leaving-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Leaving certificate saved successfully', 'रहिवासी दाखला यशस्वीरित्या जतन केला')
        });
        setLocation('/admin/leaving-certificates');
      } else {
        throw new Error(data.message || 'Failed to save');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: t('Error', 'त्रुटी'),
        description: error.message || t('Failed to save certificate', 'प्रमाणपत्र जतन करण्यात अयशस्वी'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 print:hidden">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {t('Leaving Certificate', 'रहिवासी दाखला')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Certificate Information */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <User className="h-5 w-5" />
              {t('Certificate Information', 'प्रमाणपत्र माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="certificateNumber">
                  {t('Certificate Number', 'प्रमाणपत्र क्रमांक')} 
                  <span className="text-xs text-gray-500 ml-2">({t('Auto-generated', 'स्वयं-निर्मित')})</span>
                </Label>
                <Input
                  id="certificateNumber"
                  value={formData.certificateNumber}
                  readOnly
                  className="mt-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="dispatchNumber">
                  {t('Dispatch Number', 'जा.क्र.')}
                </Label>
                <Input
                  id="dispatchNumber"
                  value={formData.dispatchNumber}
                  onChange={(e) => handleChange('dispatchNumber', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="dispatchDate">{t('Dispatch Date', 'दिनांक')}</Label>
                <Input
                  id="dispatchDate"
                  type="date"
                  value={formData.dispatchDate}
                  onChange={(e) => handleChange('dispatchDate', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <User className="h-5 w-5" />
              {t('Applicant Information', 'अर्जदाराची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="applicantNameEn">
                  {t('Applicant Name (English)', 'अर्जदाराचे नाव (इंग्रजी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicantNameEn"
                  value={formData.applicantNameEn}
                  onChange={async (e) => {
                    const englishValue = e.target.value;
                    handleChange('applicantNameEn', englishValue);
                    
                    // Auto-translate to Marathi
                    if (englishValue) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(englishValue)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                          handleChange('applicantNameMr', data[1][0][1][0]);
                        }
                      } catch (error) {
                        console.error('Translation failed:', error);
                      }
                    }
                  }}
                  className="mt-2"
                  placeholder={t('Enter name in English', 'इंग्रजीमध्ये नाव टाका')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicantNameMr">
                  {t('Applicant Name (Marathi)', 'अर्जदाराचे नाव (मराठी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicantNameMr"
                  value={formData.applicantNameMr}
                  onChange={(e) => handleChange('applicantNameMr', e.target.value)}
                  className="mt-2 bg-green-50 border-green-300"
                  placeholder={t('Auto-translated', 'स्वयं-अनुवादित')}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="aadharNumber">
                  {t('Aadhar Number', 'आधार क्रमांक')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="aadharNumber"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  value={formData.aadharNumber}
                  onChange={(e) => handleChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  className="mt-2"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <MapPin className="h-5 w-5" />
              {t('Address Information', 'पत्ता माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="residentOfEn">{t('Resident Of (English)', 'रहिवासी (इंग्रजी)')}</Label>
                <Input
                  id="residentOfEn"
                  value={formData.residentOfEn}
                  onChange={async (e) => {
                    const englishValue = e.target.value;
                    handleChange('residentOfEn', englishValue);
                    
                    // Auto-translate to Marathi
                    if (englishValue) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(englishValue)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                          handleChange('residentOfMr', data[1][0][1][0]);
                        }
                      } catch (error) {
                        console.error('Translation failed:', error);
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="residentOfMr">{t('Resident Of (Marathi)', 'रहिवासी (मराठी)')}</Label>
                <Input
                  id="residentOfMr"
                  value={formData.residentOfMr}
                  onChange={(e) => handleChange('residentOfMr', e.target.value)}
                  className="mt-2 bg-green-50 border-green-300"
                  placeholder={t('Auto-translated', 'स्वयं-अनुवादित')}
                />
              </div>
              <div>
                <Label htmlFor="taluka">{t('Taluka', 'तालुका')}</Label>
                <Input
                  id="taluka"
                  value={formData.taluka}
                  onChange={(e) => handleChange('taluka', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="district">{t('District', 'जिल्हा')}</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="state">{t('State', 'राज्य')}</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation('/admin/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('Back to List', 'यादीकडे परत')}
          </Button>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleSave}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              <Save className="h-5 w-5" />
              {t('Save Certificate', 'प्रमाणपत्र जतन करा')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
