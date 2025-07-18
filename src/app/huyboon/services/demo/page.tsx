"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const demoData = [
	{
		title: "Demo1",
		description: "Website hiện đại, tối ưu đặt hàng online.",
		image: "/demo/demo1.jpg",
		link: "https://demo.leebrosus.com/baloca/home-2/",
	},
	{
		title: "Demo2",
		description: "Website bán dụng cụ học tập và văn phòng phẩm.",
		image: "/demo/demo2.jpg",
		link: "https://htmldemo.net/boighor/boighor/index.html",
	},
	{
		title: "Nhà sách Phương Nam",
		description: "Thiết kế đơn giản, dễ sử dụng cho người dùng.",
		image: "/demo/demo3.jpg",
		link: "https://nhasachphuongnam.com/",
	},
	{
		title: "Nhà sách Cá Chép",
		description: "Giao diện chuẩn SEO, tải nhanh.",
		image: "/demo/demo4.jpg",
		link: "https://cachep.vn/",
	},
	{
		title: "Thaihabooks",
		description: "Hỗ trợ quản lý sản phẩm và đơn hàng.",
		image: "/demo/demo5.jpg",
		link: "https://thaihabooks.com/",
	},
	{
		title: "EbookStore",
		description: "Website trẻ trung phù hợp học sinh & sinh viên.",
		image: "/demo/demo5.jpg",
		link: "https://ebookstore.com.vn/",
	},
];

const DemoShowcase = () => {
	return (
		<section className="max-w-7xl mx-auto px-4 py-24 md:py-26 xl:py-32 space-y-24 min-h-screen bg-gray-800">
			<div className="max-w-7xl mx-auto">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold text-center text-white mb-16"
				>
					Demo các Website Văn phòng phẩm
				</motion.h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{demoData.map((demo, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: i * 0.1 }}
						>
							<Link
								href={demo.link}
								target="_blank"
								aria-label={`Xem demo ${demo.title}`}
								className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
							>
								<div className="aspect-[4/3] relative">
									<Image
										src={demo.image}
										alt={`Ảnh demo của ${demo.title}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<div className="p-5">
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										{demo.title}
									</h3>
									<p className="text-sm text-gray-600 mb-4">
										{demo.description}
									</p>
									<p className="inline-block text-primary text-sm font-medium">
										Xem Demo &rarr;
									</p>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default DemoShowcase;
