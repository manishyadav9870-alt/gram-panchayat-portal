import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, Plus, Eye, Printer, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BirthCertificate {
  id: number;
  certificateNumber: string;
  childNameEn: string;
  childNameMr: string;
  dateOfBirth: string;
  fatherNameEn: string;
  motherNameEn: string;
  dateOfRegistration: string;
  status: string;
}

export default function BirthCertificatesList() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<BirthCertificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/birth-certificates');
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
    cert.childNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t('Birth Certificates', 'जन्म प्रमाणपत्रे')}
              </h1>
            </div>
            <Link href="/services/birth-certificate">
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
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

        {/* Table Header */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Certificate No.', 'प्रमाणपत्र क्र.')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t("Child's Name", 'मुलाचे नाव')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Date of Birth', 'जन्म तारीख')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t("Father's Name", 'वडिलांचे नाव')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t("Mother's Name", 'आईचे नाव')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {t('Registration Date', 'नोंदणी तारीख')}
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
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        {t('Loading...', 'लोड होत आहे...')}
                      </div>
                    </td>
                  </tr>
                ) : filteredCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Baby className="h-16 w-16 text-gray-300" />
                        <p className="text-gray-500">
                          {t('No birth certificates found. Click "New Certificate" to add one.', 'कोणतेही जन्म प्रमाणपत्र सापडले नाही. "नवीन प्रमाणपत्र" वर क्लिक करा.')}
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
                          <div className="font-medium">{cert.childNameEn}</div>
                          <div className="text-xs text-gray-500">{cert.childNameMr}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(cert.dateOfBirth).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.fatherNameEn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.motherNameEn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(cert.dateOfRegistration).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/birth-certificate/${cert.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              {t('View', 'पहा')}
                            </Button>
                          </Link>
                          <a href={`/birth-certificate/print/${cert.id}`} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                            >
                              <Printer className="h-4 w-4" />
                              {t('Print', 'प्रिंट')}
                            </Button>
                          </a>
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
