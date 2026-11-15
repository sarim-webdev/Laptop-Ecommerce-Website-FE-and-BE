import { useEffect, useState } from "react";

import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loaderTimer;

    const hideLoader = () => {
      loaderTimer = window.setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
    }

    return () => {
      window.removeEventListener("load", hideLoader);
      window.clearTimeout(loaderTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <Loader
        size="xl"
        text="Loading NEXORA..."
        fullScreen
      />
    );
  }

  return <AppRoutes />;
}

export default App;
