"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/constants/navLinks";

interface NavLink {
	url: string;
	label: string;
	icon: React.ReactNode;
	submenu?: { url: string; label: string; icon: React.ReactNode }[];
}

export default function AsideCustomer({
	collapsed,
	setCollapsed,
	onSelect,
}: {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	onSelect?: () => void;
}) {
	const pathname = usePathname();
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

	const toggleMenu = (label: string) => {
		setOpenMenus((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	// Animation variants
	const sidebarVariants = {
		expanded: { width: "16rem" },
		collapsed: { width: "4rem" },
	};

	const textVariants = {
		expanded: { opacity: 1, x: 0 },
		collapsed: { opacity: 0, x: -20 },
	};

	const submenuVariants = {
		expanded: { height: "auto", opacity: 1 },
		collapsed: { height: 0, opacity: 0 },
	};

	const animationDuration = 0.3;

	return (
		<motion.aside
			className="fixed left-0 top-0 shadow-md z-30 min-h-screen overflow-y-auto bg-gray-900 text-gray-100 border-r border-gray-700"
			initial={collapsed ? "collapsed" : "expanded"}
			animate={collapsed ? "collapsed" : "expanded"}
			variants={sidebarVariants}
			transition={{ duration: animationDuration, ease: "easeInOut" }}
		>
			{/* Header */}
			<div className="flex items-center justify-between px-3 py-3 border-b border-gray-700">
				<motion.h1
					className={`mx-auto font-bold text-2xl text-blue-400 transition-all ${
						collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
					}`}
					variants={textVariants}
					transition={{ duration: animationDuration }}
				>
					HBoonCode
				</motion.h1>
				<span
					onClick={() => setCollapsed(!collapsed)}
					className="cursor-pointer text-blue-400 p-1 rounded hover:bg-gray-800 transition-all"
				>
					{collapsed ? (
						<AiOutlineMenuUnfold size={22} />
					) : (
						<AiOutlineMenuFold size={22} />
					)}
				</span>
			</div>

			{/* Navigation menu */}
			<div className="flex-grow h-[calc(100vh-130px)] mt-2 overflow-y-auto">
				<ul className="space-y-1 px-2">
					{navLinks.map((item) => {
						const isItemActive = isActive(item.url);
						const hasSubmenu = item.submenu && item.submenu.length > 0;

						return (
							<li key={item.url} className="relative group">
								<div
									className={`flex items-center justify-between gap-2 rounded-md px-3 py-3 cursor-pointer transition-colors ${
										isItemActive
											? "bg-blue-600 text-white font-semibold"
											: "hover:bg-gray-800 text-gray-300"
									}`}
								>
									<Link
										href={item.url}
										className="flex items-center gap-3 w-full"
										onClick={onSelect}
									>
										<div className="flex-shrink-0">{item.icon}</div>
										<AnimatePresence>
											{!collapsed && (
												<motion.span
													className="text-sm font-medium"
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: -10 }}
													transition={{ duration: animationDuration }}
												>
													{item.label}
												</motion.span>
											)}
										</AnimatePresence>
									</Link>

									{hasSubmenu && !collapsed && (
										<button
											onClick={() => toggleMenu(item.label)}
											className="ml-auto hover:text-white"
										>
											{openMenus[item.label] ? (
												<ChevronDown size={16} />
											) : (
												<ChevronRight size={16} />
											)}
										</button>
									)}
								</div>

								{/* Tooltip for collapsed state */}
								{collapsed && (
									<span className="fixed z-50 left-16 ml-1 top-auto translate-y-[-50%] text-white bg-gray-800 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none group-hover:opacity-100 opacity-0 transition-all duration-200">
										{item.label}
									</span>
								)}

								{/* Submenu */}
								<AnimatePresence>
									{hasSubmenu && openMenus[item.label] && !collapsed && (
										<motion.ul
											className="ml-8 mt-1 space-y-1"
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
														onClick={onSelect}
														className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${
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
							</li>
						);
					})}
				</ul>
			</div>

			{/* Footer */}
			<div className="px-4 py-3 border-t border-gray-700">
				<motion.h4
					className="text-center font-bold text-sm text-gray-400"
					variants={textVariants}
					transition={{ duration: animationDuration }}
				>
					© 2025 HBCode
				</motion.h4>
			</div>
		</motion.aside>
	);
}
