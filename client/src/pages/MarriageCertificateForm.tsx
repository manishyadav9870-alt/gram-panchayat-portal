import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Users, Heart, MapPin, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MarriageCertificateForm() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/marriage-certificate/:id');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditMode = params?.id && params.id !== 'new';
  
  const generateCertificateNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MC/${year}/${month}/${random}`;
  };

  const [formData, setFormData] = useState({
    certificateNumber: generateCertificateNumber(),
    registrationNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    husbandNameEn: '',
    husbandNameMr: '',
    husbandAadhar: '',
    wifeNameEn: '',
    wifeNameMr: '',
    wifeAadhar: '',
    marriageDate: '',
    marriagePlace: '',
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
      const response = await fetch(`/api/marriage-certificates/${id}`);
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
    if (!formData.husbandNameEn || !formData.wifeNameEn || !formData.marriageDate) {
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Please fill all required fields', 'कृपया सर्व आवश्यक फील्ड भरा'),
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Saving data:', formData);
      const response = await fetch('/api/marriage-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Marriage certificate saved successfully', 'विवाह प्रमाणपत्र यशस्वीरित्या जतन केले')
        });
        setLocation('/admin/marriage-certificates');
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
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {t('Marriage Certificate', 'विवाह प्रमाणपत्र')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Certificate Information */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <FileText className="h-5 w-5" />
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
                <Label htmlFor="registrationNumber">{t('Registration Number', 'नोंदणी क्रमांक')}</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="registrationDate">{t('Registration Date', 'नोंदणी दिनांक')}</Label>
                <Input
                  id="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => handleChange('registrationDate', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Husband Details */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Users className="h-5 w-5" />
              {t('Husband Details', 'पतीची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="husbandNameEn">
                  {t('Husband Name (English)', 'पतीचे नाव (इंग्रजी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="husbandNameEn"
                  value={formData.husbandNameEn}
                  onChange={async (e) => {
                    const value = e.target.value;
                    handleChange('husbandNameEn', value);
                    if (value) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(value)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1]?.[0]?.[1]?.[0]) {
                          handleChange('husbandNameMr', data[1][0][1][0]);
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
                <Label htmlFor="husbandNameMr">
                  {t('Husband Name (Marathi)', 'पतीचे नाव (मराठी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="husbandNameMr"
                  value={formData.husbandNameMr}
                  onChange={(e) => handleChange('husbandNameMr', e.target.value)}
                  className="mt-2 bg-green-50 border-green-300"
                  placeholder={t('Auto-translated', 'स्वयं-अनुवादित')}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="husbandAadhar">
                  {t('Husband Aadhar Number', 'पतीचा आधार क्रमांक')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="husbandAadhar"
                  value={formData.husbandAadhar}
                  onChange={(e) => handleChange('husbandAadhar', e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  className="mt-2"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wife Details */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Users className="h-5 w-5" />
              {t('Wife Details', 'पत्नीची माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="wifeNameEn">
                  {t('Wife Name (English)', 'पत्नीचे नाव (इंग्रजी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="wifeNameEn"
                  value={formData.wifeNameEn}
                  onChange={async (e) => {
                    const value = e.target.value;
                    handleChange('wifeNameEn', value);
                    if (value) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(value)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1]?.[0]?.[1]?.[0]) {
                          handleChange('wifeNameMr', data[1][0][1][0]);
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
                <Label htmlFor="wifeNameMr">
                  {t('Wife Name (Marathi)', 'पत्नीचे नाव (मराठी)')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="wifeNameMr"
                  value={formData.wifeNameMr}
                  onChange={(e) => handleChange('wifeNameMr', e.target.value)}
                  className="mt-2 bg-green-50 border-green-300"
                  placeholder={t('Auto-translated', 'स्वयं-अनुवादित')}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="wifeAadhar">
                  {t('Wife Aadhar Number', 'पत्नीचा आधार क्रमांक')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="wifeAadhar"
                  value={formData.wifeAadhar}
                  onChange={(e) => handleChange('wifeAadhar', e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  className="mt-2"
                  placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marriage Details */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Heart className="h-5 w-5" />
              {t('Marriage Details', 'विवाह तपशील')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="marriageDate">
                  {t('Marriage Date', 'विवाह दिनांक')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="marriageDate"
                  type="date"
                  value={formData.marriageDate}
                  onChange={(e) => handleChange('marriageDate', e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="marriagePlace">{t('Marriage Place', 'विवाह स्थळ')}</Label>
                <Input
                  id="marriagePlace"
                  value={formData.marriagePlace}
                  onChange={(e) => handleChange('marriagePlace', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="mb-6 bg-white shadow-xl rounded-3xl border-2 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-t-3xl">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <MapPin className="h-5 w-5" />
              {t('Location Information', 'स्थान माहिती')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
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
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 gap-2"
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
