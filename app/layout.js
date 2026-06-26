import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Painel Claro — financeiro e impostos do seu negócio, sem complicação",
  description:
    "Painel que o seu contador entrega: faturamento, despesas, impostos (DAS) e o impacto da Reforma Tributária 2026, em linguagem simples. Demonstração com dados fictícios.",
};

export const viewport = { themeColor: "#0f766e" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230f766e'/%3E%3Ctext x='50' y='70' font-family='Arial,sans-serif' font-size='62' font-weight='800' fill='white' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
