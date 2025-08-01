// src/app/admin/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientLayoutWrapper from "@/components/admin/ClientLayoutWrapper";
import { SnackbarProvider } from "@/context/SnackbarContext";

const theme = createTheme();

export default function AdminLayout({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SnackbarProvider>
					<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
				</SnackbarProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
