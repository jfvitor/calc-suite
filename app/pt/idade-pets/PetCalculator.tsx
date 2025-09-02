"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import type { Species as SpeciesT } from "@/lib/breeds";
import { getBreeds, dogBreeds, catBreeds, type Breed, type SizeKey as SizeKeyT } from "@/lib/breeds";

// ---------- tipos ----------
type Species = SpeciesT;
type SizeKey = SizeKeyT | "auto";
type Sex = "macho" | "femea";

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
const round1 = (n: number) => Math.round(n * 10) / 10;

// Fórmula base (igual à versão anterior)
function toHumanYears(species: Species, sizeKey: Exclude<SizeKey, "auto">, animalYears: number): number {
  if (animalYears <= 0) return 0;

  if (species === "dog") {
    const firstYear: Record<Exclude<SizeKey, "auto">, number> = { small: 12.5, medium: 12.5, large: 10.5 };
    const secondYear = firstYear;
    const postRate: Record<Exclude<SizeKey, "auto">, number> = { small: 4.3, medium: 4.0, large: 5.7 };
    if (animalYears <= 1) return animalYears * firstYear[sizeKey];
    if (animalYears <= 2) return firstYear[sizeKey] + (animalYears - 1) * secondYear[sizeKey];
    return firstYear[sizeKey] + secondYear[sizeKey] + (animalYears - 2) * postRate[sizeKey];
  }

  // gatos
  if (animalYears <= 1) return animalYears * 15;
  if (animalYears <= 2) return 15 + (animalYears - 1) * 9;
  return 24 + (animalYears - 2) * 4;
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

// Inferência de porte quando usuário deixa em “Automático”
function inferSize(species: Species, breed: Breed | null, weightKg: number | null): Exclude<SizeKey, "auto"> {
  // 1) se a raça tiver porte, usar
  if (breed) return breed.size;

  // 2) fallback por peso (limiares simples e práticos)
  if (species === "dog") {
    if (weightKg !== null) {
      if (weightKg < 10) return "small";
      if (weightKg <= 25) return "medium";
      return "large";
    }
    return "medium";
  } else {
    // cat
    if (weightKg !== null) {
      if (weightKg < 4) return "small";
      if (weightKg <= 6) return "medium";
      return "large"; // raças grandes como Maine Coon
    }
    return "medium";
  }
}

// ---------- estado/contexto ----------
function usePetCalcState() {
  const [species, setSpecies] = useState<Species>("dog");
  const [dob, setDob] = useState<string>("");
  const [sex, setSex] = useState<Sex>("femea");
  const [weight, setWeight] = useState<string>(""); // opcional
  const [breedName, setBreedName] = useState<string>("Sem raça definida (SRD)");
  const [size, setSize] = useState<SizeKey>("auto"); // inclui "auto"
  const [showResult, setShowResult] = useState<boolean>(false);

  const breeds = useMemo(() => getBreeds(species), [species]);
  const breedObj = useMemo(
    () => breeds.find((b) => b.name === breedName) || null,
    [breeds, breedName]
  );

  const weightNum = useMemo(() => {
    const s = (weight || "").replace(",", ".").trim();
    const n = parseFloat(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [weight]);

  const animalYears = yearsBetween(dob);
  const effectiveSize: Exclude<SizeKey, "auto"> =
    size === "auto" ? inferSize(species, breedObj, weightNum) : size;

  const humanYears = toHumanYears(species, effectiveSize, animalYears);
  const stage = lifeStage(species, humanYears);

  return {
    state: { species, dob, sex, weight, breedName, size, showResult },
    setters: { setSpecies, setDob, setSex, setWeight, setBreedName, setSize, setShowResult },
    derived: { animalYears, humanYears, stage, breeds, breedObj, effectiveSize, weightNum },
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

// ---------- componente exportado ----------
export default function PetCalculator({ faq }: { faq: readonly { q: string; a: string }[] }) {
  return (
    <PetCalcProvider>
      <CalculatorShell
        title="Idade de Pets (Cão/Gato)"
        subtitle="Informe os dados do seu animal para estimar a idade humana equivalente."
        heroEmoji="🐾"
        form={<Form />}
        result={<Result />}
        faq={<FaqToggle items={faq} />}
        compact // sem espaço de ads por enquanto
      />
    </PetCalcProvider>
  );
}

// ---------- UI ----------
function Form() {
  const {
    state: { species, dob, sex, weight, breedName, size },
    setters: { setSpecies, setDob, setSex, setWeight, setBreedName, setSize, setShowResult },
    derived: { breeds },
  } = usePetCalc();

  function handleClear() {
    setSpecies("dog");
    setDob("");
    setSex("femea");
    setWeight("");
    setBreedName("Sem raça definida (SRD)");
    setSize("auto");
    setShowResult(false);
  }
  function handleCalc() {
    setShowResult(true);
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
      {/* Espécie */}
      <label className="text-sm">
        <span className="block mb-1">Espécie</span>
        <select
          className="w-full border rounded-lg p-2"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value as Species);
            setBreedName("Sem raça definida (SRD)");
            setShowResult(false);
          }}
        >
          <option value="dog">Cão</option>
          <option value="cat">Gato</option>
        </select>
      </label>

      {/* Data de nascimento */}
      <label className="text-sm">
        <span className="block mb-1">Data de nascimento</span>
        <input
          type="date"
          className="w-full border rounded-lg p-2"
          value={dob}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => {
            setDob(e.target.value);
            setShowResult(false);
          }}
        />
      </label>

      {/* Raça (filtra por espécie) */}
      <label className="text-sm">
        <span className="block mb-1">Raça</span>
        <select
          className="w-full border rounded-lg p-2"
          value={breedName}
          onChange={(e) => {
            setBreedName(e.target.value);
            setShowResult(false);
          }}
        >
          {breeds.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          A raça ajuda a inferir o porte automaticamente. Você pode ajustar manualmente abaixo.
        </p>
      </label>

      {/* Sexo (opcional) */}
      <label className="text-sm">
        <span className="block mb-1">Sexo (opcional)</span>
        <select
          className="w-full border rounded-lg p-2"
          value={sex}
          onChange={(e) => {
            setSex(e.target.value as Sex);
            setShowResult(false);
          }}
        >
          <option value="femea">Fêmea</option>
          <option value="macho">Macho</option>
        </select>
      </label>

      {/* Peso (opcional) */}
      <label className="text-sm">
        <span className="block mb-1">Peso (kg, opcional)</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9.,]*"
          className="w-full border rounded-lg p-2"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setShowResult(false);
          }}
          placeholder="Ex.: 7,5"
        />
      </label>

      {/* Porte (com Automático) */}
      <label className="text-sm">
        <span className="block mb-1">Porte</span>
        <select
          className="w-full border rounded-lg p-2"
          value={size}
          onChange={(e) => {
            setSize(e.target.value as SizeKey);
            setShowResult(false);
          }}
        >
          <option value="auto">Automático (recomendado)</option>
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
      </label>

      {/* Ações */}
      <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
        <button type="button" onClick={handleCalc} className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Calcular
        </button>
        <button type="button" onClick={handleClear} className="px-4 py-2 bg-gray-300 rounded-lg">
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

  if (!showResult) {
    return <div className="text-sm text-gray-600">Preencha os campos e clique em <b>Calcular</b>.</div>;
  }
  if (!dob) {
    return <div className="text-sm text-red-600">Informe a <b>data de nascimento</b>.</div>;
  }

  return (
    <div className="space-y-2 text-sm">
      <Info title="Idade do animal" value={`${round1(animalYears)} anos`} />
      <Info title="Idade humana (estimada)" value={`${round1(humanYears)} anos`} />
      <Info title="Fase da vida" value={stage} />

      <p className="text-xs text-gray-500 mt-3">
        As estimativas são aproximadas. Genética, ambiente e cuidados veterinários podem alterar a idade “humana”
        equivalente. Consulte o seu veterinário.
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
              <span aria-hidden>{isOpen ? "–" : "+"}</span>
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
