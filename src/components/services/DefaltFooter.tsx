"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const DefaltFooter = () => {
	return (
		<footer className="bg-gray-900 py-10 text-white border-t border-white/10">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-7xl mx-auto px-6 md:px-12"
			>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base text-gray-300">
					{/* Left - Branding */}
					<div>
						<h2 className="text-2xl font-bold text-white mb-2">HuyBoonCode</h2>
						<p className="mb-4">
							Thiết kế & phát triển website hiện đại, chuẩn SEO, tối ưu trải
							nghiệm người dùng.
						</p>
						<p className="text-sm">
							Email:{" "}
							<a
								href="mailto:huybooncode@gmail.com"
								className="text-primary hover:underline"
							>
								huybooncode74@gmail.com
							</a>
						</p>
						<p className="text-sm">
							Phone:{" "}
							<a href="tel:0984181304" className="text-primary hover:underline">
								0984 181 304
							</a>
						</p>
					</div>

					{/* Middle - Navigation */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-white">Điều hướng</h3>
						<ul className="space-y-1">
							<li>
								<Link href="/huyboon/services" className="hover:text-primary">
									Dịch vụ
								</Link>
							</li>

							<li>
								<Link href="/huyboon/about" className="hover:text-primary">
									Dự án đã làm
								</Link>
							</li>
							<li>
								<Link href="/huyboon/contact" className="hover:text-primary">
									Liên hệ
								</Link>
							</li>
						</ul>
					</div>

					{/* Right - Social or CTA */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-white">Kết nối</h3>
						<p>Theo dõi tôi trên các nền tảng:</p>
						<div className="flex gap-4 text-xl">
							<a
								href="https://www.facebook.com/dany.vuong.1/"
								target="_blank"
								className="hover:text-blue-500"
							>
								<FaFacebook />
							</a>
							<a
								href="https://www.tiktok.com/@boonhuy"
								target="_blank"
								className="hover:text-pink-500"
							>
								<FaTiktok />
							</a>
							{/* <a
								href="https://zalo.me"
								target="_blank"
								className="hover:text-green-400"
							>
								<SiZalo />
							</a> */}
						</div>
					</div>
				</div>

				{/* Bottom line */}
				<div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
					© {new Date().getFullYear()} HuyBoonCode. Thiết kế bởi HuyBoon.
				</div>
			</motion.div>
		</footer>
	);
};

export default DefaltFooter;
