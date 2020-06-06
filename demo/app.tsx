import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Components from './components';
import Student from './student';

const App: React.FC = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  }

  return (
    <div>
      <Tabs value={tabIndex} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Components demo" />
        <Tab label="Student process demo" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <Components />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Student />
      </TabPanel>
    </div>
  );
};

export default App;
