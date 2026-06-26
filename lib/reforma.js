// Modelo ILUSTRATIVO/educativo do impacto da Reforma Tributária (CBS/IBS) — NÃO é cálculo oficial.
// Objetivo: dar ao dono da PJ uma noção visual de "carga hoje" x "projeção", de forma transparente.
// Parâmetros são suposições do usuário (sliders); o texto deixa claro que é estimativa.

export function projetaReforma(faturamentoAno, cargaHojePct, params) {
  const { aliquotaRef, creditoAproveitadoPct } = params; // % de referência ilustrativa e % de crédito
  const cargaHoje = (faturamentoAno * cargaHojePct) / 100;

  // Ilustração simples: na transição, parte do tributo vira CBS/IBS com possibilidade de crédito.
  // carga projetada = faturamento * aliquotaRef * (1 - creditoAproveitado)
  const efetiva = aliquotaRef * (1 - creditoAproveitadoPct / 100);
  const cargaDepois = (faturamentoAno * efetiva) / 100;

  const variacao = cargaHoje > 0 ? ((cargaDepois - cargaHoje) / cargaHoje) * 100 : 0;
  return {
    cargaHoje,
    cargaDepois,
    cargaDepoisPct: faturamentoAno > 0 ? (cargaDepois / faturamentoAno) * 100 : 0,
    variacao,
  };
}

export const REFORMA_TEXTO =
  "A partir de 2026, o Brasil testa um novo modelo de impostos sobre consumo (CBS federal e IBS de " +
  "estados/municípios), com transição gradual até 2033. Empresas do Simples vão precisar avaliar se " +
  "compensa o regime atual ou aproveitar créditos do novo sistema. O impacto varia conforme o seu setor " +
  "e seus clientes — por isso, simule abaixo e converse com o seu contador.";
