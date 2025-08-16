"use client";

import { useState } from "react";
import AsideCustomer from "./AsideCustomer";
import AdminHeader from "./AdminHeader";
import FooterNavigation from "./FooterNavigation";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import { usePathname } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";

import { navLinks } from "@/constants/navLinks";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

	return (
		<div className="relative bg-gradient-to-b from-teal-400 via-blue-200 to-[#135e3d] flex flex-col min-h-screen">
			<div className="hidden md:block">
				<AsideCustomer collapsed={collapsed} setCollapsed={setCollapsed} />
			</div>
			<AdminHeader collapsed={collapsed} />
			<main
				className={`transition-all duration-300 py-[50px] mt-10 items-center px-2 md:px-4 min-h-[calc(100vh-100px)] md:min-h-screen ${
					collapsed ? "md:ml-16" : "md:ml-64"
				}`}
			>
				{children}
			</main>
			<FooterNavigation />
		</div>
	);
}
