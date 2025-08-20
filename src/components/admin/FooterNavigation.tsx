"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	LayoutDashboard,
	NotebookPen,
	Settings,
	Shapes,
	Calendar,
	DollarSign,
	TrendingUp,
	TrendingDown,
	CheckSquare,
	Clock,
	FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
	url: string;
	label: string;
	icon: React.ReactNode;
	submenu?: { url: string; label: string; icon: React.ReactNode }[];
}

export default function FooterNavigation() {
	const pathname = usePathname();
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const toggleMenu = (label: string) => {
		setOpenMenus((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 480);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const navLinks: NavLink[] = [
		{
			url: "/admin/todolist",
			icon: <CheckSquare size={20} />,
			label: "To-Do",
		},
		{
			url: "/admin/finance",
			icon: <DollarSign size={20} />,
			label: "Finance",
		},
		{
			url: "/admin/dashboard",
			icon: <LayoutDashboard size={20} />,
			label: "Dashboard",
		},
		{
			url: "/admin/calendar",
			icon: <Calendar size={20} />,
			label: "Calendar",
		},
		{
			url: "/admin/journal",
			icon: <NotebookPen size={20} />,
			label: "Journal",
		},
		{
			url: "/admin/manageblogs",
			icon: <FileText size={20} />,
			label: "Blogs",
		},
	];

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	const submenuVariants = {
		expanded: { height: "auto", opacity: 1 },
		collapsed: { height: 0, opacity: 0 },
	};

	const animationDuration = 0.3;

	return (
		<footer className="md:hidden fixed bottom-0 left-0 right-0 bg-theme text-gray-900 z-30">
			<div className="flex justify-around items-center py-3">
				{navLinks.map((item) => {
					const isItemActive = isActive(item.url);
					const hasSubmenu = item.submenu && item.submenu.length > 0;

					return (
						<div key={item.url} className="relative group">
							<div
								className={`flex flex-col items-center px-2 py-1 cursor-pointer transition-colors ${
									isItemActive
										? "text-blue-400 font-semibold"
										: "text-gray-900 hover:text-blue-400"
								}`}
							>
								<Link href={item.url} className="flex flex-col items-center">
									<div className="flex-shrink-0">{item.icon}</div>
									{!isSmallScreen && (
										<span className="text-xs">{item.label}</span>
									)}
								</Link>
								{hasSubmenu && (
									<button
										onClick={() => toggleMenu(item.label)}
										className="ml-1 hover:text-white"
									>
										{/* Removed Chevron arrows */}
									</button>
								)}
							</div>

							<AnimatePresence>
								{hasSubmenu && openMenus[item.label] && (
									<motion.ul
										className="absolute bottom-12 left-[-100%] right-[-100%] bg-gray-800 rounded-t-md shadow-md border border-gray-700"
										variants={submenuVariants}
										initial="collapsed"
										animate="expanded"
										exit="collapsed"
										transition={{ duration: animationDuration }}
									>
										{item.submenu?.map((sub) => (
											<li key={sub.url}>
												<Link
													href={sub.url}
													className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
														isActive(sub.url)
															? "bg-blue-700 text-white font-medium"
															: "text-gray-400 hover:bg-gray-800 hover:text-white"
													}`}
												>
													<div className="flex-shrink-0">{sub.icon}</div>
													<span>{sub.label}</span>
												</Link>
											</li>
										))}
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</footer>
	);
}
