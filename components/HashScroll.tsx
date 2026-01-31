import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HashScroll: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(decodeURIComponent(location.hash));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
};

export default HashScroll;
