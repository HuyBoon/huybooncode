"use client";

import { useEffect, useState } from "react";
import AsideCustomer from "./AsideCustomer";
import AdminHeader from "./AdminHeader";
import FooterNavigation from "./FooterNavigation";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="relative bg-light flex flex-col min-h-screen">
			{/* Sidebar hidden on mobile, visible on md screens and up */}
			<div className="hidden md:block">
				<AsideCustomer collapsed={collapsed} setCollapsed={setCollapsed} />
			</div>
			<AdminHeader collapsed={collapsed} />
			<main
				className={`transition-all duration-300 p-4 pt-[64px] min-h-[calc(100vh-64px)] md:min-h-screen ${
					collapsed ? "md:ml-16" : "md:ml-64"
				}`}
			>
				{children}
			</main>
			<FooterNavigation />
		</div>
	);
}
