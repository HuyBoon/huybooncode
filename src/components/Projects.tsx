"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
		title: "E-commerce Platform",
		description:
			"A modern shopping experience built with Next.js and TypeScript",
		tech: ["React", "Next.js", "Tailwind"],
		image: "/projects/ecommerce.png",
		demoLink: "https://demo.com/ecommerce",
		sourceLink: "https://github.com/username/ecommerce",
		status: "Completed",
	},
	{
		title: "Analytics Dashboard",
		description: "Real-time data dashboard with robust backend integration",
		tech: ["TypeScript", "Node.js", "Tailwind"],
		image: "/projects/tour.png",
		demoLink: "https://demo.com/analytics",
		sourceLink: "https://github.com/username/analytics-dashboard",
		status: "Completed",
	},
	{
		title: "Mobile App Tracker",
		description: "Cross-platform health tracking app with Firebase backend",
		tech: ["React", "Firebase", "Tailwind"],
		image: "/projects/mobile.png",
		demoLink: "https://demo.com/mobile-tracker",
		sourceLink: "https://github.com/username/mobile-app-tracker",
		status: "Completed",
	},
	{
		title: "Task Management Tool",
		description: "Productivity app with real-time collaboration features",
		tech: ["React", "Node.js", "TypeScript", "Tailwind"],
		image: "/projects/portfolio.png",
		demoLink: "https://demo.com/taskmanager",
		sourceLink: "https://github.com/username/taskmanager",
		status: "In Progress",
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

export default function Projects() {
	return (
		<section className="py-10 sm:py-12 md:py-16 relative" id="work">
			<div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-12 xl:px-24">
				{/* Section Heading */}
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
						Featured Projects
					</motion.h2>

					<motion.div
						variants={itemVariants}
						className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full mx-auto"
					/>
				</motion.div>

				{/* Project Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 relative z-10">
					{projects.map((project, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							whileHover={{
								scale: 1.03,
								rotate: 0.5,
								boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
							}}
							className="group relative h-[450px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
						>
							{/* Image Section with Overlay */}
							<div className="h-[250px] relative">
								<Image
									src={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>

							{/* Content Section */}
							<div className="p-6 h-[200px] flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
											{project.title}
										</h3>
										<span className="text-xs sm:text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
											{project.status}
										</span>
									</div>
									<p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
										{project.description}
									</p>
									<div className="flex flex-wrap gap-2">
										{project.tech.map((tech, i) => (
											<span
												key={i}
												className="px-2 py-1 rounded-full bg-white text-gray-700 text-xs sm:text-sm border border-gray-300 hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
											>
												{techIcons[tech]}
												{tech}
											</span>
										))}
									</div>
								</div>
								<div className="flex gap-4">
									<a
										href={project.demoLink}
										target="_blank"
										className="text-primary hover:text-primary-dark text-sm sm:text-base font-medium underline-offset-2 hover:underline"
										aria-label={`Visit demo for ${project.title}`}
									>
										Demo
									</a>
									<a
										href={project.sourceLink}
										target="_blank"
										className="text-primary hover:text-primary-dark text-sm sm:text-base font-medium underline-offset-2 hover:underline"
										aria-label={`View source for ${project.title}`}
									>
										Source
									</a>
								</div>
							</div>

							{/* Gradient Border on Hover */}
							<div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none">
								<div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-[gradient-to-r from-primary to-[#7c3aed]] transition-all duration-300" />
							</div>
						</motion.div>
					))}
				</div>

				{/* View All Projects Button (Placeholder) */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
					transition={{ delay: 0.4 }}
					className="flex justify-center mt-12 sm:mt-16"
				>
					<button
						className="relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
						aria-label="View all projects"
					>
						<span className="cursor-pointer relative z-10">
							View All Projects
						</span>
						<div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 hover:opacity-20 transition-opacity" />
					</button>
				</motion.div>
			</div>
		</section>
	);
}
