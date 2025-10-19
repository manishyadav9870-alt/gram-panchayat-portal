// Translation utility functions
export const translateToMarathi = async (englishText: string): Promise<string> => {
  if (!englishText.trim()) return '';
  
  try {
    // Break text into smaller chunks (50 characters each) for better translation
    const sentences = englishText.split(/[.!?]+/).filter(s => s.trim());
    let translatedText = '';
    
    for (const sentence of sentences) {
      if (sentence.trim()) {
        // Further break long sentences into smaller chunks
        const chunks = sentence.match(/.{1,50}(\s|$)/g) || [sentence];
        
        for (const chunk of chunks) {
          const trimmedChunk = chunk.trim();
          if (trimmedChunk) {
            try {
              const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(trimmedChunk)}&itc=mr-t-i0-und&num=1`);
              const data = await response.json();
              if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                translatedText += data[1][0][1][0] + ' ';
              } else {
                translatedText += trimmedChunk + ' ';
              }
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (chunkError) {
              console.error('Chunk translation failed:', chunkError);
              translatedText += trimmedChunk + ' ';
            }
          }
        }
        translatedText += '। '; // Add Marathi sentence ending
      }
    }
    
    return translatedText.trim();
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error('Translation failed. Please enter Marathi text manually.');
  }
};

export const transliterateToMarathi = async (englishText: string): Promise<string> => {
  if (!englishText.trim()) return '';
  
  try {
    const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(englishText)}&itc=mr-t-i0-und&num=1`);
    const data = await response.json();
    if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
      return data[1][0][1][0];
    }
    return englishText; // Return original if transliteration fails
  } catch (error) {
    console.error('Transliteration failed:', error);
    return englishText; // Return original if transliteration fails
  }
};
