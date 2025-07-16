import HBHeader from "@/components/auth/HBHeader";
import Footer from "@/components/homelayout/Footer";

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<HBHeader />
			<div className="min-h-screen bg-gray-800">{children}</div>
			<Footer />
		</>
	);
}
