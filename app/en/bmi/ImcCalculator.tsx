"use client";

import React, { createContext, useContext, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";

// ---------- utils ----------
function toNumberLocale(str: string): number {
  // Accepts "1.75" and "1,75"
  if (!str) return NaN;
  const s = str.replace(/\s+/g, "").replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

function parseHeightFlexible(input: string): number {
  // Allows height in meters (1.75) OR centimeters (175)
  const n = toNumberLocale(input);
  if (!Number.isFinite(n)) return NaN;
  return n > 3 ? n / 100 : n; // >3 assumed to be cm
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function calcBMI(weightKg: number, heightM: number): number {
  if (!(weightKg > 0) || !(heightM > 0)) return NaN;
  return weightKg / (heightM * heightM);
}

function bmiClassification(bmi: number): string {
  if (!Number.isFinite(bmi) || bmi <= 0) return "—";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity class I";
  if (bmi < 40) return "Obesity class II";
  return "Obesity class III";
}

function healthyWeightRange(heightM: number) {
  if (!(heightM > 0)) return { min: NaN, max: NaN };
  const min = 18.5 * heightM * heightM;
  const max = 24.9 * heightM * heightM;
  return { min, max };
}

// ---------- context ----------
function useBmiCalcState() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);

  const weightNum = toNumberLocale(weight);
  const heightM = parseHeightFlexible(height);
  const bmi = calcBMI(weightNum, heightM);
  const classification = bmiClassification(bmi);
  const range = healthyWeightRange(heightM);

  return {
    state: { weight, height, showResult },
    setters: { setWeight, setHeight, setShowResult },
    derived: { weightNum, heightM, bmi, classification, range },
  } as const;
}

const BmiCalcCtx = createContext<ReturnType<typeof useBmiCalcState> | null>(
  null
);

function BmiCalcProvider({ children }: { children: React.ReactNode }) {
  const value = useBmiCalcState();
  return <BmiCalcCtx.Provider value={value}>{children}</BmiCalcCtx.Provider>;
}

function useBmiCalc() {
  const ctx = useContext(BmiCalcCtx);
  if (!ctx) throw new Error("BmiCalcCtx not found");
  return ctx;
}

// ---------- exported component ----------
export default function ImcCalculator({
  faq,
}: {
  faq: readonly { q: string; a: string }[];
}) {
  return (
    <BmiCalcProvider>
      <CalculatorShell
        title="BMI Calculator"
        subtitle="Enter your weight and height (in m or cm) to calculate your Body Mass Index."
        heroEmoji="⚖️"
        form={<Form />}
        result={<Result />}
        faq={<FaqToggle items={faq} />}
        compact // no ad layout for now
      />
    </BmiCalcProvider>
  );
}

// ---------- UI ----------
function Form() {
  const {
    state: { weight, height },
    setters: { setWeight, setHeight, setShowResult },
  } = useBmiCalc();

  function handleClear() {
    setWeight("");
    setHeight("");
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
      <label className="text-sm">
        <span className="block mb-1">Weight (kg)</span>
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
          placeholder="e.g., 70.5"
          aria-label="Weight in kilograms"
        />
      </label>

      <label className="text-sm">
        <span className="block mb-1">Height (m or cm)</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9.,]*"
          className="w-full border rounded-lg p-2"
          value={height}
          onChange={(e) => {
            setHeight(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g., 1.75 or 175"
          aria-label="Height in meters or centimeters"
        />
        <p className="mt-1 text-xs text-gray-500">
          Tip: you can type in <b>meters</b> (1.75) or <b>centimeters</b> (175).
        </p>
      </label>

      <div className="col-span-2 flex gap-4 mt-2">
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
    state: { showResult },
    derived: { weightNum, heightM, bmi, classification, range },
  } = useBmiCalc();

  if (!showResult) {
    return (
      <div className="text-sm text-gray-600">
        Fill in the fields and click <b>Calculate</b> to see the result.
      </div>
    );
  }

  if (!(weightNum > 0) || !(heightM > 0)) {
    return (
      <div className="text-sm text-red-600">
        Please enter a valid <b>weight</b> and <b>height</b>.
      </div>
    );
  }

  // simple "realistic" adult height check
  if (heightM < 0.5 || heightM > 2.5) {
    return (
      <div className="text-sm text-red-600">
        Please check the height entered. For adults, use a value between{" "}
        <b>0.50 m</b> and <b>2.50 m</b>.
      </div>
    );
  }

  const bmiVal = bmi;
  const { min, max } = range;

  let tip = "";
  if (bmiVal < 18.5 && Number.isFinite(min)) {
    tip = `To reach a BMI of 18.5, a target weight would be around ${round1(
      min
    )} kg.`;
  } else if (bmiVal > 24.9 && Number.isFinite(max)) {
    tip = `To be at a BMI of 24.9, a target weight would be around ${round1(
      max
    )} kg.`;
  }

  return (
    <div className="space-y-3 text-sm border rounded-xl p-4 bg-gray-50">
      <Info
        title="BMI"
        value={Number.isFinite(bmiVal) ? round1(bmiVal).toString() : "—"}
      />
      <Info title="Classification" value={classification} />
      {Number.isFinite(min) && Number.isFinite(max) && (
        <Info
          title="Recommended weight range"
          value={`${round1(min)} – ${round1(max)} kg`}
        />
      )}

      {!!tip && <p className="text-xs text-gray-600">{tip}</p>}

      <p className="text-xs text-gray-500 mt-3">
        BMI is a general indicator and has limitations (for example: athletes,
        pregnant people, older adults). Use it as a screening tool only and
        talk to a healthcare professional for a full assessment.
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

// ---------- FAQ (toggle) ----------
function FaqToggle({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const allItems = [
    ...items,
    {
      q: "Is the BMI calculation different for men and women?",
      a: "No. The BMI formula is the same for everyone: weight / height². What can vary is how a doctor interprets the result, since body composition and fat distribution may differ. However, the WHO reference ranges are the same for adult men and women.",
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
