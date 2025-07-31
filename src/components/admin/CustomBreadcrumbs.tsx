import { Box, Link, Typography } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";

interface NavLink {
	url: string;
	label: string;
	icon?: React.ReactNode;
	submenu?: { url: string; label: string; icon?: React.ReactNode }[];
}

interface BreadcrumbItem {
	label: string;
	href?: string;
	icon?: React.ReactNode;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	navLinks: NavLink[];
}

const CustomBreadcrumbs = ({ items, navLinks }: BreadcrumbProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				py: 1,
				alignItems: "center",
				gap: 1,
				margin: "0 auto",
				flexWrap: "wrap",
				role: "navigation",
				ariaLabel: "Breadcrumb navigation",
				backgroundColor: "#f5f5f5",
				borderRadius: "8px",
			}}
		>
			{items.map((item, index) => (
				<Box
					key={index}
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 0.5,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						p: 0.5,
					}}
				>
					{item.icon && (
						<Box sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
							{item.icon}
						</Box>
					)}
					{item.href ? (
						<Link
							href={item.href}
							underline="hover"
							color="primary.main"
							sx={{ fontWeight: 400, fontSize: "0.875rem" }}
						>
							{item.label}
						</Link>
					) : (
						<Typography
							color="text.secondary"
							sx={{ fontWeight: 600, fontSize: "0.875rem" }}
						>
							{item.label}
						</Typography>
					)}
					{index < items.length - 1 && (
						<ArrowForwardIos
							sx={{ fontSize: "0.75rem", color: "text.disabled" }}
						/>
					)}
				</Box>
			))}
		</Box>
	);
};

export default CustomBreadcrumbs;
