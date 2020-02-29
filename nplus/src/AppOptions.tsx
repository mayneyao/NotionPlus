import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SourceSettings from './components/source';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ maxWidth: 700 }}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100vh",
    width: 900,
    margin: "0 auto"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    height: "100%",
    display: "flex",
  }
}));

export default function Setting() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="基础配置" {...a11yProps(0)} />
        <Tab label="关于" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SourceSettings></SourceSettings>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ul>
          <li>
            <p>使用文档</p>
            <a href="https://gine.me/posts/cc5deab1a79f443c919b41ec80a50b7d">
              https://gine.me/posts/cc5deab1a79f443c919b41ec80a50b7d
            </a>
            <p>任务表格模板</p>
            <a href="https://www.notion.so/gine/c7baaf9e081749d0b72d59e4c34541bb?v=c2886c5f38d241cbbce6a30ad147ee56">
              https://www.notion.so/gine/c7baaf9e081749d0b72d59e4c34541bb?v=c2886c5f38d241cbbce6a30ad147ee56
            </a>
          </li>
          <li>
            <p>这是一个开源项目，你可以在这里找到源码</p>
            <a href="https://github.com/mayneyao/NotionPlus">
              https://github.com/mayneyao/NotionPlus
            </a>
          </li>
        </ul>
      </TabPanel>
    </div>
  );
}
