"use client";

import React, { createContext, useContext, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";

// ---------- utils ----------
function toNumberLocale(str: string): number {
    // aceita "1,75" e "1.75"
    if (!str) return NaN;
    const s = str.replace(/\s+/g, "").replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
}
function parseHeightFlexible(input: string): number {
    // Permite altura em metros (1,75) OU centímetros (175)
    const n = toNumberLocale(input);
    if (!Number.isFinite(n)) return NaN;
    return n > 3 ? n / 100 : n; // >3 assume cm
}
function round1(n: number) {
    return Math.round(n * 10) / 10;
}
function calcIMC(pesoKg: number, alturaM: number): number {
    if (!(pesoKg > 0) || !(alturaM > 0)) return NaN;
    return pesoKg / (alturaM * alturaM);
}
function classificacaoIMC(imc: number): string {
    if (!Number.isFinite(imc) || imc <= 0) return "—";
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade I";
    if (imc < 40) return "Obesidade II";
    return "Obesidade III";
}
function faixaPesoSaudavel(alturaM: number) {
    if (!(alturaM > 0)) return { min: NaN, max: NaN };
    const min = 18.5 * alturaM * alturaM;
    const max = 24.9 * alturaM * alturaM;
    return { min, max };
}

// ---------- context ----------
function useImcCalcState() {
    const [peso, setPeso] = useState<string>("");
    const [altura, setAltura] = useState<string>("");
    const [showResult, setShowResult] = useState<boolean>(false);

    const pesoNum = toNumberLocale(peso);
    const alturaM = parseHeightFlexible(altura);
    const imc = calcIMC(pesoNum, alturaM);
    const classificacao = classificacaoIMC(imc);
    const faixa = faixaPesoSaudavel(alturaM);

    return {
        state: { peso, altura, showResult },
        setters: { setPeso, setAltura, setShowResult },
        derived: { imc, classificacao, faixa },
    } as const;
}

const ImcCalcCtx = createContext<ReturnType<typeof useImcCalcState> | null>(null);
function ImcCalcProvider({ children }: { children: React.ReactNode }) {
    const value = useImcCalcState();
    return <ImcCalcCtx.Provider value={value}>{children}</ImcCalcCtx.Provider>;
}
function useImcCalc() {
    const ctx = useContext(ImcCalcCtx);
    if (!ctx) throw new Error("ImcCalcCtx não encontrado");
    return ctx;
}

// ---------- exported component ----------
export default function ImcCalculator({ faq }: { faq: readonly { q: string; a: string }[] }) {
    return (
        <ImcCalcProvider>
            <CalculatorShell
                title="Calculadora de IMC"
                subtitle="Informe seu peso e altura (em m ou cm) para calcular o Índice de Massa Corporal."
                heroEmoji="⚖️"
                form={<Form />}
                result={<Result />}
                faq={<FaqToggle items={faq} />}
                compact // layout sem ads enquanto não houver AdSense
            />
        </ImcCalcProvider>
    );
}

// ---------- UI ----------
function Form() {
    const {
        state: { peso, altura },
        setters: { setPeso, setAltura, setShowResult },
    } = useImcCalc();

    function handleClear() {
        setPeso("");
        setAltura("");
        setShowResult(false);
    }
    function handleCalc() {
        setShowResult(true);
    }

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <label className="text-sm">
                <span className="block mb-1">Peso (kg)</span>
                <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9.,]*"
                    className="w-full border rounded-lg p-2"
                    value={peso}
                    onChange={(e) => {
                        setPeso(e.target.value);
                        setShowResult(false);
                    }}
                    placeholder="Ex.: 70,5"
                    aria-label="Peso em quilogramas"
                />
            </label>

            <label className="text-sm">
                <span className="block mb-1">Altura (m ou cm)</span>
                <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9.,]*"
                    className="w-full border rounded-lg p-2"
                    value={altura}
                    onChange={(e) => {
                        setAltura(e.target.value);
                        setShowResult(false);
                    }}
                    placeholder="Ex.: 1,75 ou 175"
                    aria-label="Altura em metros ou centímetros"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Dica: pode digitar em <b>metros</b> (1,75) ou <b>centímetros</b> (175).
                </p>
            </label>

            <div className="col-span-2 flex gap-4 mt-2">
                <button
                    type="button"
                    onClick={handleCalc}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Calcular
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                    Limpar
                </button>
            </div>
        </form>
    );
}

