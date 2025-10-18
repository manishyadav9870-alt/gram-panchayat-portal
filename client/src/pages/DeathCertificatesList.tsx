import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skull, Plus, Eye, Printer, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DeathCertificate {
  id: number;
  certificateNumber: string;
  deceasedNameEn: string;
  deceasedNameMr: string;
  dateOfDeath: string;
  sex: string;
  ageAtDeath: string;
  placeOfDeathEn: string;
  dateOfRegistration: string;
  status: string;
}

export default function DeathCertificatesList() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<DeathCertificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/death-certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.deceasedNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Skull className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t('Death Certificates', 'मृत्यू प्रमाणपत्रे')}
              </h1>
            </div>
            <Link href="/services/death-certificate">
              <Button className="bg-red-600 hover:bg-red-700 gap-2">
                <Plus className="h-5 w-5" />
                {t('New Certificate', 'नवीन प्रमाणपत्र')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t('Search by name or certificate number...', 'नाव किंवा प्रमाणपत्र क्रमांकाने शोधा...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Certificate No.', 'प्रमाणपत्र क्र.')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t("Deceased's Name", 'मृत व्यक्तीचे नाव')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Date of Death', 'मृत्यू तारीख')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Sex', 'लिंग')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Age at Death', 'मृत्यूच्या वेळी वय')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Place of Death', 'मृत्यू स्थान')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    {t('Actions', 'क्रिया')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        {t('Loading...', 'लोड होत आहे...')}
                      </div>
                    </td>
                  </tr>
                ) : filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Skull className="h-16 w-16 text-gray-300" />
                        <p className="text-gray-500">
                          {t('No death certificates found. Click "New Certificate" to add one.', 'कोणतेही मृत्यू प्रमाणपत्र सापडले नाही. "नवीन प्रमाणपत्र" वर क्लिक करा.')}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {cert.certificateNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{cert.deceasedNameEn}</div>
                          <div className="text-xs text-gray-500">{cert.deceasedNameMr}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(cert.dateOfDeath).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.sex === 'male' ? t('Male', 'पुरुष') : cert.sex === 'female' ? t('Female', 'स्त्री') : t('Other', 'इतर')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.ageAtDeath} {t('years', 'वर्षे')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.placeOfDeathEn}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/death-certificate/${cert.id}`}>
                            <Button variant="outline" size="sm" className="gap-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-300">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/death-certificate/${cert.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <a href={`/death-certificate/print/${cert.id}`} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
