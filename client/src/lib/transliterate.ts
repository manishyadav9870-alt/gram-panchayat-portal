// Use Google Input Tools API for accurate transliteration
export async function transliterateToMarathi(text: string): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  try {
    const response = await fetch('https://inputtools.google.com/request?text=' + encodeURIComponent(text) + '&itc=mr-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage');
    const data = await response.json();
    
    if (data && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
      return data[1][0][1][0];
    }
    
    return text;
  } catch (error) {
    console.error('Transliteration error:', error);
    // Fallback to simple transliteration
    return simpleFallbackTransliterate(text);
  }
}

// Fallback transliteration for offline/error cases
function simpleFallbackTransliterate(text: string): string {
  // Common word mappings for better accuracy
  const commonWords: { [key: string]: string } = {
    // Names
    'manish': 'मनीष',
    'manisha': 'मनीषा',
    'ramesh': 'रमेश',
    'suresh': 'सुरेश',
    'rajesh': 'राजेश',
    'amit': 'अमित',
    'rahul': 'राहुल',
    'priya': 'प्रिया',
    'anjali': 'अंजली',
    'yadav': 'यादव',
    'sharma': 'शर्मा',
    'kumar': 'कुमार',
    'singh': 'सिंह',
    'patel': 'पटेल',
    'desai': 'देसाई',
    
    // Places
    'mumbai': 'मुंबई',
    'pune': 'पुणे',
    'delhi': 'दिल्ली',
    'bangalore': 'बेंगलुरु',
    'kolkata': 'कोलकाता',
    'chennai': 'चेन्नई',
    'hyderabad': 'हैदराबाद',
    'ahmedabad': 'अहमदाबाद',
    'nagpur': 'नागपूर',
    'nashik': 'नाशिक',
    'thane': 'ठाणे',
    
    // Common words
    'hospital': 'हॉस्पिटल',
    'road': 'रोड',
    'street': 'स्ट्रीट',
    'nagar': 'नगर',
    'colony': 'कॉलनी',
    'society': 'सोसायटी',
  };
  
  const words = text.toLowerCase().split(' ');
  const transliteratedWords = words.map(word => {
    // Check if word exists in common mappings
    if (commonWords[word]) {
      return commonWords[word];
    }
    
    // Otherwise return as is (user can manually edit if needed)
    return word;
  });
  
  return transliteratedWords.join(' ');
}
