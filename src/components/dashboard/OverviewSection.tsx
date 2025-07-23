import { Grid } from "@mui/material";
import OverviewCard from "./OverviewCard";

interface Stat {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
}

interface OverviewSectionProps {
	stats: Stat[];
}

export default function OverviewSection({ stats }: OverviewSectionProps) {
	return (
		<Grid container spacing={3}>
			{stats.map((stat, index) => (
				<Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
					<OverviewCard {...stat} index={index} />
				</Grid>
			))}
		</Grid>
	);
}
