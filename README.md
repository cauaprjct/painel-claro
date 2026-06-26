# Painel Claro — financeiro e impostos sem complicação

> **Demonstração (dados fictícios).** Painel *white-label* que um escritório de contabilidade entrega ao
> seu cliente PJ para ver faturamento, despesas, impostos (DAS/Simples) e o impacto da **Reforma
> Tributária 2026** — em linguagem simples. Feito por **Cauã Alves** (Dados, BI & Automação).

🔗 **Demo ao vivo:** https://painel-contador.vercel.app

## O problema
Escritórios de contabilidade pequenos entregam o financeiro do cliente em **PDF/planilha técnica** que o
dono da empresa (leigo) **não entende**. Resultado: o cliente liga toda hora ("quanto vou pagar?") e não
percebe o valor do contador. Em 2026 isso piora: a **Reforma Tributária** (CBS/IBS) começa a transição e
ninguém entende "como fica comigo".

## A solução
Um painel simples, bonito e com a **marca do escritório**, que o contador entrega ao cliente:
- **Resumo em 1 frase** ("você faturou X, gastou Y, sobrou Z; próximo DAS é W, vence dia DD").
- **KPIs + gráficos** (faturamento, para onde vai o dinheiro, entrou×saiu, % que vira imposto).
- **Impostos explicados** sem jargão + próximos prazos.
- **Seção Reforma 2026** com simulador ilustrativo (rotulado como estimativa educativa, não cálculo oficial).
- **Planilha → painel:** suba um CSV e o painel se redesenha na hora (processado no navegador, nada sai dele).

## Stack e decisões
- **Next.js 14 + Vercel** · **Recharts** (gráficos) · **papaparse** (CSV no cliente) · CSS próprio (sem framework).
- Sem backend/login no v1 — é uma vitrine pública. Processamento de CSV **client-side** (privacidade + robustez).
- Dados de exemplo **fictícios e rotulados**; simulador da Reforma **educativo** (sem responsabilidade fiscal).

## Rodar localmente
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

## Roadmap (versão paga / produto real)
- Login do contador + **multi-cliente** (uma conta, vários clientes PJ).
- **White-label dinâmico** (logo/cor por escritório).
- Ingestão automática (integração com sistema contábil / planilha agendada via Python).
- Exportar PDF, alertas por e-mail/WhatsApp, módulo de honorários.

## Quer um assim, com a marca do seu escritório?
Falo com você: **cauaalvesbalbino@gmail.com** · [LinkedIn](https://www.linkedin.com/in/caua-alves-0975a129b/) · [GitHub](https://github.com/cauaprjct)
