// src/components/admin/ClientLayoutWrapper.tsx
"use client";

import { useState } from "react";
import AsideCustomer from "./AsideCustomer";
import AdminHeader from "./AdminHeader";
import FooterNavigation from "./FooterNavigation";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import { usePathname } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext"; // Cập nhật import
import { Snackbar, Alert } from "@mui/material";
import { navLinks } from "@/constants/navLinks";

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const { snackbar, showSnackbar, closeSnackbar } = useSnackbar(); // Sử dụng context

	const getBreadcrumbItems = () => {
		const dashboardLink = navLinks.find(
			(link) => link.url === "/admin/dashboard"
		);
		const baseItems = dashboardLink
			? [
					{
						label: dashboardLink.label,
						href: dashboardLink.url,
						icon: dashboardLink.icon,
					},
			  ]
			: [];

		const currentPath = pathname || "";
		const mainLink = navLinks.find((link) => currentPath.startsWith(link.url));
		if (!mainLink) return baseItems;

		const breadcrumbItems = [...baseItems];
		if (mainLink.url !== "/admin/dashboard") {
			breadcrumbItems.push({
				label: mainLink.label,
				href: mainLink.url,
				icon: mainLink.icon,
			});
		}

		if (mainLink.submenu) {
			const subLink = mainLink.submenu.find((sub) => currentPath === sub.url);
			if (subLink) {
				breadcrumbItems.push({
					label: subLink.label,
					icon: subLink.icon,
					href: subLink.url,
				});
			}
		}

		return breadcrumbItems;
	};

	return (
		<div className="relative bg-light flex flex-col min-h-screen">
			<div className="hidden md:block">
				<AsideCustomer collapsed={collapsed} setCollapsed={setCollapsed} />
			</div>
			<AdminHeader collapsed={collapsed} />
			<main
				className={`transition-all duration-300 py-[50px] mt-10 items-center px-2 md:px-4 min-h-[calc(100vh-100px)] md:min-h-screen ${
					collapsed ? "md:ml-16" : "md:ml-64"
				}`}
			>
				<CustomBreadcrumbs items={getBreadcrumbItems()} navLinks={navLinks} />
				{children}
			</main>
			<FooterNavigation />
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={closeSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
