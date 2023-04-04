import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { Globalstyle } from "./styles/global";

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <h1>Hello, Wolrd!</h1>

      <Globalstyle />
    </ThemeProvider>
      
  );
}

export default App;
