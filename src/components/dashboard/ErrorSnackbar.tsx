import { Snackbar, Alert } from "@mui/material";

interface ErrorSnackbarProps {
	open: boolean;
	message: string;
	severity: "success" | "error" | "warning";
	onClose: () => void;
}

export default function ErrorSnackbar({
	open,
	message,
	severity,
	onClose,
}: ErrorSnackbarProps) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert
				onClose={onClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
}
