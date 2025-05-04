import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type DataTabsProps = {
    ItemOne: React.JSX.Element;
    ItemTwo: React.JSX.Element;
    ItemThree: React.JSX.Element;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DataTabs(props : DataTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Graph Visualization" {...a11yProps(0)} />
          <Tab label="Records" {...a11yProps(1)} />
          <Tab label="Statistics" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {props.ItemOne}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {props.ItemTwo}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {props.ItemThree}
      </CustomTabPanel>
    </Box>
  );
}
