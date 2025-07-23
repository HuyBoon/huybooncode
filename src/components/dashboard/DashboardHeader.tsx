import { Typography } from "@mui/material";
import { Session } from "next-auth";

interface DashboardHeaderProps {
	session: Session | null;
}

export default function DashboardHeader({ session }: DashboardHeaderProps) {
	return (
		<Typography
			variant="h4"
			sx={{ fontWeight: "bold", color: "text.primary", textAlign: "left" }}
		>
			Bonjour, {session?.user?.name || "User"}!
		</Typography>
	);
}
