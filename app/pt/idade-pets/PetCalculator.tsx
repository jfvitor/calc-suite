"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";

type Species = "dog" | "cat";
type SizeKey = "small" | "medium" | "large";

type Breed = {
  name: string;
  size: SizeKey;
  lifeMin: number;
  lifeMax: number;
};

const BREEDS: Record<Species, Breed[]> = {
  dog: [
    { name: "Sem raça definida (SRD)", size: "medium", lifeMin: 10, lifeMax: 14 },
    { name: "Labrador Retriever", size: "large", lifeMin: 11, lifeMax: 13 },
    { name: "Golden Retriever", size: "large", lifeMin: 10, lifeMax: 12 },
    { name: "German Shepherd", size: "large", lifeMin: 9, lifeMax: 13 },
    { name: "Bulldog", size: "medium", lifeMin: 8, lifeMax: 10 },
    { name: "Beagle", size: "medium", lifeMin: 12, lifeMax: 15 },
    { name: "Poodle (Toy)", size: "small", lifeMin: 12, lifeMax: 15 },
    { name: "Poodle (Standard)", size: "medium", lifeMin: 12, lifeMax: 14 },
    { name: "Chihuahua", size: "small", lifeMin: 14, lifeMax: 17 },
    { name: "Yorkshire Terrier", size: "small", lifeMin: 13, lifeMax: 16 },
    { name: "Shih Tzu", size: "small", lifeMin: 12, lifeMax: 16 },
    { name: "Dachshund", size: "small", lifeMin: 12, lifeMax: 16 },
    { name: "Border Collie", size: "medium", lifeMin: 12, lifeMax: 15 },
    { name: "Boxer", size: "large", lifeMin: 10, lifeMax: 12 },
    { name: "Rottweiler", size: "large", lifeMin: 9, lifeMax: 12 },
    { name: "Doberman", size: "large", lifeMin: 10, lifeMax: 13 },
    { name: "French Bulldog", size: "small", lifeMin: 10, lifeMax: 12 },
    { name: "Great Dane", size: "large", lifeMin: 7, lifeMax: 10 },
  ],
  cat: [
    { name: "Sem raça definida (SRD)", size: "small", lifeMin: 12, lifeMax: 16 },
    { name: "Persian", size: "small", lifeMin: 12, lifeMax: 17 },
    { name: "Siamese", size: "small", lifeMin: 14, lifeMax: 20 },
    { name: "Maine Coon", size: "medium", lifeMin: 10, lifeMax: 15 },
    { name: "Ragdoll", size: "medium", lifeMin: 12, lifeMax: 17 },
    { name: "British Shorthair", size: "small", lifeMin: 12, lifeMax: 17 },
    { name: "Sphynx", size: "small", lifeMin: 10, lifeMax: 14 },
    { name: "Bengal", size: "small", lifeMin: 12, lifeMax: 16 },
    { name: "Scottish Fold", size: "small", lifeMin: 12, lifeMax: 15 },
    { name: "Abyssinian", size: "small", lifeMin: 12, lifeMax: 16 },
    { name: "Norwegian Forest", size: "medium", lifeMin: 12, lifeMax: 16 },
    { name: "Russian Blue", size: "small", lifeMin: 12, lifeMax: 17 },
  ],
};

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

