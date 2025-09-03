import React from 'react';
import { Leaf, Flame, Beef } from 'lucide-react';
import { MenuItem } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface DietaryIconsProps {
  item: MenuItem;
  showLabels?: boolean;
}

const DietaryIcons: React.FC<DietaryIconsProps> = ({ item, showLabels = false }) => {
  const { t } = useLanguage();

  const icons = [];

  if (item.dietaryInfo.vegan) {
    icons.push({
      icon: <Leaf className="w-4 h-4" />,
      label: t('vegan', { en: 'Vegan', de: 'Vegan' }),
      color: 'text-green-600 bg-green-100'
    });
  } else if (item.dietaryInfo.vegetarian) {
    icons.push({
      icon: <Leaf className="w-4 h-4" />,
      label: t('vegetarian', { en: 'Vegetarian', de: 'Vegetarisch' }),
      color: 'text-green-600 bg-green-100'
    });
  }

  if (item.dietaryInfo.meatType) {
    icons.push({
      icon: <Beef className="w-4 h-4" />,
      label: t(item.dietaryInfo.meatType, { 
        en: item.dietaryInfo.meatType.charAt(0).toUpperCase() + item.dietaryInfo.meatType.slice(1),
        de: item.dietaryInfo.meatType === 'beef' ? 'Rind' : 
            item.dietaryInfo.meatType === 'chicken' ? 'Huhn' : 'Schwein'
      }),
      color: 'text-red-600 bg-red-100'
    });
  }

  if (item.dietaryInfo.spiceLevel > 0) {
    icons.push({
      icon: <Flame className="w-4 h-4" />,
      label: `${t('spicy', { en: 'Spicy', de: 'Scharf' })} (${item.dietaryInfo.spiceLevel}/3)`,
      color: 'text-orange-600 bg-orange-100'
    });
  }

  if (icons.length === 0) return null;

  return (
    <div className={`flex ${showLabels ? 'flex-col space-y-2' : 'space-x-2'}`}>
      {icons.map((iconData, index) => (
        <div
          key={index}
          className={`flex items-center ${showLabels ? 'justify-start' : 'justify-center'} ${
            showLabels ? 'p-2 rounded-lg' : 'p-1 rounded-full'
          } ${iconData.color}`}
        >
          {iconData.icon}
          {showLabels && (
            <span className="ml-2 text-sm font-medium">{iconData.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DietaryIcons;