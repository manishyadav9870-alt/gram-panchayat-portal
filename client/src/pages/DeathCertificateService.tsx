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
import { Skull, User, MapPin, Info, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transliterateToMarathi } from '@/lib/transliterate';

export default function DeathCertificateService() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    certificateNumber: 'DC-2025-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    registrationNumber: '',
    deceasedNameEn: '',
    deceasedNameMr: '',
    sex: '',
    dateOfDeath: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    placeOfDeathEn: '',
    placeOfDeathMr: '',
    ageAtDeath: '',
    fatherHusbandNameEn: '',
    fatherHusbandNameMr: '',
    permanentAddressEn: '',
    permanentAddressMr: '',
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
      if (formData.deceasedNameEn) {
        const translated = await transliterateToMarathi(formData.deceasedNameEn);
        setFormData(prev => ({ ...prev, deceasedNameMr: translated }));
      }
    };
    transliterate();
  }, [formData.deceasedNameEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.placeOfDeathEn) {
        const translated = await transliterateToMarathi(formData.placeOfDeathEn);
        setFormData(prev => ({ ...prev, placeOfDeathMr: translated }));
      }
    };
    transliterate();
  }, [formData.placeOfDeathEn]);

  useEffect(() => {
    const transliterate = async () => {
      if (formData.fatherHusbandNameEn) {
        const translated = await transliterateToMarathi(formData.fatherHusbandNameEn);
        setFormData(prev => ({ ...prev, fatherHusbandNameMr: translated }));
      }
    };
    transliterate();
  }, [formData.fatherHusbandNameEn]);

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
      console.log('Submitting death certificate data:', formData);
      
      const response = await fetch('/api/death-certificates', {
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
          description: t('Death certificate saved successfully. Redirecting to print...', 'मृत्यू प्रमाणपत्र यशस्वीरित्या जतन केले. प्रिंटकडे पाठवत आहे...'),
        });
        // Redirect to print page
        setTimeout(() => {
          setLocation(`/death-certificate/print/${data.id}`);
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
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Skull className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {t('Death Certificate Application', 'मृत्यू प्रमाणपत्र अर्ज')}
              </h1>
              <p className="text-red-100">
                {t('Apply for official death certificate', 'अधिकृत मृत्यू प्रमाणपत्रासाठी अर्ज करा')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Certificate Information */}
          <Card className="mb-6">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Info className="h-5 w-5" />
                {t('Certificate Information', 'प्रमाणपत्र माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="certificateNumber">{t('Certificate Number', 'प्रमाणपत्र क्रमांक')} *</Label>
                  <Input
                    id="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={(e) => handleChange('certificateNumber', e.target.value)}
                    className="mt-2"
                    required
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
              </div>
            </CardContent>
          </Card>

          {/* Deceased Information */}
          <Card className="mb-6">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Skull className="h-5 w-5" />
                {t('Deceased Information', 'मृत व्यक्तीची माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="deceasedNameEn">{t('Deceased Full Name (English)', 'मृत व्यक्तीचे पूर्ण नाव (इंग्रजी)')} *</Label>
                  <Input
                    id="deceasedNameEn"
                    value={formData.deceasedNameEn}
                    onChange={(e) => handleChange('deceasedNameEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deceasedNameMr">
                    {t('Deceased Full Name (Marathi)', 'मृत व्यक्तीचे पूर्ण नाव (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="deceasedNameMr"
                    value={formData.deceasedNameMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
                <div>
                  <Label htmlFor="sex">{t('Sex', 'लिंग')} *</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleChange('sex', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t('Select sex', 'लिंग निवडा')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('Male', 'पुरुष')}</SelectItem>
                      <SelectItem value="female">{t('Female', 'स्त्री')}</SelectItem>
                      <SelectItem value="other">{t('Other', 'इतर')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ageAtDeath">{t('Age at Death', 'मृत्यू वेळी वय')} *</Label>
                  <Input
                    id="ageAtDeath"
                    type="number"
                    value={formData.ageAtDeath}
                    onChange={(e) => handleChange('ageAtDeath', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfDeath">{t('Date of Death', 'मृत्यू तारीख')} *</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => handleChange('dateOfDeath', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfRegistration">{t('Date of Registration', 'नोंदणी तारीख')} *</Label>
                  <Input
                    id="dateOfRegistration"
                    type="date"
                    value={formData.dateOfRegistration}
                    onChange={(e) => handleChange('dateOfRegistration', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfDeathEn">{t('Place of Death (English)', 'मृत्यू स्थान (इंग्रजी)')} *</Label>
                  <Input
                    id="placeOfDeathEn"
                    value={formData.placeOfDeathEn}
                    onChange={(e) => handleChange('placeOfDeathEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfDeathMr">
                    {t('Place of Death (Marathi)', 'मृत्यू स्थान (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="placeOfDeathMr"
                    value={formData.placeOfDeathMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Father/Husband Information */}
          <Card className="mb-6">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <User className="h-5 w-5" />
                {t("Father's/Husband's Information", 'वडील/पतीची माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fatherHusbandNameEn">{t("Father's/Husband's Full Name (English)", 'वडील/पतीचे पूर्ण नाव (इंग्रजी)')} *</Label>
                  <Input
                    id="fatherHusbandNameEn"
                    value={formData.fatherHusbandNameEn}
                    onChange={(e) => handleChange('fatherHusbandNameEn', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fatherHusbandNameMr">
                    {t("Father's/Husband's Full Name (Marathi)", 'वडील/पतीचे पूर्ण नाव (मराठी)')}
                    <span className="text-xs text-green-600 ml-2 font-semibold">
                      ✓ {t('Auto-filled', 'स्वयं-भरलेले')}
                    </span>
                  </Label>
                  <Input
                    id="fatherHusbandNameMr"
                    value={formData.fatherHusbandNameMr}
                    readOnly
                    className="mt-2 bg-green-50 border-green-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="mb-6">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <MapPin className="h-5 w-5" />
                {t('Address Information', 'पत्ता माहिती')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
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
              className="bg-red-600 hover:bg-red-700 gap-2 px-8"
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
