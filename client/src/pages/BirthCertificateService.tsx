import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baby, User, MapPin, Info, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transliterateToMarathi } from '@/lib/transliterate';

export default function BirthCertificateService() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    certificateNumber: 'BC-2025-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    registrationNumber: '',
    childNameEn: '',
    childNameMr: '',
    sex: '',
    dateOfBirth: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    placeOfBirthEn: '',
    placeOfBirthMr: '',
    motherNameEn: '',
    motherNameMr: '',
    motherAadhar: '',
    fatherNameEn: '',
    fatherNameMr: '',
    fatherAadhar: '',
    permanentAddressEn: '',
    permanentAddressMr: '',
    birthAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    issuingAuthority: 'ग्रामपंचायत किशोर',
    remarksEn: '',
    remarksMr: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-transliterate English fields to Marathi using Google API
  useEffect(() => {
    const transliterate = async () => {
      if (formData.childNameEn) {
        const translated = await transliterateToMarathi(formData.childNameEn);
        setFormData(prev => ({ ...prev, childNameMr: translated }));
      }
    };
    transliterate();
  }, [formData.childNameEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.placeOfBirthEn) {
        const translated = await transliterateToMarathi(formData.placeOfBirthEn);
        setFormData(prev => ({ ...prev, placeOfBirthMr: translated }));
      }
    };
    transliterate();
  }, [formData.placeOfBirthEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.motherNameEn) {
        const translated = await transliterateToMarathi(formData.motherNameEn);
        setFormData(prev => ({ ...prev, motherNameMr: translated }));
      }
    };
    transliterate();
  }, [formData.motherNameEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.fatherNameEn) {
        const translated = await transliterateToMarathi(formData.fatherNameEn);
        setFormData(prev => ({ ...prev, fatherNameMr: translated }));
      }
    };
    transliterate();
  }, [formData.fatherNameEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.permanentAddressEn) {
        const translated = await transliterateToMarathi(formData.permanentAddressEn);
        setFormData(prev => ({ ...prev, permanentAddressMr: translated }));
      }
    };
    transliterate();
  }, [formData.permanentAddressEn]);

  const handleSubmit = async () => {
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/birth-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Birth certificate saved successfully. Redirecting to print...', 'जन्म प्रमाणपत्र यशस्वीरित्या जतन केले. प्रिंटकडे पाठवत आहे...'),
        });
        // Redirect to print page
        setTimeout(() => {
          setLocation(`/birth-certificate/print/${data.id}`);
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to submit');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: t('Error', 'त्रुटी'),
        description: error.message || t('Failed to submit application', 'अर्ज सबमिट करण्यात अयशस्वी'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Baby className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {t('Birth Certificate Application', 'जन्म प्रमाणपत्र अर्ज')}
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Certificate Information */}
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Baby className="h-5 w-5" />
                {t('Certificate Information', 'प्रमाणपत्र माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="certificateNumber">
                    {t('Certificate Number', 'प्रमाणपत्र क्रमांक')}
                  </Label>
                  <Input
                    id="certificateNumber"
                    value={formData.certificateNumber}
                    readOnly
                    className="mt-2 bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">
                    {t('Registration Number', 'नोंदणी क्रमांक')}
                  </Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Child Information */}
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Baby className="h-5 w-5" />
                {t('Child Information', 'मुलाची माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="childNameEn">
                    {t('Child Name (English)', 'मुलाचे नाव (इंग्रजी)')} *
                  </Label>
                  <Input
                    id="childNameEn"
                    placeholder={t("Enter child's name in English", "मुलाचे नाव इंग्रजीत टाका")}
                    value={formData.childNameEn}
                    onChange={(e) => handleChange('childNameEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="childNameMr">
                    {t('Child Name (Marathi)', 'मुलाचे नाव (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="childNameMr"
                    value={formData.childNameMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
                <div>
                  <Label htmlFor="sex">{t('Sex', 'लिंग')} *</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleChange('sex', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t('-- Select --', '-- निवडा --')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('Male', 'पुरुष')}</SelectItem>
                      <SelectItem value="female">{t('Female', 'स्त्री')}</SelectItem>
                      <SelectItem value="other">{t('Other', 'इतर')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">{t('Date of Birth', 'जन्म तारीख')} *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfBirthEn">{t('Place of Birth (English)', 'जन्म स्थान (इंग्रजी)')} *</Label>
                  <Input
                    id="placeOfBirthEn"
                    value={formData.placeOfBirthEn}
                    onChange={(e) => handleChange('placeOfBirthEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfBirthMr">
                    {t('Place of Birth (Marathi)', 'जन्म स्थान (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="placeOfBirthMr"
                    value={formData.placeOfBirthMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mother's Information */}
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" />
                {t("Mother's Information", 'आईची माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="motherNameEn">{t("Mother's Full Name (English)", 'आईचे पूर्ण नाव (इंग्रजी)')} *</Label>
                  <Input
                    id="motherNameEn"
                    value={formData.motherNameEn}
                    onChange={(e) => handleChange('motherNameEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motherNameMr">
                    {t("Mother's Full Name (Marathi)", 'आईचे पूर्ण नाव (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="motherNameMr"
                    value={formData.motherNameMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="motherAadhar">{t("Mother's Aadhar Number", 'आईचा आधार क्रमांक')} *</Label>
                  <Input
                    id="motherAadhar"
                    placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                    value={formData.motherAadhar}
                    onChange={(e) => handleChange('motherAadhar', e.target.value)}
                    maxLength={12}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Father's Information */}
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" />
                {t("Father's Information", 'वडिलांची माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fatherNameEn">{t("Father's Full Name (English)", 'वडिलांचे पूर्ण नाव (इंग्रजी)')} *</Label>
                  <Input
                    id="fatherNameEn"
                    value={formData.fatherNameEn}
                    onChange={(e) => handleChange('fatherNameEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fatherNameMr">
                    {t("Father's Full Name (Marathi)", 'वडिलांचे पूर्ण नाव (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="fatherNameMr"
                    value={formData.fatherNameMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="fatherAadhar">{t("Father's Aadhar Number", 'वडिलांचा आधार क्रमांक')} *</Label>
                  <Input
                    id="fatherAadhar"
                    placeholder={t('Enter 12 digit Aadhar number', '12 अंकी आधार क्रमांक टाका')}
                    value={formData.fatherAadhar}
                    onChange={(e) => handleChange('fatherAadhar', e.target.value)}
                    maxLength={12}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MapPin className="h-5 w-5" />
                {t('Address Information', 'पत्ता माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="permanentAddressEn">{t('Permanent Address (English)', 'कायमचा पत्ता (इंग्रजी)')} *</Label>
                  <Textarea
                    id="permanentAddressEn"
                    value={formData.permanentAddressEn}
                    onChange={(e) => handleChange('permanentAddressEn', e.target.value)}
                    rows={3}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="permanentAddressMr">
                    {t('Permanent Address (Marathi)', 'कायमचा पत्ता (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Textarea
                    id="permanentAddressMr"
                    value={formData.permanentAddressMr}
                    readOnly
                    rows={3}
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 gap-2 px-12"
            >
              <Save className="h-5 w-5" />
              {t('Submit Application', 'अर्ज सबमिट करा')}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
