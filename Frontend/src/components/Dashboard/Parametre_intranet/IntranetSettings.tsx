import React, { useState } from 'react';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import CollaboratorPanel from './CollaboratorPage';
import TaskPanel from './AtelierPage';

const IntranetSettings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);

  const handleSubTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveSubTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeSubTab} onChange={handleSubTabChange} aria-label="sub tabs">
        <Tab label="Collaborateur" />
        <Tab label="Atelier" />
      </Tabs>
      <TabPanel value={activeSubTab} index={0}>
        <CollaboratorPanel />
      </TabPanel>
      <TabPanel value={activeSubTab} index={1}>
        <TaskPanel />
      </TabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default IntranetSettings;
