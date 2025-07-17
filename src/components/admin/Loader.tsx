import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
			<div className="relative flex flex-col items-center">
				{/* Vòng tròn quay chính */}
				<div className="relative">
					<div className="w-16 h-16 rounded-full border-4 border-t-transparent border-blue-500 animate-spin-fast shadow-md">
						<div className="absolute inset-0 rounded-full border-2 border-t-transparent border-blue-300 animate-spin-slow" />
					</div>
					{/* Biểu tượng trung tâm */}
					<Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 w-8 h-8 animate-pulse-smooth" />
				</div>
				{/* Text hiệu ứng */}
				<div className="mt-4 text-sm font-mono text-gray-200 animate-pulse-smooth">
					HBCode.
				</div>
			</div>
		</div>
	);
};

export default Loader;
