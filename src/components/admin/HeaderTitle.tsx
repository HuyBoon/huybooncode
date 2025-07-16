"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface HeaderTitleProps {
	title: string;
	path: string;
	addItem: string;
}

const HeaderTitle: FC<HeaderTitleProps> = ({ title, path, addItem }) => {
	const router = useRouter();

	return (
		<div className="py-2 px-4 text-primary  flex items-center justify-between border-b border-slate-200 ">
			<h1 className="text-xl font-bold">{title}</h1>
			<button
				onClick={() => router.push(path)}
				className="bg-white text-primary font-semibold text-sm md:text-base py-2 px-4 rounded-md shadow hover:bg-gray-200 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
			>
				{addItem}
			</button>
		</div>
	);
};

export default HeaderTitle;
