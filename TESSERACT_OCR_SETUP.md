# Tesseract OCR Setup Guide for Marathi PDF Processing

This guide will help you set up Tesseract OCR with Marathi language support for the Gram Panchayat Portal.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Windows/Linux/macOS operating system

## Installation Steps

### 1. Install Tesseract OCR Engine

#### Windows

**Option A: Using Chocolatey (Recommended)**
```powershell
choco install tesseract
```

**Option B: Manual Installation**
1. Download Tesseract installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (e.g., `tesseract-ocr-w64-setup-5.3.3.20231005.exe`)
3. During installation, make sure to select **"Additional language data"** and check **Marathi (mar)**
4. Add Tesseract to PATH:
   - Right-click "This PC" → Properties → Advanced System Settings
   - Click "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Add: `C:\Program Files\Tesseract-OCR`
   - Click OK

5. Verify installation:
```powershell
tesseract --version
```

#### Linux (Ubuntu/Debian)

```bash
# Install Tesseract
sudo apt update
sudo apt install tesseract-ocr

# Install Marathi language data
sudo apt install tesseract-ocr-mar

# Verify installation
tesseract --version
tesseract --list-langs
```

#### macOS

```bash
# Using Homebrew
brew install tesseract
brew install tesseract-lang

# Verify installation
tesseract --version
tesseract --list-langs
```

### 2. Download Marathi Language Data (If Not Included)

If Marathi language data is not included in your installation:

1. Download Marathi trained data file:
   - Visit: https://github.com/tesseract-ocr/tessdata
   - Download: `mar.traineddata`

2. Copy to Tesseract tessdata directory:

**Windows:**
```powershell
# Copy to: C:\Program Files\Tesseract-OCR\tessdata\
Copy-Item mar.traineddata "C:\Program Files\Tesseract-OCR\tessdata\"
```

**Linux/macOS:**
```bash
# Find tessdata directory
tesseract --version  # Look for "tessdata" path

# Copy file (example path)
sudo cp mar.traineddata /usr/share/tesseract-ocr/5/tessdata/
```

### 3. Install Node.js Dependencies

```bash
# Navigate to project directory
cd GramPanchayatPortal

# Install dependencies
npm install

# Or if using yarn
yarn install
```

### 4. Install Additional System Dependencies

#### Windows
```powershell
# Install GraphicsMagick (required for pdf2pic)
choco install graphicsmagick

# Or download from: http://www.graphicsmagick.org/download.html
```

#### Linux (Ubuntu/Debian)
```bash
# Install GraphicsMagick
sudo apt install graphicsmagick

# Install Ghostscript (for PDF processing)
sudo apt install ghostscript
```

#### macOS
```bash
# Install GraphicsMagick
brew install graphicsmagick

# Install Ghostscript
brew install ghostscript
```

## Verify Installation

### Test Tesseract with Marathi

Create a test file `test-ocr.js`:

```javascript
import tesseract from "node-tesseract-ocr";

const config = {
  lang: "mar+eng",
  oem: 1,
  psm: 3,
};

// Test with a sample image
tesseract
  .recognize("path/to/marathi-image.png", config)
  .then((text) => {
    console.log("Extracted Text:");
    console.log(text);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

Run the test:
```bash
node test-ocr.js
```

## Configuration

### Environment Variables (Optional)

Create or update `.env` file:

```env
# Tesseract Configuration
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
TESSDATA_PREFIX=C:\Program Files\Tesseract-OCR\tessdata

# OCR Settings
OCR_LANGUAGE=mar+eng
OCR_DPI=300
MAX_PDF_SIZE_MB=10
```

## API Usage

### Extract Text from PDF

**Endpoint:** `POST /api/ocr/extract`

**Request:**
```bash
curl -X POST http://localhost:5000/api/ocr/extract \
  -F "pdf=@/path/to/marathi-document.pdf"
```

**Response:**
```json
{
  "success": true,
  "totalPages": 1,
  "extractedText": "महाराष्ट्र शासन\nGovernment of Maharashtra\n...",
  "pages": [
    {
      "text": "महाराष्ट्र शासन...",
      "pageNumber": 1
    }
  ]
}
```

### Extract and Parse Birth Certificate

**Endpoint:** `POST /api/ocr/birth-certificate`

**Request:**
```bash
curl -X POST http://localhost:5000/api/ocr/birth-certificate \
  -F "pdf=@/path/to/birth-certificate.pdf"
