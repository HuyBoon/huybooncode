"use client";

import { Bell, Search, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminHeader = ({ collapsed }: { collapsed: boolean }) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const asideWidth = collapsed
		? "left-16 w-[calc(100%-4rem)]"
		: "left-64 w-[calc(100%-16rem)]";

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/login" });
		router.push("/login");
	};
	return (
		<header
			className={`fixed top-0 z-[50] h-16 px-4 bg-white flex items-center justify-between shadow-sm transition-all duration-300
			bg-light  border-b border-slate-200  text-dark ${asideWidth}`}
		>
			{/* Search */}
			<div className="flex items-center gap-3">
				<div className="relative w-full max-w-xs">
					<Search
						className="absolute left-2 top-1/2 -translate-y-1/2 text-primary"
						size={18}
					/>
					<input
						type="text"
						placeholder="Search..."
						className="pl-8 pr-3 py-1.5 w-full text-sm text-primary bg-slate-100  rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
					/>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<button className="relative hover:bg-slate-200  p-2 rounded-full transition">
					<Bell className="text-slate-600 " size={20} />
					<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
				</button>

				{status === "authenticated" ? (
					<div className="flex items-center gap-2">
						<Image
							src={session.user.avatar || "/avatar.png"}
							alt="User Avatar"
							width={36}
							height={36}
							className="rounded-full border border-gray-300"
						/>

						<div className="hidden md:block">
							<p className="text-sm font-medium text-slate-700">
								{session.user.name}
							</p>
						</div>

						<button
							onClick={handleLogout}
							className="p-2 hover:bg-slate-200 rounded-full cursor-pointer"
							title="Logout"
						>
							<LogOut size={18} />
						</button>
					</div>
				) : (
					<button
						onClick={() => router.push("/login")}
						className="flex items-center gap-2 px-3 py-1.5 bg-primary cursor-pointer text-white rounded-lg hover:bg-blue-600 transition"
					>
						<LogIn size={18} />
						<span className="text-sm font-medium">Login</span>
					</button>
				)}
			</div>
		</header>
	);
};

export default AdminHeader;
