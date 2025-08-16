"use client";

import { getFrenchGreeting } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useSnackbar } from "@/context/SnackbarContext";
import { useQuery } from "@tanstack/react-query";

interface HeroAdminProps {
	className?: string;
}

interface BackgroundOption {
	id: string;
	name: string;
	url: string;
}

interface Quote {
	content: string;
	author: string;
}

const defaultBackgrounds: BackgroundOption[] = [
	{
		id: "gradient-blue",
		name: "Blue Gradient",
		url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	},
	{
		id: "gradient-sunset",
		name: "Sunset",
		url: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
	},
	{
		id: "gradient-ocean",
		name: "Ocean",
		url: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
	},
	{
		id: "gradient-forest",
		name: "Forest",
		url: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
	},
	{
		id: "minimal-light",
		name: "Light Gray",
		url: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
	},
	{
		id: "minimal-dark",
		name: "Dark",
		url: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
	},
];

const fallbackQuotes: Quote[] = [
	{
		content: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
	},
	{
		content:
			"La vie est un mystère qu'il faut vivre, et non un problème à résoudre.",
		author: "Gandhi",
	},
	{
		content:
			"Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.",
		author: "Albert Schweitzer",
	},
	{ content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
	{
		content: "The best way to predict the future is to create it.",
		author: "Peter Drucker",
	},
];

const HeroAdmin: React.FC<HeroAdminProps> = ({ className = "" }) => {
	const { showSnackbar } = useSnackbar();
	const [greeting, setGreeting] = useState("");
	const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
	const [isDay, setIsDay] = useState(true);

	// Greeting + Day/Night
	useEffect(() => {
		setGreeting(getFrenchGreeting());
		const hour = new Date().getHours();
		setIsDay(hour >= 6 && hour < 18);
	}, []);

	// Fetch quote with React Query
	const { data: quote, error } = useQuery({
		queryKey: ["quote"],
		queryFn: async () => {
			const response = await fetch("/api/getquotes");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return (await response.json()) as Quote;
		},
		staleTime: 1000 * 60 * 5, // Cache 5 phút
		retry: 1,
		initialData:
			fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)],
	});

	// Handle error with snackbar
	useEffect(() => {
		if (error) {
			showSnackbar({
				open: true,
				message: "Failed to fetch quote, using fallback quote",
				severity: "warning",
			});
		}
	}, [error, showSnackbar]);

	// Auto change background every 10s
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBackgroundIndex(
				(prev) => (prev + 1) % defaultBackgrounds.length
			);
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	const currentBackground = defaultBackgrounds[currentBackgroundIndex].url;

	return (
		<div className={`relative min-h-[50vh] overflow-hidden ${className}`}>
			{/* Background */}
			<div
				className="absolute inset-0 transition-all duration-500 ease-in-out"
				style={{
					backgroundImage: currentBackground,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="absolute inset-0 bg-black/20" />
			</div>

			{/* Content */}
			<div className="relative p-4 z-10 flex flex-col h-full justify-center">
				<h1 className="text-left text-xl md:text-3xl font-bold text-white drop-shadow-lg mb-4">
					{greeting}
				</h1>

				{/* Quote */}
				{quote && (
					<div className="text-white drop-shadow-lg">
						<p className="italic text-base md:text-lg mb-2">
							"{quote.content}"
						</p>
						<p className="text-right text-sm md:text-base">- {quote.author}</p>
					</div>
				)}

				{/* Time icon */}
				<div className="absolute top-4 right-4 text-white">
					{isDay ? <Sun size={24} /> : <Moon size={24} />}
				</div>
			</div>
		</div>
	);
};

export default HeroAdmin;
