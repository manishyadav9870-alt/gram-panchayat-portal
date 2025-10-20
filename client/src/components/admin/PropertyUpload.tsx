import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';

export default function PropertyUpload() {
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
      const response = await fetch('/api/admin/properties/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      console.log('Upload response:', result);
      
      if (response.ok) {
        setResult(result);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        console.error('Upload failed:', result);
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template with UTF-8 BOM for proper encoding
    const headers = [
      'property_number',
      'owner_name',
      'owner_name_mr',
      'address',
      'address_mr',
      'area_sqft',
      'annual_tax',
      'registration_year'
    ];
    
    const sampleData = [
      'GP/2025/004',
      'John Doe',
      'जॉन डो',
      'Main Street Kishore',
      'मुख्य रस्ता किशोर',
      '1200',
      '6000',
      '2025'
    ];

    // Add UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const csv = BOM + [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_tax_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Property Upload
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
            Download the CSV template and fill in your property data
          </p>
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        {/* Upload File */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Step 2: Upload Filled CSV
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Select your filled CSV file and upload
          </p>
          
          <div className="space-y-3">
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
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
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {uploading ? 'Uploading...' : 'Upload Properties'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Upload Results</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{result.success} properties uploaded successfully</span>
              </div>
              
              {result.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-semibold">{result.failed} properties failed</span>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-red-600 mb-2">Errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.errors.length > 10 && (
                      <li>...and {result.errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">CSV Format Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Use comma (,) as separator</li>
            <li>First row should be headers</li>
            <li>Property number must be unique (e.g., GP/2025/004)</li>
            <li>Area should be in square feet (numbers only)</li>
            <li>Annual tax should be in rupees (numbers only)</li>
            <li>Registration year should be 4-digit year (e.g., 2025)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
