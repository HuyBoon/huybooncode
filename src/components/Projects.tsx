"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import {
	SiFirebase,
	SiNextdotjs,
	SiTailwindcss,
	SiTypescript,
} from "react-icons/si";

const techIcons: Record<string, React.ReactNode> = {
	React: <FaReact className="w-5 h-5 text-[#61DAFB]" />,
	"Next.js": <SiNextdotjs className="w-5 h-5 text-black" />,
	Tailwind: <SiTailwindcss className="w-5 h-5 text-[#06B6D4]" />,
	TypeScript: <SiTypescript className="w-5 h-5 text-[#3178C6]" />,
	Firebase: <SiFirebase className="w-5 h-5 text-[#FFCA28]" />,
	"Node.js": <FaNodeJs className="w-5 h-5 text-[#339933]" />,
	HTML: <FaHtml5 className="w-5 h-5 text-[#e34c26]" />,
	CSS: <FaCss3Alt className="w-5 h-5 text-[#264de4]" />,
};

const projects = [
	{
		title: "E-commerce Website",
		description:
			"An online store featuring product management, shopping cart, and user authentication, built with Next.js and TypeScript.",
		tech: ["React", "Next.js", "Tailwind"],
		image: "/projects/ecommerce.png",
		demoLink: "https://kimvinhstore.vercel.app/",
		status: "Completed",
	},
	{
		title: "Phú Quốc's Travel Website",
		description:
			"A travel website showcasing destinations, tours, and travel guides for Phú Quốc with a user-friendly interface.",
		tech: ["TypeScript", "Node.js", "Tailwind"],
		image: "/projects/tour.png",
		demoLink: "https://hiddensun.vn/",
		status: "Completed",
	},
	{
		title: "Blog Platform",
		description:
			"A blogging platform where users can read, write, and manage blog posts, with support for multilingual content.",
		tech: ["React", "Firebase", "Tailwind"],
		image: "/projects/blog.png",
		demoLink: "https://mereview.vercel.app/vi",
		status: "Completed",
	},
	{
		title: "Kyles Skincare",
		description:
			"A landing page for a skincare brand designed to showcase products, introduce the brand story, and collect customer leads through a contact form. The website is responsive and optimized for marketing campaigns.",
		tech: ["React", "Next.js", "TypeScript", "Tailwind"],
		image: "/projects/landing.png",
		demoLink: "https://kyleskincare.vn/",
		status: "Completed",
	},
];

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5 },
	},
};

const cardVariants = {
	hover: {
		boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
	},
};

export default function Projects() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleMouseEnter = (index: number) => {
		setActiveIndex(index);
		if (typeof window !== "undefined" && window.innerWidth <= 768) {
			setTimeout(() => {
				setActiveIndex(null);
			}, 1000);
		}
	};

	const handleMouseLeave = () => {
		if (typeof window !== "undefined" && window.innerWidth > 768) {
			setActiveIndex(null);
		}
	};

	return (
		<section className="relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
					className="text-center mb-12 sm:mb-16"
				>
					<motion.h2
						variants={itemVariants}
						className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-3 sm:mb-4"
					>
						Featured
						<span className="text-primary"> Projects</span>
					</motion.h2>
					<motion.div
						variants={itemVariants}
						className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full mx-auto"
					/>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 relative z-10">
					{projects.map((project, index) => (
						<motion.div
							key={index}
							variants={cardVariants}
							whileHover="hover"
							onMouseEnter={() => handleMouseEnter(index)}
							onMouseLeave={handleMouseLeave}
							onClick={() => handleMouseEnter(index)}
							className="group relative rounded-xl overflow-hidden cursor-pointer border border-gray-200 shadow-lg shadow-white/10 transition-transform duration-300 ease-in-out "
						>
							<div className="relative aspect-[2/1] overflow-hidden">
								<div
									className={`absolute inset-0 pointer-events-none z-10 ${
										activeIndex === index
											? "after:animate-[shineEffect_1s_ease-out_forwards]"
											: ""
									} after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:w-[200%] after:h-0 after:translate-x-[-50%] after:translate-y-[-50%] after:rotate-[-45deg] after:bg-white/30 after:z-10`}
								/>
								<Image
									src={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 1000px) 100vw, (max-width: 1000px) 50vw, 33vw"
									className={`object-cover transition-transform duration-500 ease-out ${
										activeIndex === index ? "" : ""
									}`}
								/>
								<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>

							<div className="p-6 flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-1">
										<h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-primary transition-colors">
											{project.title}
										</h3>
									</div>
									<p className="text-sm sm:text-base text-content/70 mb-4 line-clamp-3 min-h-[60px]">
										{project.description}
									</p>
									<div className="flex sm:items-center flex-col md:flex-row md:justify-between gap-4">
										<div className="flex flex-wrap gap-2">
											{project.tech.map((tech, i) => (
												<span
													key={i}
													className="px-2 py-1 rounded-full bg-white text-black text-xs sm:text-sm border border-gray-300 hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
												>
													{techIcons[tech]}
													{tech}
												</span>
											))}
										</div>
										<div>
											<Link
												href={project.demoLink}
												target="_blank"
												rel="noopener noreferrer"
												className="mx-auto px-2 py-1 w-[100px] text-center block rounded-full text-sm sm:text-base text-content bg-primary "
											>
												View Demo
											</Link>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
					transition={{ delay: 0.4 }}
					className="flex justify-center mt-12 sm:mt-16"
				>
					<button
						className="cursor-pointer  relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[#7c3aed] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
						aria-label="View all projects"
					>
						<span className="relative z-10">View All Projects</span>
					</button>
				</motion.div>
			</div>
		</section>
	);
}
