"use client";
import { useUser } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RegisterPage = () => {
	const router = useRouter();
	const { profileFetched, status } = useUser();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/register`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Registration failed.");

			setMessage({
				type: "success",
				text: "Account created successfully. You can now log in.",
			});
			setFormData({ name: "", email: "", password: "" });
		} catch (error: any) {
			setMessage({ type: "error", text: error.message });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="flex items-center justify-center min-h-screen  transition-colors duration-300">
			<div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center mb-6">
					Create an Account
				</h2>
				{message && (
					<div
						className={`text-center p-3 mb-4 rounded ${
							message.type === "error"
								? "bg-red-100 dark:bg-red-200 text-red-700"
								: "bg-green-100 dark:bg-green-200 text-green-700"
						}`}
					>
						{message.text}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						value={formData.name}
						onChange={handleInputChange}
						required
						className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
						disabled={isLoading}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email Address"
						value={formData.email}
						onChange={handleInputChange}
						required
						className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
						disabled={isLoading}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={formData.password}
						onChange={handleInputChange}
						required
						className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 rounded focus:outline-none focus:ring focus:ring-blue-400"
						disabled={isLoading}
					/>
					<button
						type="submit"
						className={`w-full text-center py-2 text-white font-bold rounded transition ${
							isLoading
								? "bg-gray-400 dark:bg-gray-500"
								: "bg-blue-500 hover:bg-blue-600"
						}`}
						disabled={isLoading}
					>
						{isLoading ? "Registering..." : "Sign Up"}
					</button>
				</form>
				<p className="text-center mt-4 text-gray-600 dark:text-gray-300">
					Already have an account?
					<Link href="/login" className="text-blue-500 hover:underline ml-1">
						Log in
					</Link>
				</p>
			</div>
		</section>
	);
};

export default RegisterPage;
