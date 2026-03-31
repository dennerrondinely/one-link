"use client";

import { useEffect, useState } from "react";

interface RedirectClientProps {
  appUrl: string;
  storeUrl: string;
}

export function RedirectClient({ appUrl, storeUrl }: RedirectClientProps) {
  const [message, setMessage] = useState("Tentando abrir o aplicativo...");

  useEffect(() => {
    const timeout = 2000;
    const start = Date.now();

    window.location.href = appUrl;

    const fallbackTimer = window.setTimeout(() => {
      if (Date.now() - start < timeout + 100) {
        setMessage("Redirecionando para a loja...");
        window.location.href = storeUrl;
      }
    }, timeout);

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
      }
    };

    const onBlur = () => {
      window.clearTimeout(fallbackTimer);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [appUrl, storeUrl]);

  return (
    <>
      <h1>Abrindo aplicativo...</h1>
      <div className="spinner" />
      <p>{message}</p>
    </>
  );
}