"use client";

import { useEffect } from "react";

/**
 * Carrega UM CMP certificado:
 * - Usercentrics (TCF 2.2) via NEXT_PUBLIC_USERCENTRICS_ID
 * - OU Cookiebot via NEXT_PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID
 *
 * Também expõe window.openCookieManager() para reabrir o gestor via rodapé.
 */
export default function CMP() {
  useEffect(() => {
    (window as any).openCookieManager = () => {
      // Usercentrics
      if ((window as any).UC_UI?.showSecondLayer) {
        try {
          (window as any).UC_UI.showSecondLayer();
          return;
        } catch {}
      }
      // Cookiebot
      if ((window as any).Cookiebot?.renew) {
        try {
          (window as any).Cookiebot.renew();
          return;
        } catch {}
      }
      alert("Gestor de cookies indisponível no momento.");
    };
  }, []);

  const ucId = process.env.NEXT_PUBLIC_USERCENTRICS_ID;
  const cbId = process.env.NEXT_PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID;

  return (
    <>
      {ucId ? (
        <script
          id="usercentrics-cmp"
          async
          data-settings-id={ucId}
          src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        />
      ) : cbId ? (
        <script
          id="cookiebot"
          async
          data-cbid={cbId}
          data-blockingmode="auto"
          src="https://consent.cookiebot.com/uc.js"
        />
      ) : null}
    </>
  );
}
