import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const normalizeSpaRedirectUrl = () => {
  const { search, hash } = window.location;

  if (!search.startsWith("?/")) {
    return;
  }

  const parts = search.slice(1).split("&");
  const path = parts[0].replace(/~and~/g, "&");
  const query = parts.slice(1).join("&").replace(/~and~/g, "&");
  const newUrl = `${path}${query ? `?${query}` : ""}${hash || ""}`;

  window.history.replaceState(null, "", newUrl);
};

normalizeSpaRedirectUrl();

createRoot(document.getElementById("root")!).render(<App />);
