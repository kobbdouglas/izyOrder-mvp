import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageToggleProps {
  variant?: 'light' | 'dark';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center space-x-2 rounded-full p-1 ${
      isDark ? 'bg-white bg-opacity-20' : 'bg-gray-100'
    }`}>
      <Globe className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === 'en'
            ? isDark ? 'bg-white text-gray-900' : 'bg-orange-500 text-white'
            : isDark ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('de')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === 'de'
            ? isDark ? 'bg-white text-gray-900' : 'bg-orange-500 text-white'
            : isDark ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        DE
      </button>
    </div>
  );
};

export default LanguageToggle;