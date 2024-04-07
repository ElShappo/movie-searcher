import { ConfigProvider, Divider, theme } from "antd";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <Header />
      <Divider className="m-0" />
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
