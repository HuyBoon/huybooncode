"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Phone, Mail } from "lucide-react";

const navItems = [
	{ name: "Dịch vụ", href: "/huyboon/services" },
	{ name: "Giới thiệu", href: "/huyboon/about" },
	{ name: "Liên hệ", href: "/huyboon/contact" },
];

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { scrollY } = useScroll();
	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 30);
	});

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.4 }}
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				isScrolled
					? "bg-[#1e1b3a]/80 shadow-md backdrop-blur-md"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
				{/* Logo */}
				<Link
					href="/huyboon"
					className="text-xl sm:text-2xl font-bold text-yellow-400"
				>
					HuyBoon<span className="text-white">Code.</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-white hover:text-yellow-400 transition text-sm font-medium"
						>
							{item.name}
						</Link>
					))}
					<a
						href="tel:0984181304"
						className="flex items-center gap-2 text-yellow-400 hover:text-white transition"
					>
						<Phone className="w-4 h-4" />
						0984 181 304
					</a>
				</nav>

				{/* Mobile menu button */}
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="md:hidden text-white p-2 rounded hover:bg-white/10 transition"
				>
					{isMenuOpen ? (
						<XMarkIcon className="w-6 h-6" />
					) : (
						<Bars3Icon className="w-6 h-6" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className="md:hidden bg-[#1e1b3a]/90 backdrop-blur-xl px-4 py-4"
				>
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							onClick={() => setIsMenuOpen(false)}
							className="block py-2 text-white text-base hover:text-yellow-400 transition"
						>
							{item.name}
						</Link>
					))}
					<div className="border-t border-white/10 mt-4 pt-4 flex items-center gap-2 text-yellow-400">
						<Phone className="w-4 h-4" />
						<a href="tel:0984181304">0984 181 304</a>
					</div>
				</motion.div>
			)}
		</motion.header>
	);
};

export default Header;
