import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/app/globals.css";
import TRPCProvider from "@/components/TRPCProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Daily Balance Tracker",
  description: "24-hour work-life balance tracker for distributed agile teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
        <ThemeProvider defaultTheme="light" storageKey="dbt-theme">
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
