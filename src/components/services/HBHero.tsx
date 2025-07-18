"use client";
import { ParticleCanvas } from "@/hooks/particle";
import { motion, useScroll, useTransform } from "framer-motion";
import { IoMdCall, IoIosPricetags } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function HBHero() {
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 500], [0, 100]);

	return (
		<section className="relative overflow-hidden py-20 md:py-8 bg-gradient-to-b from-gray-900 to-black">
			{/* <ParticleCanvas /> */}
			<div className="max-w-7xl mx-auto px-6 xl:px-24 pt-24 md:pt-32 xl:pt-40">
				<div className="flex flex-col md:flex-row items-center gap-12">
					{/* Text content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1 }}
						className="relative group md:w-1/2"
					>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
						>
							Thiết kế Website chuyên nghiệp cùng
							<br />
							<motion.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.8 }}
								className="bg-gradient-to-r from-yellow-400 to-yellow-700 bg-clip-text text-transparent"
							>
								HuyBoonCode.
							</motion.span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 1 }}
							className="text-lg text-white/80 mb-8"
						>
							Tôi nhận thiết kế website chuẩn SEO, giao diện đẹp, dễ quản lý –
							phù hợp cho cá nhân, doanh nghiệp nhỏ, cửa hàng và nhà sách.
						</motion.p>

						<div className="flex gap-4">
							<Link
								href="/huyboon"
								className="flex items-center gap-2 px-5 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition"
							>
								<IoIosPricetags className="text-xl" />
								Xem bảng giá
							</Link>
							<Link
								href="/huyboon"
								className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition"
							>
								<IoMdCall className="text-xl" />
								Liên hệ tư vấn
							</Link>
						</div>
					</motion.div>

					{/* Image Card */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1, delay: 0.6 }}
						className="md:w-1/2 relative hidden md:block"
						style={{ y }}
					>
						<div className="relative w-[90%] mx-auto aspect-[3/2] group rounded-3xl overflow-hidden">
							{/* Border glow */}
							<motion.div
								initial={{ scale: 0.98 }}
								animate={{ scale: 1 }}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "mirror",
								}}
								className="absolute inset-0 rounded-3xl bg-yellow-500/20 blur-lg"
							/>
							{/* Image */}
							<motion.div
								animate={{ y: [0, -5, 0] }}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="relative w-full h-full"
							>
								<Image
									src="/huybooncode.png"
									alt="HuyBoonCode Avatar"
									fill
									className="object-cover scale-100 transition-transform duration-500"
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
