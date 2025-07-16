import ClientLayoutWrapper from "@/components/admin/ClientLayoutWrapper";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<main className="">
			<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
		</main>
	);
}
