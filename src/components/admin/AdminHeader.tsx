"use client";

import { Bell, Search, LogIn, LogOut, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const AdminHeader = ({ collapsed }: { collapsed: boolean }) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	// Apply sidebar offset only on md screens and up
	const asideWidth = collapsed
		? "md:left-16 md:w-[calc(100%-4rem)]"
		: "md:left-64 md:w-[calc(100%-16rem)]";

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/login" });
		router.push("/login");
	};

	const dropdownVariants = {
		open: { opacity: 1, y: 0, height: "auto" },
		closed: { opacity: 0, y: -10, height: 0 },
	};

	return (
		<motion.header
			initial={{ y: 0 }}
			className={`absolute w-full mx-auto ${asideWidth}  z-[50] h-16 px-2 md:px-4  text-title transition-all duration-300 md:shadow  `}
		>
			<div className="w-full h-full flex items-center justify-between md:justify-between mx-auto max-w-[90%] md:max-w-full">
				<div className="flex items-center gap-2">
					<div className="hidden md:flex relative w-32 md:w-64 border border-gray-300 rounded-md bg-white">
						<Search
							className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search..."
							className="pl-8 pr-2 py-1 w-full text-[16px]  text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
						/>
					</div>
					<div className="md:hidden text-xl font-bold font-dancing text-title">
						HBoonCode.
					</div>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-2 md:gap-4">
					{/* Notifications Dropdown */}
					<div className="relative dropdown">
						<button
							onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
							className="relative p-2 rounded-full  transition-colors"
						>
							<Bell className="text-title" size={18} />
							<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
						</button>
						<AnimatePresence>
							{isNotificationsOpen && (
								<motion.div
									className="absolute right-0 mt-2 w-48 md:w-64 bg-gray-800 rounded-md shadow-lg border border-gray-700 dropdown overflow-hidden"
									variants={dropdownVariants}
									initial="closed"
									animate="open"
									exit="closed"
									transition={{ duration: 0.3 }}
								>
									<div className="p-3 text-sm text-gray-300">
										<p className="font-medium">Notifications</p>
										<ul className="mt-2 space-y-2">
											<li className="flex items-center gap-2">
												<Bell size={14} className="text-blue-500" />
												<span className="text-xs md:text-sm">
													New task assigned
												</span>
											</li>
											<li className="flex items-center gap-2">
												<Bell size={14} className="text-blue-500" />
												<span className="text-xs md:text-sm">
													Finance report updated
												</span>
											</li>
										</ul>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* User Profile Dropdown */}
					{status === "authenticated" ? (
						<div className="relative dropdown">
							<button
								onClick={() => setIsProfileOpen(!isProfileOpen)}
								className="flex items-center gap-2 p-2 rounded-full transition-colors"
							>
								<Image
									src={session.user.avatar || "/avatar.png"}
									alt="User Avatar"
									width={28}
									height={28}
									className="rounded-full border border-gray-600"
								/>
								{!collapsed && (
									<span className="text-sm font-medium text-gray-800 hidden md:block">
										{session.user.name}
									</span>
								)}
							</button>
							<AnimatePresence>
								{isProfileOpen && (
									<motion.div
										className="absolute right-0 mt-2 w-40 md:w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 dropdown overflow-hidden"
										variants={dropdownVariants}
										initial="closed"
										animate="open"
										exit="closed"
										transition={{ duration: 0.3 }}
									>
										<div className="p-3 text-sm text-gray-300">
											<p className="font-medium text-xs md:text-sm">
												{session.user.name}
											</p>
											<p className="text-xs text-gray-400 truncate hidden md:block">
												{session.user.email}
											</p>
											<hr className="my-2 border-gray-700" />
											<button
												onClick={() => router.push("/admin/profile")}
												className="w-full text-left flex items-center gap-2 py-1.5 hover:text-blue-500 transition-colors"
											>
												<User size={14} />
												<span className="text-xs md:text-sm">Profile</span>
											</button>
											<button
												onClick={() => router.push("/admin/settings")}
												className="w-full text-left flex items-center gap-2 py-1.5 hover:text-blue-500 transition-colors"
											>
												<Settings size={14} />
												<span className="text-xs md:text-sm">Settings</span>
											</button>
											<button
												onClick={handleLogout}
												className="w-full text-left flex items-center gap-2 py-1.5 hover:text-red-500 transition-colors"
											>
												<LogOut size={14} />
												<span className="text-xs md:text-sm">Logout</span>
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					) : (
						<button
							onClick={() => router.push("/login")}
							className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<LogIn size={16} />
							<span className="text-xs md:text-sm hidden md:block">Login</span>
						</button>
					)}
				</div>
			</div>
		</motion.header>
	);
};

export default AdminHeader;
