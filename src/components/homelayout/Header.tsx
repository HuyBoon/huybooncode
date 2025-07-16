"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Github, Linkedin } from "lucide-react";

const navItems = [
	{ name: "About", href: "/#about" },
	{ name: "Skills", href: "/#skills" },
	{ name: "Projects", href: "/#projects" },
	{ name: "Experiences", href: "/#experience" },
	{ name: "Contact", href: "/#contact" },
];

const socialLinks = {
	github: "https://github.com/HuyBoon",
	linkedin: "https://www.linkedin.com/in/nh%E1%BA%ADt-huy-299334344/",
};

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [language, setLanguage] = useState("VN");

	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 50);
	});

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
							className="text-lg font-bold text-primary"
						>
							HuyBoonCode.
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-4 lg:gap-6">
						<div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shadow-md">
							{navItems.map((item, i) => (
								<motion.div
									key={item.name}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Link
										href={item.href}
										scroll={true}
										className="px-3 py-1.5 text-sm lg:text-base text-white hover:text-primary transition-colors rounded-lg"
										aria-label={`Điều hướng tới ${item.name}`}
									>
										{item.name}
									</Link>
								</motion.div>
							))}
						</div>

						<div className="h-6 w-px bg-white/20 mx-2" />

						<div className="flex items-center gap-2">
							<Link
								href={socialLinks.github}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors"
								aria-label="Truy cập GitHub HuyBoonCode."
							>
								<Github className="h-5 w-5 text-white hover:text-primary transition-colors" />
							</Link>
							<Link
								href={socialLinks.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors"
								aria-label="Truy cập LinkedIn HuyBoonCode"
							>
								<Linkedin className="h-5 w-5 text-white hover:text-primary transition-colors" />
							</Link>
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
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								scroll={true}
								onClick={() => setIsMenuOpen(false)}
								className="block px-4 py-2 text-base text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
								aria-label={`Điều hướng tới ${item.name}`}
							>
								{item.name}
							</Link>
						))}
						<div className="pt-4 border-t border-white/10 flex items-center gap-4 px-4">
							<Link
								href={socialLinks.github}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors"
								aria-label="Truy cập GitHub DHU-TECH"
							>
								<Github className="h-5 w-5 text-white hover:text-primary transition-colors" />
							</Link>
							<Link
								href={socialLinks.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors"
								aria-label="Truy cập LinkedIn DHU-TECH"
							>
								<Linkedin className="h-5 w-5 text-white hover:text-primary transition-colors" />
							</Link>
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
};

export default Header;
