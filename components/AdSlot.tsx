'use client';
import { useEffect } from 'react';
/**
 * AdSlot — reserva altura para evitar CLS e injeta script do AdSense quando presente.
 * Coloque seu data-ad-client / data-ad-slot conforme sua conta.
 */
export default function AdSlot({ className = '' }: { className?: string }) {
  useEffect(() => {
    // Se já houver script do adsbygoogle, pede novo push
    // @ts-ignore
    window.adsbygoogle = window.adsbygoogle || [];
    try {
      // @ts-ignore
      window.adsbygoogle.push({});
    } catch {}
  }, []);
  return (
    <div className={`ad-reserved ${className}`}>
      {/* Substitua pelo seu bloco oficial do AdSense quando for aprovado */}
      <ins className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '280px', background: 'transparent' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle=window.adsbygoogle||[]).push({});` }} />
    </div>
  );
}
