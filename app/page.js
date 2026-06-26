"use client";
import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { SEED, EMPRESA_DEMO } from "../lib/seed";
import {
  BRL, PCT, resumo, serieFaturamento, serieFluxo, serieCarga, composicaoDespesas, prazos, dataBR,
} from "../lib/compute";
import { csvParaDataset, validaDataset } from "../lib/csv";
import { projetaReforma, REFORMA_TEXTO } from "../lib/reforma";

const BRAND = "#0F766E";
const DONUT = ["#0F766E", "#0EA5A4", "#3B82F6", "#F59E0B", "#94A3B8", "#A855F7"];
const CONTATO = {
  email: "cauaalvesbalbino@gmail.com",
  linkedin: "https://www.linkedin.com/in/caua-alves-0975a129b/",
  github: "https://github.com/cauaprjct",
};

export default function Painel() {
  const [dataset, setDataset] = useState(SEED);
  const [empresa, setEmpresa] = useState(EMPRESA_DEMO.nome);
  const [periodo, setPeriodo] = useState("mes");
  const [msg, setMsg] = useState(null);
  // reforma
  const [aliquotaRef, setAliquotaRef] = useState(8);
  const [credito, setCredito] = useState(20);
  const fileRef = useRef();

  const r = useMemo(() => resumo(dataset, periodo), [dataset, periodo]);
  const rAno = useMemo(() => resumo(dataset, "ano"), [dataset]);
  const sFat = useMemo(() => serieFaturamento(dataset), [dataset]);
  const sFluxo = useMemo(() => serieFluxo(dataset), [dataset]);
  const sCarga = useMemo(() => serieCarga(dataset), [dataset]);
  const desp = useMemo(() => composicaoDespesas(dataset, periodo), [dataset, periodo]);
  const prox = useMemo(() => prazos(dataset), [dataset]);
  const ref = useMemo(
    () => projetaReforma(rAno.fat, rAno.cargaPct, { aliquotaRef, creditoAproveitadoPct: credito }),
    [rAno, aliquotaRef, credito]
  );

  const labelPeriodo = periodo === "ano" ? "nos últimos 12 meses" : periodo === "tri" ? "no trimestre" : "no mês";

  function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        try {
          const ds = csvParaDataset(res.data);
          const v = validaDataset(ds);
          if (!v.ok) { setMsg({ t: "err", m: v.erro }); return; }
          setDataset(ds); setEmpresa(file.name.replace(/\.csv$/i, "")); setPeriodo("ano");
          setMsg({ t: "ok", m: `Painel atualizado com ${ds.length} mês(es) da sua planilha.` });
        } catch { setMsg({ t: "err", m: "Não consegui ler esse CSV. Use o modelo." }); }
      },
      error: () => setMsg({ t: "err", m: "Falha ao ler o arquivo." }),
    });
    if (fileRef.current) fileRef.current.value = "";
  }
  function usarExemplo() { setDataset(SEED); setEmpresa(EMPRESA_DEMO.nome); setMsg(null); }

  return (
    <>
      <div className="demo-bar">
        Demonstração com <b>dados fictícios</b> · feito por Cauã (Dados, BI &amp; Automação)
      </div>

      <header className="app-head">
        <div className="wrap">
          <div className="brand-row">
            <div className="brand-logo">P</div>
            <div>
              <div className="nome">Painel Claro</div>
              <div className="sub">fornecido por <b>[Seu Escritório de Contabilidade]</b></div>
            </div>
          </div>
          <div className="head-actions">
            <div className="filtro" role="tablist" aria-label="Período">
              {[["mes", "Mês"], ["tri", "Trimestre"], ["ano", "Ano"]].map(([k, t]) => (
                <button key={k} className={periodo === k ? "on" : ""} onClick={() => setPeriodo(k)}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* Resumo plain-PT */}
        <div className="resumo">
          <div className="tag">{empresa} · resumo {labelPeriodo}</div>
          <div className="lead">
            Você faturou <b>{BRL(r.fat)}</b>, gastou <b>{BRL(r.desp)}</b> e pagou <b>{BRL(r.das)}</b> de
            imposto — {r.sobra >= 0 ? <>sobrou <b>{BRL(r.sobra)}</b>.</> : <>ficou <b>{BRL(r.sobra)}</b> no vermelho.</>}{" "}
            {r.dasVenc && <>Seu próximo DAS é <b>{BRL(r.dasUlt)}</b>, vence dia <b>{dataBR(r.dasVenc)}</b>.</>}
          </div>
        </div>

        {/* KPIs */}
        <div className="kpis">
          <div className="kpi"><div className="label">Faturamento</div><div className="value num">{BRL(r.fat)}</div><div className="meta">Acumulado 12m: {BRL(r.fatAcum)}</div></div>
          <div className="kpi"><div className="label">Despesas</div><div className="value num">{BRL(r.desp)}</div></div>
          <div className={"kpi " + (r.sobra >= 0 ? "pos" : "neg")}><div className="label">Sobra (lucro)</div><div className="value num">{BRL(r.sobra)}</div></div>
          <div className="kpi warn"><div className="label">DAS a pagar</div><div className="value num">{BRL(r.dasUlt)}</div><div className="meta">Vence {dataBR(r.dasVenc)}</div></div>
          <div className="kpi"><div className="label">A receber</div><div className="value num">{BRL(r.aReceberTotal)}</div><div className="meta">{r.aReceber.length} lançamento(s)</div></div>
        </div>

        {/* Gráficos */}
        <div className="section">
          <div className="grid2">
            <div className="card">
              <h3>Faturamento mês a mês</h3><div className="csub">últimos 12 meses</div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sFat} margin={{ left: -10, right: 8, top: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5B6B7C" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5B6B7C" }} tickFormatter={(v) => "R$" + v / 1000 + "k"} />
                    <Tooltip formatter={(v) => BRL(v)} />
                    <Bar dataKey="Faturamento" fill={BRAND} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3>Para onde vai o dinheiro</h3><div className="csub">composição das despesas {labelPeriodo}</div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={desp} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                      {desp.map((e, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => BRL(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3>Entrou x Saiu</h3><div className="csub">fluxo de caixa nos 12 meses</div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sFluxo} margin={{ left: -10, right: 8, top: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5B6B7C" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5B6B7C" }} tickFormatter={(v) => "R$" + v / 1000 + "k"} />
                    <Tooltip formatter={(v) => BRL(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Entradas" stroke="#0F766E" fill="#CDEBE8" />
                    <Area type="monotone" dataKey="Saídas" stroke="#B45309" fill="#FBE8CF" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3>Quanto do faturamento vira imposto</h3><div className="csub">carga tributária (%) por mês</div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sCarga} margin={{ left: -10, right: 8, top: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5B6B7C" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#5B6B7C" }} tickFormatter={(v) => v + "%"} />
                    <Tooltip formatter={(v) => v + "%"} />
                    <Line type="monotone" dataKey="Carga" stroke={BRAND} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Impostos + Prazos */}
        <div className="section">
          <div className="grid2">
            <div className="card">
              <h3>Seus impostos, explicados</h3><div className="csub">simples e direto</div>
              <p style={{ margin: ".4rem 0 1rem" }}>
                Do que você faturou {labelPeriodo}, <span className="bigpct">{PCT(r.cargaPct)}</span> foi imposto (DAS do Simples).
              </p>
              <div className="imp-row"><span>Faturamento</span><b className="num">{BRL(r.fat)}</b></div>
              <div className="imp-row"><span>DAS (Simples Nacional)<div className="desc">imposto único que reúne vários tributos</div></span><b className="num">{BRL(r.das)}</b></div>
              <div className="imp-row"><span>Sobra depois dos custos e impostos</span><b className="num">{BRL(r.sobra)}</b></div>
            </div>
            <div className="card">
              <h3>Próximos prazos</h3><div className="csub">não perca vencimento</div>
              {prox.slice(0, 6).map((p, i) => (
                <div className={"prazo" + (!p.receber ? " alert" : "")} key={i}>
                  <span>{p.tipo}<div className="desc" style={{ color: "var(--muted)", fontSize: ".8rem" }}>{p.receber ? "entrada" : "a pagar"}</div></span>
                  <span style={{ textAlign: "right" }}><div className="num"><b>{BRL(p.valor)}</b></div><div className="when">{dataBR(p.data)}</div></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reforma */}
        <div className="section">
          <div className="reforma">
            <h2>Como a Reforma Tributária 2026 te afeta</h2>
            <div className="csub" style={{ marginBottom: ".6rem" }}>simule de forma simples</div>
            <span className="edu">Estimativa educativa — não é cálculo oficial. Confirme com o seu contador.</span>
            <p style={{ color: "var(--muted)", fontSize: ".92rem", marginBottom: "1rem" }}>{REFORMA_TEXTO}</p>
            <div className="slider-row">
              <label>Alíquota de referência ilustrativa: <b>{aliquotaRef}%</b></label>
              <input type="range" min="4" max="20" step="0.5" value={aliquotaRef} onChange={(e) => setAliquotaRef(+e.target.value)} />
            </div>
            <div className="slider-row">
              <label>Quanto de crédito você aproveitaria: <b>{credito}%</b></label>
              <input type="range" min="0" max="80" step="5" value={credito} onChange={(e) => setCredito(+e.target.value)} />
            </div>
            <div className="compare">
              <div className="box hoje"><div className="csub">Carga estimada hoje (ano)</div><div className="v num">{BRL(ref.cargaHoje)}</div><div className="csub">{PCT(rAno.cargaPct)} do faturamento</div></div>
              <div className="box depois"><div className="csub">Projeção ilustrativa</div><div className="v num">{BRL(ref.cargaDepois)}</div><div className="csub">{PCT(ref.cargaDepoisPct)} do faturamento · {ref.variacao >= 0 ? "+" : ""}{PCT(ref.variacao)}</div></div>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="section">
          <div className="upload">
            <h2 style={{ marginBottom: ".3rem" }}>Veja com os SEUS números</h2>
            <p>Suba uma planilha CSV no formato modelo e o painel se redesenha na hora. Nada sai do seu navegador.</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onUpload} style={{ display: "none" }} id="csvin" />
            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap" }}>
              <label htmlFor="csvin" className="btn btn-primary" style={{ cursor: "pointer" }}>Subir planilha (CSV)</label>
              <a className="btn btn-ghost" href="/modelo-painel-claro.csv" download>Baixar CSV-modelo</a>
              {dataset !== SEED && <button className="btn btn-ghost" onClick={usarExemplo}>Voltar ao exemplo</button>}
            </div>
            {msg && <div className={"msg " + (msg.t === "ok" ? "ok" : "err")}>{msg.m}</div>}
          </div>
        </div>

        {/* CTA */}
        <div className="cta">
          <h2>Quer um painel assim, com a marca do seu escritório?</h2>
          <p>Eu monto pro seu escritório de contabilidade entregar aos clientes — financeiro, impostos e a Reforma explicada, com o seu nome e a sua cor. Personalizável e simples de usar.</p>
          <div className="acts">
            <a className="btn btn-primary" href={"mailto:" + CONTATO.email + "?subject=Quero um Painel Claro pro meu escritório"}>Falar por e-mail</a>
            <a className="btn btn-ghost" href={CONTATO.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a className="btn btn-ghost" href={CONTATO.github} target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </main>

      <footer className="app-foot">
        <div className="wrap">
          Painel Claro · demonstração com dados fictícios · desenvolvido por Cauã Alves (Dados, BI &amp; Automação).
        </div>
      </footer>
    </>
  );
}
