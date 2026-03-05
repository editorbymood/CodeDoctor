import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Code Doctor — AI-Powered Code Review Platform",
  description: "Submit code in any language and receive AI-driven reviews, security audits, performance suggestions, and auto-refactored versions using multi-agent LLM pipelines.",
  keywords: ["code review", "AI", "security audit", "refactoring", "code quality", "multi-agent"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
