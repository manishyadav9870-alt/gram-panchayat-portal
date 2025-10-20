import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function WaterConnectionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/water/connections/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok) {
        setResult(result);
        setFile(null);
        const fileInput = document.getElementById('water-file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = (format: 'csv' | 'excel') => {
    const headers = [
      'connection_number',
      'house_number',
      'consumer_name',
      'consumer_name_mr',
      'address',
      'address_mr',
      'monthly_charge',
      'connection_date'
    ];
    
    const sampleData = [
      'WC/2025/001',
      'घर पट्टी-123',
      'राम कुमार',
      'राम कुमार',
      'Main Road, Kishore',
      'मुख्य रस्ता, किशोर',
      '200',
      '2025-01-01'
    ];

    if (format === 'excel') {
      const ws = XLSX.utils.aoa_to_sheet([headers, sampleData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'WaterConnections');
      XLSX.writeFile(wb, 'water_connections_template.xlsx');
    } else {
      const BOM = '\uFEFF';
      const csv = BOM + [headers.join(','), sampleData.join(',')].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'water_connections_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Water Connection Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download Template */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Step 1: Download Template
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Download the template and fill in water connection data
          </p>
          <div className="flex gap-2">
            <Button onClick={() => downloadTemplate('excel')} variant="outline" size="sm" className="flex-1">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Excel Template
            </Button>
            <Button onClick={() => downloadTemplate('csv')} variant="outline" size="sm" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
        </div>

        {/* Upload File */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Step 2: Upload Filled File
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Select your filled CSV or Excel file and upload
          </p>
          
          <div className="space-y-3">
            <input
              id="water-file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            
            {file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? 'Uploading...' : 'Upload Connections'}
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg font-semibold text-blue-700">Uploading connections...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={`border-2 p-6 rounded-lg ${result.failed > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {result.failed > 0 ? (
                <>
                  <XCircle className="h-6 w-6 text-orange-600" />
                  <span className="text-orange-700">Upload Completed with Errors</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-700">Upload Successful!</span>
                </>
              )}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white p-3 rounded border">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold text-green-700">
                  {result.success} connections uploaded successfully
                </span>
              </div>
              
              {result.failed > 0 && (
                <div className="flex items-center gap-3 bg-white p-3 rounded border">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-700">
                    {result.failed} connections failed
                  </span>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="mt-4 bg-white p-4 rounded border border-red-200">
                  <p className="text-base font-bold text-red-700 mb-3">Error Details:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-red-600">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <li key={index} className="ml-2">{error}</li>
                    ))}
                    {result.errors.length > 10 && (
                      <li className="ml-2 font-semibold">...and {result.errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">File Format Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Both CSV and Excel (.xlsx) formats are supported</li>
            <li>Connection number must be unique (e.g., WC/2025/001)</li>
            <li>House number format: घर पट्टी-123</li>
            <li>Monthly charge should be in rupees (e.g., 200)</li>
            <li>Connection date format: YYYY-MM-DD (e.g., 2025-01-01)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
