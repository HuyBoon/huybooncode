"use client";
import ClientLayoutWrapper from "@/components/admin/ClientLayoutWrapper";

import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme();

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
		</ThemeProvider>
	);
}
