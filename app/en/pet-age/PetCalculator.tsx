"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import type { Species as SpeciesT } from "@/lib/breeds";
import { getBreeds, type Breed, type SizeKey as SizeKeyT } from "@/lib/breeds";

// ---------- types ----------
type Species = SpeciesT;
type SizeKey = SizeKeyT | "auto";
type Sex = "male" | "female";

type Labels = {
  dataTitle?: string;
  resultTitle?: string;
  faqTitle?: string;
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

const round1 = (n: number) => Math.round(n * 10) / 10;

// Convert to human years
function toHumanYears(
  species: Species,
  sizeKey: Exclude<SizeKey, "auto">,
  animalYears: number
): number {
  if (animalYears <= 0) return 0;

  if (species === "dog") {
    const firstYear = { small: 12.5, medium: 12.5, large: 10.5 };
    const secondYear = firstYear;
    const postRate = { small: 4.3, medium: 4.0, large: 5.7 };

    if (animalYears <= 1) return animalYears * firstYear[sizeKey];
    if (animalYears <= 2)
      return firstYear[sizeKey] + (animalYears - 1) * secondYear[sizeKey];

    return (
      firstYear[sizeKey] +
      secondYear[sizeKey] +
      (animalYears - 2) * postRate[sizeKey]
    );
  }

  // Cats
  if (animalYears <= 1) return animalYears * 15;
  if (animalYears <= 2) return 15 + (animalYears - 1) * 9;
  return 24 + (animalYears - 2) * 4;
}

function lifeStage(
  species: Species,
  humanYears: number
): "Kitten/Puppy" | "Young" | "Adult" | "Senior" {
  const h = humanYears;

  if (species === "dog") {
    if (h < 12) return "Kitten/Puppy";
    if (h < 30) return "Young";
    if (h < 55) return "Adult";
    return "Senior";
  } else {
    if (h < 15) return "Kitten/Puppy";
    if (h < 28) return "Young";
    if (h < 48) return "Adult";
    return "Senior";
  }
}

// Auto size inference
function inferSize(
  species: Species,
  breed: Breed | null,
  weightKg: number | null
): Exclude<SizeKey, "auto"> {
  if (breed) return breed.size;

  if (species === "dog") {
    if (weightKg !== null) {
      if (weightKg < 10) return "small";
      if (weightKg <= 25) return "medium";
      return "large";
    }
    return "medium";
  } else {
    if (weightKg !== null) {
      if (weightKg < 4) return "small";
      if (weightKg <= 6) return "medium";
      return "large";
    }
    return "medium";
  }
}

// ---------- state/context ----------
function usePetCalcState() {
  const [species, setSpecies] = useState<Species>("dog");
  const [dob, setDob] = useState<string>("");
  const [sex, setSex] = useState<Sex>("female");
  const [weight, setWeight] = useState<string>("");
  // usamos o valor interno em PT, pois é assim que está definido em lib/breeds.ts
  const [breedName, setBreedName] = useState<string>("Sem raça definida (SRD)");
  const [size, setSize] = useState<SizeKey>("auto");
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
    setters: {
      setSpecies,
      setDob,
      setSex,
      setWeight,
      setBreedName,
      setSize,
      setShowResult,
    },
    derived: {
      animalYears,
      humanYears,
      stage,
      breeds,
      breedObj,
      effectiveSize,
      weightNum,
    },
  } as const;
}

const PetCalcCtx = createContext<ReturnType<typeof usePetCalcState> | null>(
  null
);

function PetCalcProvider({ children }: { children: React.ReactNode }) {
  const value = usePetCalcState();
  return <PetCalcCtx.Provider value={value}>{children}</PetCalcCtx.Provider>;
}

function usePetCalc() {
  const ctx = useContext(PetCalcCtx);
  if (!ctx) throw new Error("PetCalcCtx not found");
  return ctx;
}

