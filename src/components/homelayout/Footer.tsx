"use client";
import React from "react";
import { motion } from "framer-motion";

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
					&copy; {new Date().getFullYear()} HBoonCode. All rights reserved.
				</p>
			</motion.div>
		</footer>
	);
};

export default Footer;
