import { OptionsProvider } from "./context/optionsContext";
import Router from "./router";

function App() {
  return <OptionsProvider><Router /></OptionsProvider>;
}

export default App;