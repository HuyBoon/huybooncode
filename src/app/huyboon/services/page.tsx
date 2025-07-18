"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
	{
		title: "Website giới thiệu doanh nghiệp",
		desc: "Thiết kế website chuyên nghiệp, chuẩn SEO giúp doanh nghiệp xây dựng thương hiệu và tăng độ tin cậy.",
	},
	{
		title: "Website bán hàng",
		desc: "Thiết kế web bán hàng chuẩn UI/UX, tối ưu trải nghiệm mua sắm và dễ dàng quản lý đơn hàng.",
	},
	{
		title: "Landing Page sản phẩm",
		desc: "Trang đích tối ưu chuyển đổi, hỗ trợ chạy quảng cáo và thu hút khách hàng tiềm năng.",
	},
	{
		title: "Blog cá nhân / Portfolio",
		desc: "Tạo blog cá nhân, chia sẻ kiến thức hoặc giới thiệu hồ sơ năng lực một cách ấn tượng.",
	},
];

const pricing = [
	{
		name: "Landing Page",
		price: "5.000.000đ+",
		features: [
			"Thiết kế giao diện đơn giản",
			"Tối ưu cho quảng cáo, ra mắt sản phẩm",
			"Responsive trên mọi thiết bị",
			"Tích hợp form liên hệ cơ bản",
			"Thời gian: 1–3 ngày",
			"Miễn phí hosting 1GB & tên miền .com năm đầu",
		],
	},
	{
		name: "Website Cơ Bản",
		price: "8.000.000đ+",
		features: [
			"Giao diện tùy chỉnh cơ bản",
			"Tối ưu SEO cơ bản",
			"Tích hợp hosting 2GB & SSL miễn phí năm đầu",
			"Hỗ trợ 2 trang nội dung (trang chủ, liên hệ)",
			"Thời gian: 3–5 ngày",
			"Bảo hành 6 tháng",
		],
	},
	{
		name: "Website Theo Yêu Cầu",
		price: "12.000.000đ+",
		features: [
			"Thiết kế giao diện theo yêu cầu",
			"Tích hợp form, live chat, email marketing",
			"Tối ưu SEO nâng cao",
			"Hosting 3GB & SSL miễn phí năm đầu",
			"Thời gian: 5–7 ngày",
			"Bảo hành 12 tháng",
		],
	},
	// {
	// 	name: "Website Nâng Cao",
	// 	price: "20.000.000đ+",
	// 	features: [
	// 		"Thiết kế UI/UX chuyên nghiệp",
	// 		"Tích hợp CMS quản trị & giỏ hàng/thanh toán online",
	// 		"Tối ưu SEO chuyên sâu & Google Analytics",
	// 		"Hosting 5GB & SSL miễn phí năm đầu",
	// 		"Thời gian: 7–14 ngày",
	// 		"Bảo hành 18 tháng, hỗ trợ CRM mini",
	// 	],
	// },
];
const demos = [
	{
		name: "Kim Vinh Store",
		link: "https://kimvinhstore.vercel.app/",
		description: "Website bán mỹ phẩm, tích hợp giỏ hàng và đặt hàng online.",
	},
	{
		name: "HelloPhuQuoc",
		link: "https://hellophuquoc.vn/vi",
		description: "Trang du lich, đặt tour du lịch Phú Quốc.",
	},
	{
		name: "meReview",
		link: "https://mereview.vercel.app",
		description: "Blog chia sẻ đánh giá, hỗ trợ comment và quản trị nội dung.",
	},
];

const HuyBoonService = () => {
	return (
		<div className="max-w-7xl mx-auto px-4 py-24 md:py-26 xl:py-32 space-y-24 min-h-screen bg-gray-800">
			{/* Dịch vụ */}
			<section>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold text-center mb-10 text-white"
				>
					Dịch vụ thiết kế Website tại HuyBoonCode
				</motion.h2>
				<div className="grid md:grid-cols-2 gap-8 text-white">
					{services.map((service, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
							className="bg-white/5 p-6 rounded-xl shadow-md border border-white/10"
						>
							<h3 className="text-xl font-semibold text-primary mb-2">
								{service.title}
							</h3>
							<p>{service.desc}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* Bảng giá */}
			<section>
				<h2 className="text-3xl font-bold text-center mb-10 text-white">
					Bảng giá dịch vụ
				</h2>
				<div className="grid md:grid-cols-3 gap-6 text-white">
					{pricing.map((pkg, i) => (
						<div
							key={i}
							className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-md hover:shadow-xl transition"
						>
							<h3 className="text-xl font-bold text-primary mb-2">
								{pkg.name}
							</h3>
							<p className="text-2xl font-semibold mb-4">{pkg.price}</p>
							<ul className="space-y-2 text-sm">
								{pkg.features.map((feature, j) => (
									<li key={j}>• {feature}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			{/* Demo */}
			<section>
				<h2 className="text-3xl font-bold text-center mb-10 text-white">
					Dự án đã thực hiện
				</h2>
				<div className="grid md:grid-cols-3 gap-6 text-white">
					{demos.map((demo, i) => (
						<div
							key={i}
							className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-md"
						>
							<h3 className="text-xl font-bold text-primary mb-2">
								{demo.name}
							</h3>
							<p className="text-sm mb-4">{demo.description}</p>
							<Link
								href={demo.link}
								target="_blank"
								className="inline-block mt-2 text-sm text-white underline hover:text-primary"
							>
								Xem demo →
							</Link>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default HuyBoonService;