```

**Response:**
```json
{
  "success": true,
  "totalPages": 1,
  "extractedText": "जन्म प्रमाणपत्र / BIRTH CERTIFICATE...",
  "parsedData": {
    "certificateNo": "Form 4",
    "nameOfChild": "John Doe",
    "sex": "Male",
    "dateOfBirth": "01/01/2020",
    "placeOfBirth": "Mumbai",
    "motherName": "Jane Doe",
    "fatherName": "John Doe Sr.",
    "registrationNo": "12345"
  },
  "pages": [...]
}
```

## Frontend Integration Example

```typescript
// Upload and extract text from PDF
async function extractTextFromPDF(file: File) {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/api/ocr/extract', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Extracted Text:', result.extractedText);
    console.log('Total Pages:', result.totalPages);
  } else {
    console.error('Error:', result.error);
  }
}

// Parse birth certificate
async function parseBirthCertificate(file: File) {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/api/ocr/birth-certificate', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Parsed Data:', result.parsedData);
    // Auto-fill form with parsed data
    fillFormWithData(result.parsedData);
  }
}
```

## Troubleshooting

### Common Issues

#### 1. "Tesseract not found" Error

**Solution:**
- Verify Tesseract is installed: `tesseract --version`
- Check PATH environment variable includes Tesseract directory
- Restart terminal/IDE after installation

#### 2. "Language 'mar' not found" Error

**Solution:**
- Verify Marathi language data is installed: `tesseract --list-langs`
- Download and install `mar.traineddata` manually (see step 2 above)

#### 3. Poor OCR Accuracy

**Solutions:**
- Increase PDF to image DPI (300-600 recommended)
- Ensure PDF quality is good (not scanned at low resolution)
- Pre-process images (deskew, denoise, enhance contrast)
- Use `mar+eng` for mixed Marathi-English documents

#### 4. "GraphicsMagick/Ghostscript not found" Error

**Solution:**
- Install GraphicsMagick and Ghostscript (see step 4)
- Restart terminal after installation

#### 5. Memory Issues with Large PDFs

**Solutions:**
- Process PDFs page by page
- Reduce image DPI
- Increase Node.js memory limit: `node --max-old-space-size=4096 server/index.ts`

### Performance Optimization

1. **Batch Processing:** Process multiple pages in parallel
2. **Caching:** Cache OCR results for frequently accessed documents
3. **Image Preprocessing:** Optimize images before OCR
4. **Language Selection:** Use only required languages (`mar` or `mar+eng`)

## Advanced Configuration

### Custom OCR Settings

Edit `server/ocrProcessor.ts`:

```typescript
const OCR_CONFIG = {
  lang: "mar+eng",
  oem: 1,        // LSTM engine (best accuracy)
  psm: 3,        // Fully automatic page segmentation
  // Additional options:
  // psm: 6,     // Assume a single uniform block of text
  // psm: 11,    // Sparse text. Find as much text as possible
};
```

### Page Segmentation Modes (PSM)

- `0` = Orientation and script detection (OSD) only
- `1` = Automatic page segmentation with OSD
- `3` = Fully automatic page segmentation (default)
- `6` = Assume a single uniform block of text
- `11` = Sparse text. Find as much text as possible

### OCR Engine Modes (OEM)

- `0` = Legacy engine only
- `1` = Neural nets LSTM engine only (recommended)
- `2` = Legacy + LSTM engines
- `3` = Default, based on what is available

## Resources

- **Tesseract Documentation:** https://tesseract-ocr.github.io/
- **Tesseract GitHub:** https://github.com/tesseract-ocr/tesseract
- **Language Data:** https://github.com/tesseract-ocr/tessdata
- **Node Tesseract OCR:** https://www.npmjs.com/package/node-tesseract-ocr
- **PDF2Pic:** https://www.npmjs.com/package/pdf2pic

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all dependencies are correctly installed
3. Check Tesseract and language data versions
4. Review server logs for detailed error messages

## License

This implementation uses:
- Tesseract OCR (Apache License 2.0)
- node-tesseract-ocr (MIT License)
- pdf2pic (MIT License)
