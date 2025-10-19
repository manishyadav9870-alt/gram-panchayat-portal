import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, Printer, Calendar, User, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  createdAt: string;
}

export default function LeavingCertificatesList() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<LeavingCertificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching leaving certificates...');
      const response = await fetch('/api/leaving-certificates');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Fetched certificates:', data);
      setCertificates(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Failed to fetch certificates', 'प्रमाणपत्रे आणण्यात अयशस्वी'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (certificateId: string) => {
    // Open print page in new window
    window.open(`/leaving-certificate/print/${certificateId}`, '_blank');
  };

  const handleDelete = async (certificateId: string) => {
    if (!confirm(t('Are you sure you want to delete this certificate?', 'तुम्हाला हे प्रमाणपत्र हटवायचे आहे का?'))) {
      return;
    }

    try {
      const response = await fetch(`/api/leaving-certificates/${certificateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: t('Success', 'यशस्वी'),
          description: t('Certificate deleted successfully', 'प्रमाणपत्र यशस्वीरित्या हटवले')
        });
        fetchCertificates(); // Refresh list
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: t('Error', 'त्रुटी'),
        description: t('Failed to delete certificate', 'प्रमाणपत्र हटवण्यात अयशस्वी'),
        variant: 'destructive'
      });
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.applicantNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.applicantNameMr.includes(searchTerm) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.aadharNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('Leaving Certificates', 'रहिवासी दाखले')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('Manage all leaving certificates', 'सर्व रहिवासी दाखले व्यवस्थापित करा')}
            </p>
          </div>
          <Button
            onClick={() => setLocation('/admin/leaving-certificate/new')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('New Certificate', 'नवीन दाखला')}
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-white shadow-lg rounded-2xl border-2 border-gray-200">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t('Search by name, certificate number, or Aadhar...', 'नाव, प्रमाणपत्र क्रमांक किंवा आधार शोधा...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Certificates List */}
        <Card className="bg-white shadow-lg rounded-2xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <FileText className="h-5 w-5" />
              {t('All Certificates', 'सर्व दाखले')} ({filteredCertificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                {t('Loading...', 'लोड करत आहे...')}
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('No certificates found', 'कोणतेही दाखले आढळले नाहीत')}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-orange-100 p-3 rounded-xl">
                            <FileText className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {language === 'en' ? certificate.applicantNameEn : certificate.applicantNameMr}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('Certificate No:', 'प्रमाणपत्र क्र:')} {certificate.certificateNumber}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              <User className="h-3 w-3 inline mr-1" />
                              {t('Aadhar', 'आधार')}
                            </p>
                            <p className="text-sm font-medium">{certificate.aadharNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {t('Issue Date', 'जारी दिनांक')}
                            </p>
                            <p className="text-sm font-medium">
                              {new Date(certificate.issueDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('Taluka', 'तालुका')}</p>
                            <p className="text-sm font-medium">{certificate.taluka}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('District', 'जिल्हा')}</p>
                            <p className="text-sm font-medium">{certificate.district}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => setLocation(`/admin/leaving-certificate/${certificate.id}`)}
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {t('Edit', 'संपादित करा')}
                        </Button>
                        <Button
                          onClick={() => handlePrint(certificate.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          {t('Print', 'प्रिंट')}
                        </Button>
                        <Button
                          onClick={() => handleDelete(certificate.id)}
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('Delete', 'हटवा')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
