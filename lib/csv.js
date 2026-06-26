// Converte linhas de CSV (papaparse, header:true) no formato interno do painel.
// Colunas esperadas: mes(YYYY-MM); faturamento; despesas; das; das_vencimento; a_receber; a_pagar
// Mínimo: mes + faturamento + despesas. Campos faltantes degradam sem quebrar.

function num(v) {
  if (v == null || v === "") return 0;
  // aceita "1.234,56" ou "1234.56"
  let s = String(v).trim().replace(/[R$\s]/g, "");
  if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

export function csvParaDataset(rows) {
  const out = [];
  for (const r of rows) {
    const mes = (r.mes || r.Mes || r["mês"] || "").toString().trim();
    if (!/^\d{4}-\d{2}$/.test(mes)) continue;
    const fat = num(r.faturamento ?? r.Faturamento);
    const desp = num(r.despesas ?? r.Despesas);
    const das = num(r.das ?? r.DAS);
    out.push({
      mes, faturamento: fat, das, dasVencimento: (r.das_vencimento || "").trim() || null,
      despesas: { Despesas: desp },
      aReceber: num(r.a_receber) > 0 ? [{ cliente: "A receber", valor: num(r.a_receber), vencimento: null }] : [],
      aPagar: num(r.a_pagar) > 0 ? [{ descricao: "A pagar", valor: num(r.a_pagar), vencimento: null }] : [],
    });
  }
  out.sort((a, b) => a.mes.localeCompare(b.mes));
  return out;
}

export function validaDataset(ds) {
  if (!Array.isArray(ds) || ds.length === 0)
    return { ok: false, erro: "Não encontrei linhas válidas. Use o CSV-modelo (coluna 'mes' no formato AAAA-MM)." };
  const semFat = ds.every((m) => !m.faturamento);
  if (semFat) return { ok: false, erro: "Faltou a coluna 'faturamento' com valores." };
  return { ok: true };
}
