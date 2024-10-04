import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  return (
    <DataContext.Provider value={{ loading, setLoading }}>
      {children}
    </DataContext.Provider>
  );
};
