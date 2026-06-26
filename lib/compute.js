// Agregações e derivações a partir do dataset (12 meses no formato do seed/CSV).

export const BRL = (v) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const PCT = (v) => (v ?? 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";

export function despesaTotal(m) {
  return Object.values(m.despesas || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

// filtra o dataset pelo período relativo ao mês mais recente
export function filtraPeriodo(dataset, periodo) {
  if (!dataset.length) return [];
  if (periodo === "ano") return dataset.slice(-12);
  if (periodo === "tri") return dataset.slice(-3);
  return dataset.slice(-1); // mês
}

export function resumo(dataset, periodo) {
  const ds = filtraPeriodo(dataset, periodo);
  const fat = ds.reduce((a, m) => a + (Number(m.faturamento) || 0), 0);
  const desp = ds.reduce((a, m) => a + despesaTotal(m), 0);
  const das = ds.reduce((a, m) => a + (Number(m.das) || 0), 0);
  const sobra = fat - desp - das;
  const cargaPct = fat > 0 ? (das / fat) * 100 : 0;
  const ult = dataset[dataset.length - 1] || {};
  const fatAcum = dataset.reduce((a, m) => a + (Number(m.faturamento) || 0), 0);
  const aReceber = ds.flatMap((m) => m.aReceber || []);
  const aReceberTotal = aReceber.reduce((a, r) => a + (Number(r.valor) || 0), 0);
  return { fat, desp, das, sobra, cargaPct, ult, fatAcum, aReceber, aReceberTotal,
           dasUlt: Number(ult.das) || 0, dasVenc: ult.dasVencimento };
}

// séries para gráficos (sempre 12 meses para tendência)
export function serieFaturamento(dataset) {
  return dataset.map((m) => ({ mes: rotuloMes(m.mes), Faturamento: Number(m.faturamento) || 0 }));
}
export function serieFluxo(dataset) {
  return dataset.map((m) => ({
    mes: rotuloMes(m.mes), Entradas: Number(m.faturamento) || 0,
    "Saídas": despesaTotal(m) + (Number(m.das) || 0),
  }));
}
export function serieCarga(dataset) {
  return dataset.map((m) => {
    const f = Number(m.faturamento) || 0;
    return { mes: rotuloMes(m.mes), Carga: f > 0 ? Math.round(((Number(m.das) || 0) / f) * 1000) / 10 : 0 };
  });
}
export function composicaoDespesas(dataset, periodo) {
  const ds = filtraPeriodo(dataset, periodo);
  const acc = {};
  ds.forEach((m) => Object.entries(m.despesas || {}).forEach(([k, v]) => { acc[k] = (acc[k] || 0) + (Number(v) || 0); }));
  return Object.entries(acc).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function prazos(dataset) {
  const ult = dataset[dataset.length - 1] || {};
  const out = [];
  if (ult.das) out.push({ tipo: "DAS (Simples)", valor: Number(ult.das), data: ult.dasVencimento });
  (ult.aPagar || []).forEach((p) => out.push({ tipo: p.descricao, valor: Number(p.valor), data: p.vencimento }));
  (ult.aReceber || []).forEach((r) => out.push({ tipo: "A receber — " + r.cliente, valor: Number(r.valor), data: r.vencimento, receber: true }));
  return out.sort((a, b) => String(a.data).localeCompare(String(b.data)));
}

export function rotuloMes(ym) {
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const [, m] = String(ym).split("-");
  return meses[(Number(m) || 1) - 1] || ym;
}
export function dataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = String(iso).split("-");
  return d && m ? `${d}/${m}/${a}` : iso;
}
