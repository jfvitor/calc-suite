"use client";

export default function SiteFooter() {
    function openManager() {
        (window as any).openCookieManager?.();
    }

    return (
        <footer className="mt-10">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400" />
            <div className="text-center text-xs text-gray-700 py-8 bg-white/80 backdrop-blur">
                <div className="space-x-2">
                    <a href="/pt/politica-privacidade" className="underline decoration-indigo-500 hover:text-indigo-700">
                        Política de Privacidade
                    </a>
                    <span>·</span>
                    <a href="/pt/politica-cookies" className="underline decoration-violet-500 hover:text-violet-700">
                        Política de Cookies
                    </a>
                    <span>·</span>
                    <button onClick={openManager} className="underline decoration-fuchsia-500 hover:text-fuchsia-700">
                        Gerir cookies
                    </button>
                </div>
                <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        Pronto para AdSense (TCF 2.2 + Consent Mode v2)
                    </span>
                </div>
            </div>
        </footer>
    );
}
