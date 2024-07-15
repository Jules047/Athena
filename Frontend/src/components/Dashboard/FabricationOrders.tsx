import React, { useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import { Outlet, Link, Routes, Route } from 'react-router-dom';
import OfValidatedPage from '../OfValidatedPage';
import DocumentPage from '../DocumentPage';
import ProjectPage from '../ProjectPage';

const FabricationOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      
      <Outlet />
    </Box>
  );
};

export default FabricationOrders;
