"use client";

import { useEffect, useState } from "react";
import AsideCustomer from "./AsideCustomer";
import AdminHeader from "./AdminHeader";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="relative bg-light dark:bg-dark">
			<AsideCustomer collapsed={collapsed} setCollapsed={setCollapsed} />

			<AdminHeader collapsed={collapsed} />
			<main
				className={`transition-all duration-300 p-4 ${
					collapsed ? "ml-16" : "ml-64"
				} pt-[64px]  min-h-screen`}
			>
				{children}
			</main>
		</div>
	);
}
