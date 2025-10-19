import { useState } from 'react';
import { Button } from './button';
import { translateToMarathi } from '@/utils/translationUtils';

interface TranslateButtonProps {
  englishText: string;
  onTranslated: (marathiText: string) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
}

export function TranslateButton({ 
  englishText, 
  onTranslated, 
  size = 'sm', 
  variant = 'outline',
  disabled = false 
}: TranslateButtonProps) {
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!englishText.trim()) return;
    
    setTranslating(true);
    try {
      const marathiText = await translateToMarathi(englishText);
      onTranslated(marathiText);
    } catch (error) {
      alert('Translation failed. Please enter Marathi text manually.');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant={variant} 
      size={size}
      disabled={translating || disabled || !englishText.trim()}
      onClick={handleTranslate}
    >
      {translating ? 'Translating...' : 'Translate to Marathi'}
    </Button>
  );
}
