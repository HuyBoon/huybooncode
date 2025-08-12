"use client";

import { getFrenchGreeting } from "@/utils/helper";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	Camera,
	Upload,
	X,
	Check,
	RefreshCw,
	Settings,
	Image as ImageIcon,
	Palette,
	Sun,
	Moon,
	Cloud,
	Mountain,
} from "lucide-react";

interface HeroAdminProps {
	className?: string;
	onBackgroundChange?: (backgroundUrl: string) => void;
}

interface BackgroundOption {
	id: string;
	name: string;
	url: string;
	category: "nature" | "abstract" | "minimal" | "gradient";
}

const defaultBackgrounds: BackgroundOption[] = [
	{
		id: "gradient-blue",
		name: "Blue Gradient",
		url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		category: "gradient",
	},
	{
		id: "gradient-sunset",
		name: "Sunset",
		url: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
		category: "gradient",
	},
	{
		id: "gradient-ocean",
		name: "Ocean",
		url: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
		category: "gradient",
	},
	{
		id: "gradient-forest",
		name: "Forest",
		url: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
		category: "gradient",
	},
	{
		id: "minimal-light",
		name: "Light Gray",
		url: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
		category: "minimal",
	},
	{
		id: "minimal-dark",
		name: "Dark",
		url: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
		category: "minimal",
	},
];

const HeroAdmin: React.FC<HeroAdminProps> = ({
	className = "",
	onBackgroundChange,
}) => {
	const [greeting, setGreeting] = useState("");
	const [currentBackground, setCurrentBackground] = useState(
		defaultBackgrounds[0].url
	);
	const [isCustomizing, setIsCustomizing] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [activeCategory, setActiveCategory] = useState<
		"all" | "nature" | "abstract" | "minimal" | "gradient"
	>("all");

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Initialize greeting
	useEffect(() => {
		setGreeting(getFrenchGreeting());
	}, []);

	// Handle background change
	const handleBackgroundChange = useCallback(
		(backgroundUrl: string) => {
			setCurrentBackground(backgroundUrl);
			onBackgroundChange?.(backgroundUrl);
		},
		[onBackgroundChange]
	);

	// Handle file upload
	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			// Validate file type
			if (!file.type.startsWith("image/")) {
				alert("Please select a valid image file");
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert("File size should be less than 5MB");
				return;
			}

			setIsUploading(true);

			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				setUploadedImage(imageUrl);
				handleBackgroundChange(`url(${imageUrl})`);
				setIsUploading(false);
			};
			reader.onerror = () => {
				alert("Error reading file");
				setIsUploading(false);
			};
			reader.readAsDataURL(file);
		},
		[handleBackgroundChange]
	);

	// Trigger file input
	const triggerFileInput = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	// Filter backgrounds by category
	const filteredBackgrounds = defaultBackgrounds.filter(
		(bg) => activeCategory === "all" || bg.category === activeCategory
	);

	// Get current time for dynamic greeting
	const getCurrentTimeGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Bon matin";
		if (hour < 18) return "Bon après-midi";
		return "Bonsoir";
	};

	const categories = [
		{ id: "all" as const, label: "All", icon: <ImageIcon size={16} /> },
		{
			id: "gradient" as const,
			label: "Gradients",
			icon: <Palette size={16} />,
		},
		{ id: "minimal" as const, label: "Minimal", icon: <Sun size={16} /> },
		{ id: "nature" as const, label: "Nature", icon: <Mountain size={16} /> },
		{ id: "abstract" as const, label: "Abstract", icon: <Cloud size={16} /> },
	];

	return (
		<div className={`relative min-h-[50vh] overflow-hidden ${className}`}>
			{/* Background */}
			<div
				className="absolute  inset-0 transition-all duration-500 ease-in-out"
				style={{
					background: currentBackground.startsWith("url(")
						? currentBackground
						: currentBackground,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				{/* Overlay for better text readability */}
				<div className="absolute inset-0 bg-black/20" />
			</div>

			{/* Content */}
			<div className="relative p-4 z-10 flex flex-col  ">
				{/* Greeting */}
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-left text-xl md:text-3xl font-bold text-white drop-shadow-lg">
						{greeting || getCurrentTimeGreeting()}
					</h1>
					<button
						onClick={() => setIsCustomizing(!isCustomizing)}
						className="
						flex items-center gap-2 						
						hover:bg-white/30 
						text-white 						
						transition-all duration-200					
						hover:border-white/50
						focus:outline-none 
						focus:ring-2 
						focus:ring-white/50
					"
					>
						<Settings size={20} />
					</button>
				</div>
			</div>

			{isCustomizing && (
				<div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								Customize Background
							</h2>
							<button
								onClick={() => setIsCustomizing(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						{/* Upload Custom Image */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3">
								Upload Custom Image
							</h3>
							<div className="flex gap-3">
								<button
									onClick={triggerFileInput}
									disabled={isUploading}
									className="
										flex items-center gap-2 
										bg-blue-600 hover:bg-blue-700 
										disabled:bg-blue-400
										text-white px-4 py-2 
										rounded-lg transition-colors
									"
								>
									{isUploading ? (
										<RefreshCw size={20} className="animate-spin" />
									) : (
										<Upload size={20} />
									)}
									{isUploading ? "Uploading..." : "Upload Image"}
								</button>
								{uploadedImage && (
									<button
										onClick={() =>
											handleBackgroundChange(`url(${uploadedImage})`)
										}
										className="
											flex items-center gap-2 
											bg-green-600 hover:bg-green-700 
											text-white px-4 py-2 
											rounded-lg transition-colors
										"
									>
										<Check size={20} />
										Use Uploaded
									</button>
								)}
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
							/>
						</div>

						{/* Category Filter */}
						<div className="mb-4">
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										key={category.id}
										onClick={() => setActiveCategory(category.id)}
										className={`
											flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
											${
												activeCategory === category.id
													? "bg-blue-600 text-white"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}
										`}
									>
										{category.icon}
										{category.label}
									</button>
								))}
							</div>
						</div>

						{/* Preset Backgrounds */}
						<div>
							<h3 className="text-lg font-semibold mb-3">Preset Backgrounds</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{filteredBackgrounds.map((bg) => (
									<button
										key={bg.id}
										onClick={() => handleBackgroundChange(bg.url)}
										className={`
											relative h-24 rounded-lg overflow-hidden transition-all duration-200
											hover:ring-2 hover:ring-blue-500 hover:scale-105
											${currentBackground === bg.url ? "ring-2 ring-blue-600" : ""}
										`}
										style={{
											background: bg.url.startsWith("linear-gradient")
												? bg.url
												: `url(${bg.url})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									>
										<div className="absolute inset-0 bg-black/20" />
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
											<span className="text-white text-xs font-medium">
												{bg.name}
											</span>
										</div>
										{currentBackground === bg.url && (
											<div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
												<Check size={14} className="text-white" />
											</div>
										)}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default HeroAdmin;
