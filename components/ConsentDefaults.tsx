"use client";

import { useEffect } from "react";

/**
 * Define o Google Consent Mode v2 como DENIED por padrão.
 * O CMP fará o update para granted/denied após a escolha do usuário.
 */
export function ConsentDefaults() {
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag() {
      (window as any).dataLayer.push(arguments as any);
    }
    // @ts-ignore
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
  }, []);

  return null;
}