// Conversão para “idade humana”
function toHumanYears(species: Species, sizeKey: SizeKey, animalYears: number): number {
  if (animalYears <= 0) return 0;

  if (species === "dog") {
    // 1º e 2º anos acelerados; depois taxa por porte
    const firstYear: Record<SizeKey, number> = { small: 12.5, medium: 12.5, large: 10.5 };
    const secondYear = firstYear;
    const postRate: Record<SizeKey, number> = { small: 4.3, medium: 4.0, large: 5.7 };
    if (animalYears <= 1) return animalYears * firstYear[sizeKey];
    if (animalYears <= 2) return firstYear[sizeKey] + (animalYears - 1) * secondYear[sizeKey];
    return firstYear[sizeKey] + secondYear[sizeKey] + (animalYears - 2) * postRate[sizeKey];
  }

  if (species === "cat") {
    // ~15 no 1º, +9 no 2º, +4/ano depois
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

// ---------- shared state via context ----------
function usePetCalcState() {
  const [species, setSpecies] = useState<Species>("dog");
  const [dob, setDob] = useState<string>("");
  const [size, setSize] = useState<SizeKey>("medium");
  const [breed, setBreed] = useState<string>("");
  const [weight, setWeight] = useState<string>(""); // opcional (kg)
  const [sex, setSex] = useState<string>("");

  const breedOptions = BREEDS[species];
  const selectedBreed = useMemo(() => breedOptions.find((b) => b.name === breed), [breedOptions, breed]);

  const animalYears = yearsBetween(dob);
  const sizeKey = selectedBreed?.size || size;
  const humanYears = toHumanYears(species, sizeKey, animalYears);

  const lifeExp = useMemo(() => {
    const base = selectedBreed
      ? (selectedBreed.lifeMin + selectedBreed.lifeMax) / 2
      : species === "dog"
      ? sizeKey === "small"
        ? 14
        : sizeKey === "medium"
        ? 12.5
        : 11
      : 15; // gatos média

    const w = parseFloat(weight);
    if (!isNaN(w) && species === "dog") {
      if (w > 35) return base - 1; // muito pesados tendem a viver menos
      if (w < 7) return base + 0.5; // toy ligeiramente mais
    }
    return base;
  }, [selectedBreed, species, sizeKey, weight]);

  const remainingYears = Math.max(0, lifeExp - animalYears);
  const stage = lifeStage(species, humanYears);

  return {
    state: { species, dob, size, breed, weight, sex },
    setters: { setSpecies, setDob, setSize, setBreed, setWeight, setSex },
    derived: {
      breedOptions,
      selectedBreed,
      animalYears,
      humanYears,
      lifeExp,
      remainingYears,
      stage,
      sizeKey,
    },
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
        subtitle="Informe os dados do seu animal para estimar idade humana equivalente e expectativa de vida."
        heroEmoji="🐾"
        form={<Form />}
        result={<Result />}
        faq={<Faq items={faq} />}
      />
    </PetCalcProvider>
  );
}

// ---------- UI blocks ----------
function Form() {
  const {
    state: { species, dob, size, breed, weight, sex },
    setters: { setSpecies, setDob, setSize, setBreed, setWeight, setSex },
    derived: { breedOptions },
  } = usePetCalc();

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
      <label className="text-sm">
        <span className="block mb-1">Espécie</span>
        <select
          className="w-full border rounded-lg p-2"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value as Species);
            setBreed(""); // reset breed quando muda espécie
          }}
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

      <label className="text-sm">
        <span className="block mb-1">Raça (opcional)</span>
        <input
          list="breedList"
          className="w-full border rounded-lg p-2"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder={species === "dog" ? "Ex.: Labrador" : "Ex.: Siamês"}
        />
        <datalist id="breedList">
          {breedOptions.map((b) => (
            <option key={b.name} value={b.name} />
          ))}
        </datalist>
        <p className="mt-1 text-xs text-gray-500">Se a raça não estiver listada, deixe em branco. Usaremos o porte.</p>
      </label>

      <label className="text-sm">
        <span className="block mb-1">Peso (kg, opcional)</span>
        <input
          type="number"
          min={0}
          step={0.1}
          className="w-full border rounded-lg p-2"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ex.: 12.5"
        />
      </label>

      <label className="text-sm">
        <span className="block mb-1">Sexo (opcional)</span>
        <select className="w-full border rounded-lg p-2" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="">Prefiro não dizer</option>
          <option value="female">Fêmea</option>
          <option value="male">Macho</option>
        </select>
      </label>
    </form>
  );
}

function Result() {
  const {
    state: { dob },
    derived: { animalYears, humanYears, lifeExp, remainingYears, stage, selectedBreed, sizeKey },
  } = usePetCalc();

  if (!dob) return <div className="text-sm text-gray-600">Preencha a data de nascimento para calcular.</div>;

  return (
    <div className="space-y-2 text-sm">
      <Info title="Idade (anos)" value={`${round1(animalYears)} anos`} />
      <Info
        title="Idade humana (estimada)"
        value={`${round1(humanYears)} anos`}
        hint={
          selectedBreed
            ? `Modelo por porte da raça (${selectedBreed.size}).`
            : `Modelo por porte selecionado (${sizeKey}).`
        }
      />
      <Info title="Fase da vida" value={stage} />
      <Info
        title="Expectativa de vida"
        value={`${lifeExp.toFixed(1)} anos`}
        hint={selectedBreed ? `Baseado na raça: ${selectedBreed.name}` : "Estimativa por porte/espécie."}
      />
      <Info title="Anos restantes (estim.)" value={`${round1(remainingYears)} anos`} />
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

function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <ul className="text-sm text-gray-700 space-y-2">
      {items.map((it) => (
        <li key={it.q}>
          <p className="font-medium">{it.q}</p>
          <p className="text-gray-600">{it.a}</p>
        </li>
      ))}
    </ul>
  );
}
