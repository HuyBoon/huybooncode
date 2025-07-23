import { Box, Button } from "@mui/material";
import { CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActionButton() {
	const router = useRouter();

	return (
		<Box sx={{ mt: 4, textAlign: "right" }}>
			<Button
				variant="contained"
				color="primary"
				onClick={() => router.push("/admin/todolist")}
				startIcon={<CheckSquare size={20} />}
				sx={{ textTransform: "none", fontWeight: 500 }}
			>
				Manage Tasks
			</Button>
		</Box>
	);
}
