"use client";

import React, { createContext, useContext, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";

type Species = "dog" | "cat";
type SizeKey = "small" | "medium" | "large";

// ---------- utils ----------
function yearsBetween(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  const diff = now.getTime() - birth.getTime();
  const years = diff / (1000 * 60 * 60 * 24 * 365.2425);
  return Math.max(0, years);
}
function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function toHumanYears(species: Species, sizeKey: SizeKey, animalYears: number): number {
  if (animalYears <= 0) return 0;

  if (species === "dog") {
    const firstYear: Record<SizeKey, number> = { small: 12.5, medium: 12.5, large: 10.5 };
    const secondYear = firstYear;
    const postRate: Record<SizeKey, number> = { small: 4.3, medium: 4.0, large: 5.7 };
    if (animalYears <= 1) return animalYears * firstYear[sizeKey];
    if (animalYears <= 2) return firstYear[sizeKey] + (animalYears - 1) * secondYear[sizeKey];
    return firstYear[sizeKey] + secondYear[sizeKey] + (animalYears - 2) * postRate[sizeKey];
  }

  if (species === "cat") {
    if (animalYears <= 1) return animalYears * 15;
    if (animalYears <= 2) return 15 + (animalYears - 1) * 9;
    return 24 + (animalYears - 2) * 4;
  }

  return animalYears * 7;
}

function lifeStage(species: Species, humanYears: number): "Filhote" | "Jovem" | "Adulto" | "Sénior" {
  const h = humanYears;
  if (species === "dog") {
    if (h < 12) return "Filhote";
    if (h < 30) return "Jovem";
    if (h < 55) return "Adulto";
    return "Sénior";
  } else {
    if (h < 15) return "Filhote";
    if (h < 28) return "Jovem";
    if (h < 48) return "Adulto";
    return "Sénior";
  }
}

// ---------- context ----------
function usePetCalcState() {
  const [species, setSpecies] = useState<Species>("dog");
  const [dob, setDob] = useState<string>("");
  const [size, setSize] = useState<SizeKey>("medium");
  const [showResult, setShowResult] = useState<boolean>(false);

  const animalYears = yearsBetween(dob);
  const humanYears = toHumanYears(species, size, animalYears);
  const stage = lifeStage(species, humanYears);

  return {
    state: { species, dob, size, showResult },
    setters: { setSpecies, setDob, setSize, setShowResult },
    derived: { animalYears, humanYears, stage },
  } as const;
}

const PetCalcCtx = createContext<ReturnType<typeof usePetCalcState> | null>(null);
function PetCalcProvider({ children }: { children: React.ReactNode }) {
  const value = usePetCalcState();
  return <PetCalcCtx.Provider value={value}>{children}</PetCalcCtx.Provider>;
}
function usePetCalc() {
  const ctx = useContext(PetCalcCtx);
  if (!ctx) throw new Error("PetCalcCtx não encontrado");
  return ctx;
}

// ---------- exported component ----------
export default function PetCalculator({ faq }: { faq: readonly { q: string; a: string }[] }) {
  return (
    <PetCalcProvider>
      <CalculatorShell
        title="Idade de Pets (Cão/Gato)"
        subtitle="Informe os dados do seu animal para estimar idade humana equivalente."
        heroEmoji="🐾"
        form={<Form />}
        result={<Result />}
        faq={<FaqToggle items={faq} />}
        compact // <-- ativa layout compacto enquanto não há anúncios
      />
    </PetCalcProvider>
  );
}

// ---------- UI ----------
function Form() {
  const {
    state: { species, dob, size },
    setters: { setSpecies, setDob, setSize, setShowResult },
  } = usePetCalc();

  function handleClear() {
    setSpecies("dog");
    setDob("");
    setSize("medium");
    setShowResult(false);
  }

  function handleCalc() {
    setShowResult(true);
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
      <label className="text-sm">
        <span className="block mb-1">Espécie</span>
        <select
          className="w-full border rounded-lg p-2"
          value={species}
          onChange={(e) => setSpecies(e.target.value as Species)}
        >
          <option value="dog">Cão</option>
          <option value="cat">Gato</option>
        </select>
      </label>

      <label className="text-sm">
        <span className="block mb-1">Data de nascimento</span>
        <input
          type="date"
          className="w-full border rounded-lg p-2"
          value={dob}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDob(e.target.value)}
        />
      </label>

      <label className="text-sm">
        <span className="block mb-1">Porte</span>
        <select
          className="w-full border rounded-lg p-2"
          value={size}
          onChange={(e) => setSize(e.target.value as SizeKey)}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
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
    state: { dob, showResult },
    derived: { animalYears, humanYears, stage },
  } = usePetCalc();

  if (!showResult || !dob)
    return <div className="text-sm text-gray-600">Preencha os campos e clique em Calcular.</div>;

  return (
    <div className="space-y-2 text-sm">
      <Info title="Idade (anos)" value={`${round1(animalYears)} anos`} />
      <Info title="Idade humana (estimada)" value={`${round1(humanYears)} anos`} />
      <Info title="Fase da vida" value={stage} />
      <p className="text-xs text-gray-500 mt-3">
        As estimativas são aproximadas e podem variar conforme genética, ambiente, nutrição e cuidados veterinários.
        Consulte o seu veterinário.
      </p>
    </div>
  );
}

function Info({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-gray-700">{title}</div>
      <div className="text-right">
        <div className="font-semibold">{value}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
    </div>
  );
}

// FAQ com toggle
function FaqToggle({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="text-sm text-gray-700 divide-y rounded-xl border">
      {items.map((it, idx) => {
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
