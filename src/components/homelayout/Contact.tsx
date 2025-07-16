"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";

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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			toast.error("Please fill in all fields.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to send email.");
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
			toast.success("Thank you! Your message has been sent successfully.", {
				duration: 5000,
			});
			setFormData({ name: "", email: "", message: "" }); // Reset form
		} catch (err) {
			toast.error("Something went wrong. Please try again later.");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="relative px-4 sm:px-6 lg:px-12 xl:px-24">
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
						<motion.div
							variants={itemVariants}
							className="hidden sm:block mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
						>
							<Image
								src={"/huybooncode.png"}
								alt="huybooncode."
								width={600}
								height={400}
							/>
						</motion.div>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						variants={itemVariants}
						className="p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
					>
						<h3 className="text-xl sm:text-2xl font-semibold text-content mb-6">
							Send Me a Message
						</h3>
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
								disabled={isSubmitting}
								className={`cursor-pointer w-full relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[#7c3aed] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all ${
									isSubmitting ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isSubmitting ? "Sending..." : "Send Message"}
							</motion.button>
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
