import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Printer } from 'lucide-react';

interface MarriageCertificate {
  id: string;
  certificateNumber: string;
  husbandNameEn: string;
  husbandNameMr: string;
  wifeNameEn: string;
  wifeNameMr: string;
  marriageDate: string;
  marriagePlace: string;
}

export default function MarriageCertificatesTable() {
  const [certificates, setCertificates] = useState<MarriageCertificate[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/marriage-certificates');
      const data = await response.json();
      setCertificates(data.slice(0, 5)); // Show only latest 5
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      const response = await fetch(`/api/marriage-certificates/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCertificates();
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error);
    }
  };

  const handlePrint = (id: string) => {
    window.open(`/marriage-certificate/print/${id}`, '_blank');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certificate No.</TableHead>
            <TableHead>Couple Names</TableHead>
            <TableHead>Marriage Date</TableHead>
            <TableHead>Place</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No marriage certificates found. Click "New Certificate" to create one.
              </TableCell>
            </TableRow>
          ) : (
            certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.certificateNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{cert.husbandNameEn} & {cert.wifeNameEn}</span>
                    <span className="text-sm text-gray-500">{cert.husbandNameMr} & {cert.wifeNameMr}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(cert.marriageDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell>{cert.marriagePlace}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation(`/admin/marriage-certificate/${cert.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePrint(cert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
