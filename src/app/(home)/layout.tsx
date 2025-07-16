import Footer from "@/components/homelayout/Footer";
import Header from "@/components/homelayout/Header";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
