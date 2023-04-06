import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { Globalstyle } from "./styles/global";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <Globalstyle />
    </ThemeProvider>
      
  );
}

export default App;
