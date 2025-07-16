"use client";
import { ParticleCanvas } from "@/hooks/particle";
import { motion, useScroll, useTransform } from "framer-motion";
import { IoMdDownload } from "react-icons/io";
import Image from "next/image";

export default function Hero() {
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 500], [0, 100]);

	return (
		<section className="relative  overflow-hidden py-12 md:py-8">
			{/* <ParticleCanvas /> */}
			<div className="max-w-7xl mx-auto px-12 xl:px-24 pt-24 md:pt32">
				<div className="flex flex-col md:flex-row items-center gap-16">
					{/* Text content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1, ease: "easeOut" }}
						className="relative group md:w-1/2"
					>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}
							className="text-4xl md:text-6xl font-bold text-white mb-6"
						>
							Frontend
							<br />
							<motion.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.8 }}
								className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent"
							>
								Developer
							</motion.span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 1.1 }}
							className="text-xl text-white/90 mb-8"
						>
							I specialize in building modern, responsive websites using React,
							Next.js, and Tailwind CSS. Passionate about UI/UX and creating
							seamless user experiences.
						</motion.p>

						<div className="flex gap-4">
							{/* <motion.button
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 1.2 }}
								whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
								className="relative overflow-hidden px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-surface border border-white/10 hover:border-primary/30 transition-all group"
							>
								<span className="text-content text-sm md:text-base group-hover:text-primary transition-colors">
									Explore Work
								</span>
								<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
							</motion.button> */}

							<motion.a
								href="/HuyBoon's CV.pdf"
								download="Martin_CV"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 1.2 }}
								whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
								className="relative overflow-hidden px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-surface border border-white/10 hover:border-primary/30 transition-all group"
							>
								<div className="flex items-center justify-center gap-1 text-white text-sm md:text-base group-hover:text-primary transition-colors">
									<IoMdDownload className="w-4 h-4 " />
									<span>My CV</span>
								</div>
								<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
							</motion.a>
						</div>
					</motion.div>

					{/* Image Card */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
						className="md:w-1/2 relative hidden md:block"
						style={{ y }}
					>
						<div className="relative w-[90%] mx-auto aspect-[3/2] group">
							{/* Animated Border */}
							<motion.div
								initial={{ scale: 0.98 }}
								animate={{ scale: 1 }}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "mirror",
								}}
								className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/30 via-secondary/30 to-tertiary/30 opacity-50"
							/>

							{/* Floating Avatar */}
							<motion.div
								animate={{ y: [0, -5, 0] }}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="relative w-full h-full rounded-3xl overflow-hidden "
							>
								<Image
									src="/huybooncode.png"
									alt="Avatar"
									fill
									className="object-cover scale-102 group-hover:scale-100 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
