import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./configs/ReactQueryConfig.js";
import '@fortawesome/fontawesome-free/css/all.min.css';


import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <BrowserRouter>
  //     <QueryClientProvider client={queryClient}>
  //       <App />
  //     </QueryClientProvider>
  //   </BrowserRouter>
  // </StrictMode>,
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
