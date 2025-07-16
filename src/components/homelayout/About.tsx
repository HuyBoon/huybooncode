"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

const About = () => {
	return (
		<section className="relative px-4 sm:px-6 lg:px-12 xl:px-24 ">
			<div className="relative max-w-6xl mx-auto">
				<motion.div
					className="relative p-4 sm:p-6 rounded-2xl  overflow-hidden shadow-lg animate-border-container"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: false }}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
						{/* Profile Image */}
						<motion.div
							variants={itemVariants}
							className="flex justify-center md:justify-start"
						>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="relative mx-auto w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-md"
							>
								<Image
									src="/avatar.png"
									alt="Profile photo"
									fill
									className="object-cover"
								/>
							</motion.div>
						</motion.div>

						{/* Bio and Stats */}
						<motion.div
							variants={containerVariants}
							className="flex flex-col justify-center text-center md:text-left"
						>
							<motion.h2
								variants={itemVariants}
								className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-3 sm:mb-4"
							>
								About Me
							</motion.h2>
							<motion.div
								variants={itemVariants}
								className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full mb-4 sm:mb-6 mx-auto md:mx-0"
							/>
							<motion.p
								variants={itemVariants}
								className="text-sm sm:text-base md:text-lg text-content/90 mb-4 sm:mb-6 leading-relaxed"
							>
								I'm a frontend developer with 2 years of experience working on
								real-world web projects. I specialize in building clean,
								scalable, and user-friendly interfaces using React and Next.js.
								I'm also familiar with Node.js and constantly learning more
								about backend development as I work toward becoming a full-stack
								developer. Outside of work, I enjoy exploring new technologies
								and contributing to open-source projects.
							</motion.p>
							{/* <motion.div
								variants={containerVariants}
								className="grid grid-cols-2 gap-3 sm:gap-4"
							>
								<motion.div
									variants={itemVariants}
									whileHover={{ scale: 1.05 }}
									className="p-3 sm:p-4 bg-gray-50 rounded-lg shadow-md text-center"
								>
									<h3 className="text-lg sm:text-xl font-semibold text-primary">
										3+
									</h3>
									<p className="text-sm sm:text-base text-gray-600">
										Years Experience
									</p>
								</motion.div>
								<motion.div
									variants={itemVariants}
									whileHover={{ scale: 1.05 }}
									className="p-3 sm:p-4 bg-gray-50 rounded-lg shadow-md text-center"
								>
									<h3 className="text-lg sm:text-xl font-semibold text-primary">
										10+
									</h3>
									<p className="text-sm sm:text-base text-gray-600">
										Projects Completed
									</p>
								</motion.div>
							</motion.div> */}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default About;
