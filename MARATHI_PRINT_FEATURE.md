# Marathi Print Feature for Complaint System

## Overview
This feature enables automatic English-to-Marathi translation for complaint forms with bilingual print support.

## Features

### 1. **Automatic Language Detection**
- Detects if user types in English or Marathi
- Uses Unicode range detection for Marathi script (U+0900 to U+097F)

### 2. **Smart Translation Logic**
- **English Input**: Automatically transliterates to Marathi using Google Input Tools API
- **Marathi Input**: Stores directly as Marathi text
- **Database Storage**: 
  - English text stored in original fields (`name`, `address`, `description`)
  - Marathi text stored in dedicated fields (`name_mr`, `address_mr`, `description_mr`)

### 3. **Print Functionality**
- **Print Button**: Replaced PDF download with print button
- **Marathi Display**: Print preview shows Marathi text if available
- **Bilingual Format**: Both English and Marathi labels displayed
- **Auto-Print**: Opens print dialog automatically when clicked

### 4. **Category Translation**
Predefined category translations:
- Water Supply → पाणी पुरवठा
- Electricity → वीज
- Roads → रस्ते
- Drainage → गटार
- Other → इतर

## Database Schema Changes

### New Fields Added to `complaints` Table:
```sql
name_mr TEXT          -- Name in Marathi
address_mr TEXT       -- Address in Marathi
category_mr TEXT      -- Category in Marathi
description_mr TEXT   -- Description in Marathi
```

## Usage

### For Users:
1. Fill out the complaint form in English or Marathi
2. Submit the form
3. Click "Print Receipt" button (पावती प्रिंट करा)
4. Print dialog opens with Marathi text displayed
5. Print or save as PDF from browser

### For Developers:

#### Running Migration:
```bash
# Apply the migration to add Marathi fields
psql -d your_database -f migrations/0001_add_marathi_fields_to_complaints.sql
```

Or using Drizzle:
```bash
npm run db:push
```

#### Translation Function:
```typescript
import { transliterateToMarathi } from '@/lib/transliterate';

// Transliterate English to Marathi
const marathiText = await transliterateToMarathi('Manish Yadav');
// Returns: मनीष यादव
```

#### Print Function:
```typescript
import { printComplaintReceipt } from '@/utils/pdfGenerator';

printComplaintReceipt({
  trackingNumber: 'CMP12345678',
  name: 'John Doe',
  nameMr: 'जॉन डो',
  contact: '9876543210',
  address: 'Mumbai',
  addressMr: 'मुंबई',
  category: 'water',
  categoryMr: 'पाणी पुरवठा',
  description: 'Water supply issue',
  descriptionMr: 'पाणी पुरवठा समस्या'
});
```

## Technical Implementation

### 1. Language Detection
```typescript
const isMarathiText = (text: string): boolean => {
  const marathiPattern = /[\u0900-\u097F]/;
  return marathiPattern.test(text);
};
```

### 2. Translation Service
- Uses Google Input Tools API for transliteration
- Fallback to simple mapping for common words
- Handles network errors gracefully

### 3. Print Preview
- Opens new window with formatted HTML
- Uses Devanagari-compatible fonts
- Responsive print layout
- Auto-triggers print dialog

## Benefits

1. **User-Friendly**: Users can type in their preferred language
2. **Accessibility**: Marathi speakers can read receipts in their language
3. **Data Integrity**: Original English text preserved for administrative use
4. **Print-Ready**: Professional bilingual print format
5. **No PDF Library Required**: Uses browser's native print functionality

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Print to PDF supported

## Future Enhancements

1. Add more regional languages (Hindi, Gujarati, etc.)
2. Voice input for Marathi
3. OCR for handwritten Marathi text
4. SMS notifications in Marathi
5. Email templates in Marathi

## Troubleshooting

### Translation Not Working
- Check internet connection (Google API required)
- Verify API is not rate-limited
- Check browser console for errors

### Print Preview Not Opening
- Ensure popups are allowed in browser
- Check browser security settings
- Try different browser

### Marathi Text Not Displaying
- Install Devanagari fonts on system
- Use modern browser with Unicode support
- Check font-family in CSS includes Devanagari fonts

## API Reference

### `transliterateToMarathi(text: string): Promise<string>`
Transliterates English text to Marathi script.

**Parameters:**
- `text`: English text to transliterate

**Returns:** Promise resolving to Marathi text

**Example:**
```typescript
const marathi = await transliterateToMarathi('Kishore Gram Panchayat');
// Returns: किशोर ग्राम पंचायत
```

### `printComplaintReceipt(data: ComplaintData): void`
Opens print dialog with bilingual complaint receipt.

**Parameters:**
- `data`: Complaint data including English and Marathi fields

**Returns:** void (opens print window)

## License
Part of Gram Panchayat Portal - All rights reserved
