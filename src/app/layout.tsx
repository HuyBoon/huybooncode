import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "../context/AppContext";

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	variable: "--font-roboto-mono",
	weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "HBoonCode. ",
	description: "HuyBoonCode.'s Portfolio",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${robotoMono.variable} antialiased`}>
				<AppProvider>{children}</AppProvider>
				<Toaster position="top-right" theme="light" richColors />
			</body>
		</html>
	);
}
