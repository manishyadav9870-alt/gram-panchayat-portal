# Quick Start: Marathi PDF OCR

This guide will help you quickly set up and test the Marathi PDF OCR feature.

## 🚀 Quick Installation (Windows)

### Step 1: Install Tesseract OCR

**Using PowerShell (Run as Administrator):**

```powershell
# Option 1: Using Chocolatey (Recommended)
choco install tesseract

# Option 2: Manual Download
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# During installation, select "Marathi" language data
```

### Step 2: Install GraphicsMagick

```powershell
# Using Chocolatey
choco install graphicsmagick

# Or download from: http://www.graphicsmagick.org/download.html
```

### Step 3: Install Node Dependencies

```powershell
cd GramPanchayatPortal
npm install
```

### Step 4: Verify Installation

```powershell
# Check Tesseract
tesseract --version

# Check if Marathi is available
tesseract --list-langs
# Should show "mar" in the list
```

## 📝 Testing the OCR

### Method 1: Using the Web Interface

1. **Start the development server:**
```powershell
npm run dev:win
```

2. **Open browser:** http://localhost:5000

3. **Navigate to OCR page** (add the OCRUploader component to your admin panel)

4. **Upload a Marathi PDF** and click "Extract Text" or "Parse Birth Certificate"

### Method 2: Using cURL

**Extract text from any PDF:**
```powershell
curl -X POST http://localhost:5000/api/ocr/extract `
  -F "pdf=@C:\path\to\your\marathi-document.pdf"
```

**Parse birth certificate:**
```powershell
curl -X POST http://localhost:5000/api/ocr/birth-certificate `
  -F "pdf=@C:\path\to\birth-certificate.pdf"
```

### Method 3: Using Postman

1. **Create a new POST request**
2. **URL:** `http://localhost:5000/api/ocr/extract`
3. **Body:** Select "form-data"
4. **Add field:** 
   - Key: `pdf` (change type to "File")
   - Value: Select your PDF file
5. **Send request**

## 🎯 Example Response

### Extract Text Response:
```json
{
  "success": true,
  "totalPages": 1,
  "extractedText": "महाराष्ट्र शासन\nGovernment of Maharashtra\nआरोग्य विभाग\nHealth Department\n...",
  "pages": [
    {
      "text": "महाराष्ट्र शासन...",
      "pageNumber": 1
    }
  ]
}
```

### Parse Birth Certificate Response:
```json
{
  "success": true,
  "totalPages": 1,
  "extractedText": "जन्म प्रमाणपत्र...",
  "parsedData": {
    "certificateNo": "Form 4",
    "nameOfChild": "John Doe",
    "sex": "Male",
    "dateOfBirth": "01/01/2020",
    "placeOfBirth": "Mumbai",
    "motherName": "Jane Doe",
    "fatherName": "John Doe Sr.",
    "registrationNo": "12345",
    "registrationDate": "15/01/2020"
  },
  "pages": [...]
}
```

## 🔧 Troubleshooting

### Issue: "Tesseract not found"

**Solution:**
```powershell
# Add Tesseract to PATH
$env:Path += ";C:\Program Files\Tesseract-OCR"

# Verify
tesseract --version
```

### Issue: "Language 'mar' not found"

**Solution:**
1. Download `mar.traineddata` from: https://github.com/tesseract-ocr/tessdata/blob/main/mar.traineddata
2. Copy to: `C:\Program Files\Tesseract-OCR\tessdata\`
3. Verify: `tesseract --list-langs`

### Issue: "GraphicsMagick not found"

**Solution:**
```powershell
# Install GraphicsMagick
choco install graphicsmagick

# Restart terminal and try again
```

### Issue: Poor OCR accuracy

**Solutions:**
- Ensure PDF is high quality (not a low-res scan)
- Try increasing DPI in `server/ocrProcessor.ts`:
  ```typescript
  const PDF_TO_IMAGE_CONFIG = {
    density: 600, // Increase from 300 to 600
    // ...
  };
  ```
- Use original documents instead of photocopies

## 📱 Adding OCR to Your Application

### 1. Add OCR Uploader to Admin Panel

Edit `client/src/pages/AdminDashboard.tsx`:

```typescript
import OCRUploader from "@/components/OCRUploader";

// Add to your admin tabs/sections
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="ocr">OCR Processor</TabsTrigger>
    {/* other tabs */}
  </TabsList>
  
  <TabsContent value="ocr">
    <OCRUploader />
  </TabsContent>
  
  {/* other content */}
</Tabs>
```

### 2. Auto-fill Forms with OCR Data

```typescript
// In your birth certificate form component
const handleOCRUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);
  
  const response = await fetch("/api/ocr/birth-certificate", {
    method: "POST",
    body: formData,
  });
  
  const result = await response.json();
  
  if (result.success && result.parsedData) {
    // Auto-fill form fields
    form.setValue("childName", result.parsedData.nameOfChild || "");
    form.setValue("sex", result.parsedData.sex || "");
    form.setValue("dateOfBirth", result.parsedData.dateOfBirth || "");
    form.setValue("placeOfBirth", result.parsedData.placeOfBirth || "");
    form.setValue("motherName", result.parsedData.motherName || "");
    form.setValue("fatherName", result.parsedData.fatherName || "");
  }
};
```

## 🎨 Customization

### Adjust OCR Settings

Edit `server/ocrProcessor.ts`:

```typescript
const OCR_CONFIG = {
  lang: "mar+eng",  // Languages to use
  oem: 1,           // OCR Engine Mode (1 = LSTM)
  psm: 3,           // Page Segmentation Mode (3 = Auto)
};

// For better accuracy with forms:
const OCR_CONFIG = {
  lang: "mar+eng",
  oem: 1,
  psm: 6,  // Assume uniform block of text
};
```

### Add Custom Parsing Patterns

Edit `parseBirthCertificate()` function in `server/ocrProcessor.ts`:

```typescript
const patterns = {
  // Add your custom patterns
  village: /गाव\s*[:\/]?\s*([^\n]+)/i,
  taluka: /तालुका\s*[:\/]?\s*([^\n]+)/i,
  district: /जिल्हा\s*[:\/]?\s*([^\n]+)/i,
  // ... existing patterns
};
```

## 📚 Next Steps

1. ✅ Install Tesseract and dependencies
2. ✅ Test OCR with sample PDFs
3. ✅ Integrate OCR uploader in your UI
4. ✅ Customize parsing patterns for your needs
5. ✅ Add error handling and validation
6. ✅ Deploy to production

## 🆘 Need Help?

- **Full Documentation:** See `TESSERACT_OCR_SETUP.md`
- **Tesseract Docs:** https://tesseract-ocr.github.io/
- **Issues:** Check server logs for detailed error messages

## 📊 Performance Tips

1. **Process PDFs asynchronously** - Don't block the UI
2. **Show progress indicators** - OCR can take 5-30 seconds per page
3. **Cache results** - Store extracted text to avoid re-processing
4. **Limit file size** - Keep uploads under 10MB
5. **Validate results** - Always let users review and edit OCR output

---

**Happy OCR Processing! 🎉**
