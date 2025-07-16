"use client";

import React from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
			<div className="text-center space-y-6 p-8 max-w-md w-full">
				{/* Icon Lock */}
				<div className="flex justify-center">
					<Lock className="w-16 h-16 text-red-500 animate-pulse" />
				</div>

				{/* Tiêu đề */}
				<h1 className="text-3xl font-bold font-mono">Access Denied</h1>

				{/* Thông báo */}
				<p className="text-gray-400 text-sm">
					You do not have permission to access this page. Please log in with an
					authorized account or return to the previous page.
				</p>

				{/* Nút hành động */}
				<div className="flex justify-center space-x-4">
					<button
						onClick={() => router.back()} // Quay lại trang trước
						className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-mono"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Go Back
					</button>
					<button
						onClick={() => router.push("/login")} // Điều hướng tới trang đăng nhập
						className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-mono"
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
};

export default UnauthorizedPage;
