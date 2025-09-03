import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://suitecalculo.com";
    return [
        { url: `${base}/pt`, priority: 1 },
        { url: `${base}/pt/idade-pets`, priority: 0.9 },
        { url: `${base}/pt/imc`, priority: 0.9 },
        { url: `${base}/pt/gravidez`, priority: 0.9 },
        { url: `${base}/en`, priority: 0.8 },
        { url: `${base}/en/pet-age` }, { url: `${base}/en/bmi` }, { url: `${base}/en/pregnancy` },
        { url: `${base}/pt/politica-privacidade` }, { url: `${base}/pt/politica-cookies` },
    ];
}