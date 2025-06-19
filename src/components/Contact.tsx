"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError(null); // Clear error on input change
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			setError("Please fill in all fields.");
			return;
		}
		const currentTime = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Ho_Chi_Minh",
			hour12: true,
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		console.log("Submitted:", { ...formData, submittedAt: currentTime });
		setIsSubmitted(true);
		setFormData({ name: "", email: "", message: "" }); // Reset form
		setTimeout(() => setIsSubmitted(false), 5000); // Hide message after 5s
	};

	return (
		<section className="relative px-4 sm:px-6 lg:px-12 xl:px-24 ">
			<div className="max-w-7xl mx-auto">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
					className="text-center mb-12 sm:mb-16"
				>
					<motion.h2
						variants={itemVariants}
						className="text-3xl sm:text-4xl md:text-5xl font-bold text-content mb-4"
					>
						Get in <span className="text-primary">Touch</span>
					</motion.h2>

					<motion.div
						variants={itemVariants}
						className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full mx-auto"
					/>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
					{/* Contact Info */}
					<motion.div
						variants={itemVariants}
						className="p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
					>
						<h3 className="text-xl sm:text-2xl font-semibold text-content mb-4">
							Contact Information
						</h3>
						<p className="text-content/80 mb-4">
							Feel free to connect with me through the following channels:
						</p>
						<ul className="space-y-4">
							<li className="flex items-center gap-3">
								<FaEnvelope className="text-primary w-5 h-5" />
								<span className="text-content">huybooncode74@gmail.com</span>
							</li>
							<li className="flex items-center gap-3">
								<FaLinkedin className="text-primary w-5 h-5" />
								<a
									href="https://www.linkedin.com/in/nh%E1%BA%ADt-huy-299334344/"
									target="_blank"
									className="text-content hover:text-primary transition-colors"
								>
									LinkedIn
								</a>
							</li>
							<li className="flex items-center gap-3">
								<FaGithub className="text-primary w-5 h-5" />
								<a
									href="https://github.com/HuyBoon"
									target="_blank"
									className="text-content hover:text-primary transition-colors"
								>
									GitHub
								</a>
							</li>
						</ul>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						variants={itemVariants}
						className=" p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
					>
						<h3 className="text-xl sm:text-2xl font-semibold text-content mb-6">
							Send Me a Message
						</h3>
						{isSubmitted && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								aria-live="polite"
								className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
							>
								Thank you! Message submitted at 08:51 PM +07, Wednesday, June
								18, 2025.
							</motion.div>
						)}
						{error && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
							>
								{error}
							</motion.div>
						)}
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-content mb-2">
									Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									placeholder="Your Name"
									className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-content mb-2">
									Email
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									placeholder="your.email@example.com"
									className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-content mb-2">
									Message
								</label>
								<textarea
									name="message"
									rows={4}
									value={formData.message}
									onChange={handleChange}
									required
									placeholder="Your message here..."
									className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition"
								></textarea>
							</div>
							<motion.button
								variants={itemVariants}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								className="cursor-pointer w-full relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
							>
								Send Message
							</motion.button>
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
