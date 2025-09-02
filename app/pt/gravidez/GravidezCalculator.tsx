"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";

type Method = "dum" | "conception";

// ---------- utils de data ----------
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const today = () => new Date();

function addDays(d: Date, days: number) {
  const nd = new Date(d.getTime());
  nd.setDate(nd.getDate() + days);
  return nd;
}
function diffDays(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}
function fmt(d: Date) {
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function weeksAndDays(totalDays: number) {
  const w = Math.floor(totalDays / 7);
  const d = totalDays % 7;
  return { weeks: w, days: d };
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function parseDate(value: string) {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

// ---------- regras ----------
function estimateDueDate(method: Method, lmp: Date | null, cycleLen: number, conception: Date | null) {
  if (method === "dum" && lmp) {
    const adj = clamp(Math.round(cycleLen) - 28, -7, 14);
    return addDays(lmp, 280 + adj);
  }
  if (method === "conception" && conception) {
    return addDays(conception, 266);
  }
  return null;
}

function estimateOvulation(method: Method, lmp: Date | null, cycleLen: number, conception: Date | null) {
  if (method === "dum" && lmp) {
    const ov = addDays(lmp, clamp(Math.round(cycleLen) - 14, 8, 21));
    return { ovulation: ov, fertileStart: addDays(ov, -5), fertileEnd: addDays(ov, 1) };
  }
  if (method === "conception" && conception) {
    const ov = conception;
    return { ovulation: ov, fertileStart: addDays(ov, -5), fertileEnd: addDays(ov, 1) };
  }
  return { ovulation: null as Date | null, fertileStart: null as Date | null, fertileEnd: null as Date | null };
}

function estimateGestationalAgeToday(method: Method, lmp: Date | null, conception: Date | null) {
  const now = today();
  let lmpRef: Date | null = null;
  if (method === "dum" && lmp) lmpRef = lmp;
  if (method === "conception" && conception) lmpRef = addDays(conception, -14);

  if (!lmpRef) return null;
  const days = diffDays(now, lmpRef);
  if (days < 0) return { days, text: "Aguardando início do ciclo (DUM futura)", valid: false };
  const { weeks, days: rem } = weeksAndDays(days);
  return { days, text: `${weeks} sem e ${rem} d`, valid: true };
}

// ---------- estado/contexto ----------
function useGravidezState() {
  const [method, setMethod] = useState<Method>("dum");
  const [lmpStr, setLmpStr] = useState<string>(""); // DUM
  const [cycleLenStr, setCycleLenStr] = useState<string>("28");
  const [conceptionStr, setConceptionStr] = useState<string>("");

  // o que mostrar (separação DPP vs Fertilidade)
  const [wantDueDate, setWantDueDate] = useState<boolean>(true);
  const [wantFertility, setWantFertility] = useState<boolean>(true);

  const [showResult, setShowResult] = useState<boolean>(false);

  const lmp = useMemo(() => parseDate(lmpStr), [lmpStr]);
  const conception = useMemo(() => parseDate(conceptionStr), [conceptionStr]);
  const cycleLen = useMemo(() => {
    const n = parseInt(cycleLenStr || "28", 10);
    return clamp(isNaN(n) ? 28 : n, 21, 35);
  }, [cycleLenStr]);

  // Derivados
  const dueDate = estimateDueDate(method, lmp, cycleLen, conception);
  const { ovulation, fertileStart, fertileEnd } = estimateOvulation(method, lmp, cycleLen, conception);
  const ga = estimateGestationalAgeToday(method, lmp, conception);

  // Validações
  const now = today();
  let error: string | null = null;
  if (showResult) {
    if (method === "dum") {
      if (!lmp) error = "Informe uma data válida para a DUM.";
      else if (lmp > now) error = "A DUM não pode ser no futuro.";
      else if (diffDays(now, lmp) > 44 * 7 + 6) error = "A DUM ultrapassa 44 semanas; revise a data.";
    } else {
      if (!conception) error = "Informe uma data válida para a concepção.";
      else if (conception > now) error = "A data de concepção não pode ser no futuro.";
    }
    if (!wantDueDate && !wantFertility) error = "Selecione ao menos um resultado (DPP ou Fertilidade).";
  }

  function clearAll() {
    setMethod("dum");
    setLmpStr("");
    setCycleLenStr("28");
    setConceptionStr("");
    setWantDueDate(true);
    setWantFertility(true);
    setShowResult(false);
  }

  return {
    state: { method, lmpStr, cycleLenStr, conceptionStr, wantDueDate, wantFertility, showResult },
    setters: {
      setMethod,
      setLmpStr,
      setCycleLenStr,
      setConceptionStr,
      setWantDueDate,
      setWantFertility,
      setShowResult,
      clearAll,
    },
    derived: { dueDate, ovulation, fertileStart, fertileEnd, ga, cycleLen, error },
  } as const;
}

const GravCtx = createContext<ReturnType<typeof useGravidezState> | null>(null);
function GravidezProvider({ children }: { children: React.ReactNode }) {
  const value = useGravidezState();
  return <GravCtx.Provider value={value}>{children}</GravCtx.Provider>;
}
function useGrav() {
  const ctx = useContext(GravCtx);
  if (!ctx) throw new Error("GravidezCtx não encontrado");
  return ctx;
}

// ---------- componente exportado ----------
export default function GravidezCalculator({ faq }: { faq: readonly { q: string; a: string }[] }) {
  return (
    <GravidezProvider>
      <CalculatorShell
        title="Calculadora de Gravidez e Ovulação"
        subtitle="Use a DUM (última menstruação) ou a data de concepção. Selecione se deseja estimar a DPP e/ou a janela fértil."
        heroEmoji="👶"
        form={<Form />}
        result={<Result />}
        faq={<FaqToggle items={faq} />}
        compact // layout sem ads enquanto não houver AdSense
      />
    </GravidezProvider>
  );
}

// ---------- UI ----------
function Form() {
  const {
    state: { method, lmpStr, cycleLenStr, conceptionStr, wantDueDate, wantFertility },
    setters: {
      setMethod,
      setLmpStr,
      setCycleLenStr,
      setConceptionStr,
      setWantDueDate,
      setWantFertility,
      setShowResult,
      clearAll,
    },
  } = useGrav();

  function handleCalc() {
    setShowResult(true);
  }
  function handleClear() {
    clearAll();
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
      {/* Método */}
      <fieldset className="md:col-span-2">
        <legend className="text-sm mb-1">Método</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="dum"
              checked={method === "dum"}
              onChange={() => {
                setMethod("dum");
                setShowResult(false);
              }}
            />
            <span>DUM (data da última menstruação)</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="conception"
              checked={method === "conception"}
              onChange={() => {
                setMethod("conception");
                setShowResult(false);
              }}
            />
            <span>Data de concepção</span>
          </label>
        </div>
      </fieldset>

      {/* Entradas específicas */}
      {method === "dum" ? (
        <>
          <label className="text-sm">
            <span className="block mb-1">DUM (início do último período)</span>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={lmpStr}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                setLmpStr(e.target.value);
                setShowResult(false);
              }}
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1">Duração do ciclo (dias)</span>
            <input
              type="number"
              min={21}
              max={35}
              step={1}
              className="w-full border rounded-lg p-2"
              value={cycleLenStr}
              onChange={(e) => {
                setCycleLenStr(e.target.value);
                setShowResult(false);
              }}
              placeholder="Ex.: 28"
            />
            <p className="mt-1 text-xs text-gray-500">Se não souber, mantenha 28 dias.</p>
          </label>
        </>
      ) : (
        <>
          <label className="text-sm md:col-span-2">
            <span className="block mb-1">Data de concepção</span>
            <input
              type="date"
              className="border rounded-lg p-2 w-56" // menor que full
              value={conceptionStr}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                setConceptionStr(e.target.value);
                setShowResult(false);
              }}
            />
          </label>
        </>
      )}

      {/* O que calcular (separação) */}
      <fieldset className="md:col-span-2">
        <legend className="text-sm mb-1">Quero estimar</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={wantDueDate}
              onChange={(e) => {
                setWantDueDate(e.target.checked);
                setShowResult(false);
              }}
            />
            <span>DPP (data provável do parto)</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={wantFertility}
              onChange={(e) => {
                setWantFertility(e.target.checked);
                setShowResult(false);
              }}
            />
            <span>Fertilidade / Ovulação</span>
          </label>
        </div>
      </fieldset>

      {/* Ações */}
      <div className="md:col-span-2 flex gap-4 mt-2">
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
    state: { method, showResult, wantDueDate, wantFertility },
    derived: { dueDate, ovulation, fertileStart, fertileEnd, ga, error },
  } = useGrav();

  if (!showResult) return <div className="text-sm text-gray-600">Preencha os campos e clique em <b>Calcular</b>.</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  const blocks: React.ReactNode[] = [];

  if (wantDueDate) {
    if (dueDate) {
      blocks.push(<Info key="dpp" title="DPP (data provável do parto)" value={fmt(dueDate)} />);
      if (ga && ga.valid) blocks.push(<Info key="ga" title="Idade gestacional (hoje)" value={ga.text} />);
    } else {
      blocks.push(
        <p key="dpp-miss" className="text-xs text-gray-600">
          Forneça {method === "dum" ? "a DUM" : "a data de concepção"} para estimar a DPP.
        </p>
      );
    }
  }

  if (wantFertility) {
    if (ovulation && fertileStart && fertileEnd) {
      blocks.push(<Info key="ov" title="Ovulação estimada" value={fmt(ovulation)} />);
      blocks.push(<Info key="janela" title="Janela fértil estimada" value={`${fmt(fertileStart)} – ${fmt(fertileEnd)}`} />);
    } else {
      blocks.push(
        <p key="ov-miss" className="text-xs text-gray-600">
          Forneça {method === "dum" ? "a DUM e ciclo" : "a data de concepção"} para estimar a ovulação.
        </p>
      );
    }
  }

  return (
    <div className="space-y-2 text-sm">
      {blocks}
      <p className="text-xs text-gray-500 mt-3">
        Esta é uma estimativa baseada em regras clínicas gerais (ex.: Naegele). Cada gravidez é única. Confirme sempre
        com o(a) seu/sua obstetra.
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
