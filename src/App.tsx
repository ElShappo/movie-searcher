import { Button, ConfigProvider, theme } from "antd";
import "./App.css";

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
      <div className="App">
        <Button type="primary">Click me!</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;
