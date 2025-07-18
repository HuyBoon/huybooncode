import Footer from "@/components/homelayout/Footer";
import Header from "@/components/homelayout/Header";
import DefaltFooter from "@/components/services/DefaltFooter";
import DefaultHeader from "@/components/services/DefaultHeader";
import { ReactNode } from "react";

export default function ServiceLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<DefaultHeader />
			{children}
			<DefaltFooter />
		</>
	);
}
