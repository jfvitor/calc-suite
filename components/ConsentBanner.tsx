'use client';
import { useEffect, useState } from 'react';
export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ok = localStorage.getItem('consent-ok');
    if (!ok) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="max-w-6xl mx-auto m-4 p-4 bg-white border rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
        <div>
          Usamos cookies para analisar tráfego e personalizar anúncios. Ao continuar, você concorda com nossa política.
        </div>
        <div className="flex gap-2">
          <a href="#" className="underline">Política de Privacidade</a>
          <button onClick={() => { localStorage.setItem('consent-ok','1'); setShow(false); }} className="px-3 py-2 bg-gray-900 text-white rounded-lg">Aceitar</button>
        </div>
      </div>
    </div>
  );
}
