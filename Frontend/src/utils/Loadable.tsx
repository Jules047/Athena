import React, { lazy, Suspense, useState, useEffect } from 'react';
import Loader from './Loader';

const Loadable = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Affiche l'image pendant 1 seconde

      return () => clearTimeout(timer);
    }, []);

    return (
      <Suspense fallback={null}>
        {showLoader ? <Loader /> : <LazyComponent {...props} />}
      </Suspense>
    );
  };
};

export default Loadable;
