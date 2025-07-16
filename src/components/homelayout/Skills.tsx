"use client";

import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaReact, FaNodeJs } from "react-icons/fa";
import {
	SiNextdotjs,
	SiTailwindcss,
	SiMongodb,
	SiTypescript,
} from "react-icons/si";

const skills = [
	{ name: "HTML", icon: FaHtml5, color: "#E34F26" },
	{ name: "CSS", icon: FaCss3Alt, color: "#1572B6" },
	{ name: "React.js", icon: FaReact, color: "#61DAFB" },
	{ name: "Next.js", icon: SiNextdotjs, color: "#000000" },
	{ name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
	{ name: "Node.js", icon: FaNodeJs, color: "#339933" },
	{ name: "MongoDB", icon: SiMongodb, color: "#47A248" },
	{ name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
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
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5 },
	},
};

const tagVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const Skills = () => {
	return (
		<section className="relative px-4 sm:px-6 lg:px-12 xl:px-24 ">
			<div className="relative max-w-6xl mx-auto ">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
					className="flex flex-col items-center mb-8 sm:mb-12 text-center "
				>
					<motion.h2
						variants={itemVariants}
						className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-3 sm:mb-4"
					>
						I work with
						<span className="text-primary"> these technologies</span>
					</motion.h2>
					<motion.div
						variants={itemVariants}
						className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full"
					/>
				</motion.div>

				{/* Skills Grid with Animated Border */}
				<motion.div
					className="relative p-4 sm:p-6 rounded-2xl shadow-lg overflow-hidden"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
				>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
						{skills.map((skill, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="flex flex-col items-center p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
							>
								<skill.icon
									className="text-4xl sm:text-5xl mb-3"
									style={{ color: skill.color }}
								/>
								<span className="text-content text-base sm:text-lg font-medium sm:font-semibold text-center">
									{skill.name}
								</span>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Skills;
