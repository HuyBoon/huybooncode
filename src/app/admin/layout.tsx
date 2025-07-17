import ClientLayoutWrapper from "@/components/admin/ClientLayoutWrapper";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: "HBoonCode || Dashboard ",
	description: "HuyBoonCode.'s Portfolio",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<main className="">
			<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
		</main>
	);
}