// ---------- exported component ----------
export default function PetCalculator({
  faq,
  labels,
}: {
  faq: readonly { q: string; a: string }[];
  labels?: Labels;
}) {
  return (
    <PetCalcProvider>
      <CalculatorShell
        title="Pet Age Calculator (Dog/Cat)"
        subtitle="Enter your pet’s details to estimate its equivalent human age."
        heroEmoji="🐾"
        form={<Form />}
        result={<Result />}
        faq={<FaqToggle items={faq} />}
        compact
        labels={labels}
      />
    </PetCalcProvider>
  );
}

// ---------- UI ----------
function Form() {
  const {
    state: { species, dob, sex, weight, breedName, size },
    setters: {
      setSpecies,
      setDob,
      setSex,
      setWeight,
      setBreedName,
      setSize,
      setShowResult,
    },
    derived: { breeds },
  } = usePetCalc();

  function handleClear() {
    setSpecies("dog");
    setDob("");
    setSex("female");
    setWeight("");
    setBreedName("Sem raça definida (SRD)");
    setSize("auto");
    setShowResult(false);
  }

  function handleCalc() {
    setShowResult(true);
  }

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Species */}
      <label className="text-sm">
        <span className="block mb-1">Species</span>
        <select
          className="w-full border rounded-lg p-2"
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value as Species);
            setBreedName("Sem raça definida (SRD)");
            setShowResult(false);
          }}
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </label>

      {/* Date of birth */}
      <label className="text-sm">
        <span className="block mb-1">Date of birth</span>
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

      {/* Breed */}
      <label className="text-sm">
        <span className="block mb-1">Breed</span>
        <select
          className="w-full border rounded-lg p-2"
          value={breedName}
          onChange={(e) => {
            setBreedName(e.target.value);
            setShowResult(false);
          }}
        >
          {breeds.map((b) => {
            const displayName =
              b.name === "Sem raça definida (SRD)"
                ? "Mixed breed (no defined breed)"
                : b.name;

            return (
              <option key={b.name} value={b.name}>
                {displayName}
              </option>
            );
          })}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Breed helps infer size automatically.
        </p>
      </label>

      {/* Sex */}
      <label className="text-sm">
        <span className="block mb-1">Sex (optional)</span>
        <select
          className="w-full border rounded-lg p-2"
          value={sex}
          onChange={(e) => {
            setSex(e.target.value as Sex);
            setShowResult(false);
          }}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>

      {/* Weight */}
      <label className="text-sm">
        <span className="block mb-1">Weight (kg, optional)</span>
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
          placeholder="e.g., 7.5"
        />
      </label>

      {/* Size */}
      <label className="text-sm">
        <span className="block mb-1">Size</span>
        <select
          className="w-full border rounded-lg p-2"
          value={size}
          onChange={(e) => {
            setSize(e.target.value as SizeKey);
            setShowResult(false);
          }}
        >
          <option value="auto">Automatic (recommended)</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>

      {/* Actions */}
      <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
        <button
          type="button"
          onClick={handleCalc}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Clear
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
    return (
      <div className="text-sm text-gray-600">
        Fill in the fields and click <b>Calculate</b> to see the result.
      </div>
    );
  }

  if (!dob) {
    return (
      <div className="text-sm text-red-600">
        Please enter the <b>date of birth</b>.
      </div>
    );
  }

  if (animalYears <= 0) {
    return (
      <div className="text-sm text-red-600">
        The date entered is today or in the future. Please check and try again.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm border rounded-xl p-4 bg-gray-50">
      <Info title="Pet age" value={`${round1(animalYears)} years`} />
      <Info title="Estimated human age" value={`${round1(humanYears)} years`} />
      <Info title="Life stage" value={stage} />

      <p className="text-xs text-gray-500 mt-3">
        These values are approximations. Genetics, health, environment, and
        veterinary care can significantly influence aging. Always consult your
        veterinarian for precise assessments.
      </p>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="text-gray-700">{title}</div>
      <div className="text-right font-semibold">{value}</div>
    </div>
  );
}

// ---------- FAQ ----------
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
