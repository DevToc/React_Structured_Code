import { useState, useEffect } from 'react';
import { IconPackData } from './IconView.types';
import { MOCK_ICON_PACK_DATA } from './iconPackData';

export const useIconPackLoader = () => {
  const [iconPackData, setIconPackData] = useState<IconPackData[]>([]);

  // load icon data
  useEffect(() => {
    // TODO fetch icon pack data
    setIconPackData(MOCK_ICON_PACK_DATA.sort((a, b) => a.order - b.order));
  }, []);

  return {
    iconPackData,
  };
};
