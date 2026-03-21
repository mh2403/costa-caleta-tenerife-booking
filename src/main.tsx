import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { restorePendingSpaRedirect } from "@/lib/spaRedirect";
import "./index.css";

restorePendingSpaRedirect({
  baseUrl: import.meta.env.BASE_URL,
  storage: window.sessionStorage,
  history: window.history,
  location: window.location,
});

createRoot(document.getElementById("root")!).render(<App />);
