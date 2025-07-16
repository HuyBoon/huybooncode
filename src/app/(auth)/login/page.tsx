"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Loader from "@/components/admin/Loader";
import { useUser } from "@/context/AppContext";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const { user, status } = useUser();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/admin/dashboard");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader />
			</div>
		);
	}

	if (status === "authenticated") {
		return null;
	}

	const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		setLoading(true);
		setError("");

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			setError("Invalid email or password. Please try again.");
			setLoading(false);
			return;
		}

		const session = await getSession();

		if (session) {
			if (session.user?.role === "admin") {
				window.open("/admin/dashboard", "_blank"); // mở tab mới
			} else {
				router.push("/"); // chuyển trang bình thường
			}
		} else {
			setError("Failed to retrieve session. Please try again.");
		}

		setLoading(false);
	};

	return (
		<section className="flex items-center justify-center min-h-screen transition-colors duration-300">
			<div className="bg-white  p-8 rounded-lg shadow-lg w-full max-w-md transition-colors duration-300">
				<h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
					Login
				</h2>

				{error && (
					<p className="bg-red-100 text-red-600 dark:bg-red-200  p-3 rounded-md text-center mb-4">
						{error}
					</p>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 "
						>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full mt-1 p-2 border border-gray-300  rounded-md bg-white  text-gray-900 focus:ring focus:ring-blue-300"
							placeholder="Enter your email"
							disabled={loading}
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full mt-1 p-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring focus:ring-blue-300"
							placeholder="Enter your password"
							disabled={loading}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full py-2 text-center font-bold rounded-md transition ${
							loading
								? "bg-gray-400 text-white"
								: "bg-primary hover:bg-secondary text-white cursor-pointer"
						}`}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				{/* <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
					Don't have an account?{" "}
					<a href="/register" className="text-blue-500 hover:underline">
						Register here
					</a>
				</p> */}
			</div>
		</section>
	);
};

export default LoginPage;
