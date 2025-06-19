"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="bg-theme py-10 text-center text-white border-t border-white/10">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-7xl mx-auto px-6"
			>
				<p className="text-lg mb-4">
					&copy; {new Date().getFullYear()} HuyBoon. All rights reserved.
				</p>
				<div className="flex justify-center gap-6">
					<motion.a
						href="https://github.com/HuyBoon"
						target="_blank"
						rel="noopener noreferrer"
						whileHover={{ scale: 1.1 }}
						className="text-content/50 hover:text-hover transition-colors"
					>
						<FaGithub className="w-6 h-6" />
					</motion.a>
					<motion.a
						href="https://linkedin.com"
						target="_blank"
						rel="noopener noreferrer"
						whileHover={{ scale: 1.1 }}
						className="text-content/50 hover:text-hover transition-colors"
					>
						<FaLinkedin className="w-6 h-6" />
					</motion.a>
				</div>
			</motion.div>
		</footer>
	);
};

export default Footer;
