"use client";

import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";

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

const experiences = [
	{
		start: "2023",
		end: "Present",
		title: "Freelance Developer",
		company: "Independent",
		location: "Remote",
		details: [
			"Developed responsive websites for multiple brands and small businesses.",
			"Completed various client projects using modern web technologies.",
		],

		technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
	},
	{
		start: "2021",
		end: "2023",
		title: "Business",
		company: "Music Lounge - Color of the Wind",
		location: "District 10, Ho Chi Minh City, Vietnam",
		details: [
			"Managed business operations and marketing for the music lounge.",
		],
		technologies: ["Business Management", "Marketing"],
	},
	{
		start: "2020",
		end: "2020",
		title: "Graduation",
		company: "HCMC University of Technology",
		location: "Ho Chi Minh City, Vietnam",
		details: ["Graduated with a degree in Mechatronics."],
		technologies: [],
	},
	{
		start: "2019",
		end: "2020",
		title: "Manual Tester",
		company: "TMA Solutions",
		location:
			"10 Dang Van Ngu Street, Phu Nhuan District, Ho Chi Minh City, Vietnam",
		details: [
			"Tested features and functions of new versions of IXM Systems.",
			"Planned and ran test cases, reporting results to Jira.",
			"Built OfficeLinx and Space Calling Extension.",
		],
		technologies: ["Jira", "Manual Testing", "Teamwork"],
	},
];

const ProfessionalExperience = () => {
	const [showAll, setShowAll] = useState(false);
	const sectionRef = useRef(null);
	const isInView = useInView(sectionRef, { once: false });

	return (
		<section
			ref={sectionRef}
			className="relative px-4 sm:px-6 lg:px-12 xl:px-24 "
		>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate={isInView ? "visible" : "hidden"}
				className="flex flex-col items-center mb-8 sm:mb-12 text-center"
			>
				<motion.h2
					variants={itemVariants}
					className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-3 sm:mb-4"
				>
					Professional
					<span className="text-primary"> Experiences</span>
				</motion.h2>
				<motion.div
					variants={itemVariants}
					className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-[#7c3aed] rounded-full"
				/>
			</motion.div>

			<div className="relative max-w-6xl mx-auto shadow-lg">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="relative p-4 sm:p-6"
				>
					<div className="relative">
						<div className="absolute left-1 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-1 bg-gray-300" />
						{experiences
							.slice(0, showAll ? experiences.length : 2)
							.map((exp, index) => {
								const isLeft = index % 2 === 0;
								return (
									<motion.div
										key={exp.start + exp.end}
										variants={itemVariants}
										className={`mb-8 flex w-full ${
											isLeft
												? "sm:justify-start justify-start"
												: "sm:justify-end justify-start"
										}`}
									>
										<div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2  w-3 h-3 bg-primary rounded-full" />
										<div
											className={`w-full sm:max-w-[45%] p-4 sm:p-6 rounded-lg shadow-lg shadow-white/10 border border-gray-50 ${
												isLeft
													? "sm:mr-4 md:mr-8 ml-8 sm:ml-0"
													: "sm:ml-4 md:ml-6 ml-8"
											}`}
										>
											<div className="flex items-center mb-2 relative">
												<div>
													<p className="text-sm sm:text-base font-bold text-content">
														{exp.start} - {exp.end || "Present"}
													</p>
												</div>
											</div>
											<h3 className="text-lg sm:text-xl font-semibold text-content">
												{exp.title}
											</h3>
											<p className="text-sm sm:text-base text-content">
												{exp.company} - {exp.location}
											</p>
											<ul className="mt-2 text-sm sm:text-base text-content list-disc list-inside">
												{exp.details.map((detail, i) => (
													<li key={i}>{detail}</li>
												))}
											</ul>
											<div className="mt-2 flex flex-wrap gap-1">
												{exp.technologies.map((tech, i) => (
													<span
														key={i}
														className="text-xs sm:text-sm bg-primary text-black px-2 py-1 rounded-full"
													>
														{tech}
													</span>
												))}
											</div>
										</div>
									</motion.div>
								);
							})}
					</div>

					{!showAll && (
						<motion.div variants={itemVariants} className="mt-6 text-center">
							<button
								onClick={() => setShowAll(true)}
								className="cursor-pointer relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[#7c3aed] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
								aria-label="View more experience"
							>
								View More
							</button>
						</motion.div>
					)}
					{showAll && (
						<motion.div variants={itemVariants} className="mt-6 text-center">
							<button
								onClick={() => setShowAll(false)}
								className="cursor-pointer relative px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[#7c3aed] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
								aria-label="Collapse experience"
							>
								Collapse
							</button>
						</motion.div>
					)}
				</motion.div>
			</div>
		</section>
	);
};

export default ProfessionalExperience;
