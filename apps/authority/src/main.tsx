// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(<App />);
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthorityDataProvider } from "./context/AuthorityDataContext";

createRoot(document.getElementById("root")!).render(
  <AuthorityDataProvider>
    <App />
  </AuthorityDataProvider>
);
