import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Life Dashboard — Krushang",
    description: "Personal life tracking dashboard — sleep, study, gym, habits, mood, money, and more.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
                {children}
            </body>
        </html>
    );
}
