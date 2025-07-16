"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Github, Linkedin, LogIn, User } from "lucide-react";
import { Settings, Bell, Heart, LogOut, ShoppingBag } from "lucide-react";

import { useUser } from "@/context/AppContext";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const socialLinks = {
	github: "https://github.com/HuyBoon",
	linkedin: "https://www.linkedin.com/in/nh%E1%BA%ADt-huy-299334344/",
};

const HBHeader = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { scrollY } = useScroll();
	const { user, status } = useUser();

	const router = useRouter();
	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 50);
	});

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/login" });
		router.push("/login");
	};

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`fixed w-full z-50 transition-all duration-300 ease-out ${
				isScrolled
					? " backdrop-blur-xl shadow-lg"
					: "bg-transparent backdrop-blur-sm"
			}`}
		>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
				<div className="flex items-center justify-between relative z-10">
					{/* Logo Section */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
					>
						<Link
							href="/"
							scroll={true}
							className="text-lg font-bold text-white"
						>
							HuyBoonCode.
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-4 lg:gap-6">
						<div className="flex items-center gap-4">
							{status === "authenticated" ? (
								<div className="flex items-center gap-2">
									<Image
										src={user?.avatar || "/avatar.png"}
										alt="User Avatar"
										width={36}
										height={36}
										className="rounded-full border border-gray-300"
									/>

									<div className="hidden md:block">
										<p className="text-sm font-medium text-white">
											{user?.name}
										</p>
									</div>

									<button
										onClick={handleLogout}
										className="p-2 hover:bg-slate-200 rounded-full cursor-pointer"
										title="Logout"
									>
										<LogOut size={18} />
									</button>
								</div>
							) : (
								<button
									onClick={() => router.push("/login")}
									className="flex items-center gap-2 px-3 py-1.5 bg-primary cursor-pointer text-white rounded-lg hover:bg-blue-600 transition"
								>
									<LogIn size={18} />
									<span className="text-sm font-medium">Login</span>
								</button>
							)}
						</div>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors"
						aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
					>
						{isMenuOpen ? (
							<XMarkIcon className="h-6 w-6 text-white" />
						) : (
							<Bars3Icon className="h-6 w-6 text-white" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="md:hidden mt-4 pb-6 bg-[#130f32]/95 backdrop-blur-lg rounded-lg shadow-lg"
					>
						<div className="flex items-center gap-4">
							{status === "authenticated" ? (
								<div className="flex items-center gap-2">
									<Image
										src={user?.avatar || "/avatar.png"}
										alt="User Avatar"
										width={36}
										height={36}
										className="rounded-full border border-gray-300"
									/>

									<div className="hidden md:block">
										<p className="text-sm font-medium text-white">
											{user?.name}
										</p>
									</div>

									<button
										onClick={handleLogout}
										className="p-2 hover:bg-slate-200 rounded-full cursor-pointer"
										title="Logout"
									>
										<LogOut size={18} />
									</button>
								</div>
							) : (
								<button
									onClick={() => router.push("/login")}
									className="flex items-center gap-2 px-3 py-1.5 bg-primary cursor-pointer text-white rounded-lg hover:bg-blue-600 transition"
								>
									<LogIn size={18} />
									<span className="text-sm font-medium">Login</span>
								</button>
							)}
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
};

export default HBHeader;
