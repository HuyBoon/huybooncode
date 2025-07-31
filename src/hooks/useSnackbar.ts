import { useState } from "react";

interface SnackbarState {
    open: boolean;
    message: string;
    severity: "success" | "error";
}

export const useSnackbar = () => {
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
        severity: "success" | "error";
    }) => {
        setSnackbar({ open, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return { snackbar, showSnackbar, closeSnackbar };
};