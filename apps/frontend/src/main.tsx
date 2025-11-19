import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserDataProvider } from "./context/UserDataContext";

createRoot(document.getElementById("root")!).render(
  <UserDataProvider>
    <App />
  </UserDataProvider>
);
//createRoot(document.getElementById("root")!).render(<App />);