function Result() {
    const {
        state: { peso, altura, showResult },
        derived: { classificacao, faixa },
    } = useImcCalc();

    if (!showResult) {
        return <div className="text-sm text-gray-600">Preencha os campos e clique em <b>Calcular</b>.</div>;
    }

    const pesoNum = toNumberLocale(peso);
    const alturaM = parseHeightFlexible(altura);
    if (!(pesoNum > 0) || !(alturaM > 0)) {
        return <div className="text-sm text-red-600">Informe <b>peso</b> e <b>altura</b> válidos.</div>;
    }

    const imcVal = calcIMC(pesoNum, alturaM);

    let dica = "";
    if (imcVal < 18.5 && Number.isFinite(faixa.min)) {
        dica = `Para atingir IMC 18,5, peso alvo ≈ ${round1(faixa.min)} kg.`;
    } else if (imcVal > 24.9 && Number.isFinite(faixa.max)) {
        dica = `Para ficar em 24,9, peso alvo ≈ ${round1(faixa.max)} kg.`;
    }

    return (
        <div className="space-y-2 text-sm">
            <Info title="IMC" value={Number.isFinite(imcVal) ? round1(imcVal).toString() : "—"} />
            <Info title="Classificação" value={classificacao} />
            {Number.isFinite(faixa.min) && Number.isFinite(faixa.max) && (
                <Info title="Peso recomendado" value={`${round1(faixa.min)} – ${round1(faixa.max)} kg`} />
            )}
            {!!dica && <p className="text-xs text-gray-600">{dica}</p>}
            <p className="text-xs text-gray-500 mt-3">
                O IMC é um indicador geral e tem limitações (ex.: atletas, gestantes, idosos). Use como triagem, não diagnóstico.
            </p>
        </div>
    );
}

function Info({ title, value }: { title: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2">
            <div className="text-gray-700">{title}</div>
            <div className="text-right">
                <div className="font-semibold">{value}</div>
            </div>
        </div>
    );
}

// ---------- FAQ (toggle) ----------
function FaqToggle({ items }: { items: readonly { q: string; a: string }[] }) {
    const [open, setOpen] = useState<number | null>(null);
    const allItems = [
        ...items,
        {
            q: "O cálculo do IMC é diferente para homens e mulheres?",
            a: "Não. A fórmula do IMC é a mesma para ambos os sexos: peso / altura². O que pode variar é a interpretação: homens geralmente têm mais massa muscular e mulheres mais gordura corporal, o que pode levar a pequenas diferenças na análise clínica. As faixas de referência da OMS, no entanto, são iguais para homens e mulheres adultos.",
        },
    ];
    return (
        <ul className="text-sm text-gray-700 divide-y rounded-xl border">
            {allItems.map((it, idx) => {
                const isOpen = open === idx;
                return (
                    <li key={it.q}>
                        <button
                            type="button"
                            onClick={() => setOpen(isOpen ? null : idx)}
                            className="w-full text-left flex items-center justify-between gap-3 p-3 hover:bg-gray-50"
                            aria-expanded={isOpen}
                            aria-controls={`faq-${idx}`}
                        >
                            <span className="font-medium">{it.q}</span>
                            <span aria-hidden>{isOpen ? '–' : '+'}</span>
                        </button>
                        {isOpen && (
                            <div id={`faq-${idx}`} className="p-3 pt-0 text-gray-600">
                                {it.a}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
