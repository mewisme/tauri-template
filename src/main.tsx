import './App.css'

import App from "./App";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/providers/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>
);
