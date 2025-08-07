import { createContext, useContext, useState, ReactNode } from "react";

interface SnackbarState {
	open: boolean;
	message: string;
	severity: "success" | "error" | "warning";
}

interface SnackbarContextType {
	snackbar: SnackbarState;
	showSnackbar: (args: {
		open: boolean;
		message: string;
		severity: "success" | "error" | "warning";
	}) => void;
	closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		open: false,
		message: "",
		severity: "success",
	});

	const showSnackbar = ({
		open,
		message,
		severity,
	}: {
		open: boolean;
		message: string;
		severity: "success" | "error" | "warning";
	}) => {
		setSnackbar({ open, message, severity });
	};

	const closeSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	return (
		<SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
			{children}
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = () => {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return context;
};
