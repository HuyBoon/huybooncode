"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import CategoryManagement from "@/components/admin/CategoryManagement";
import Loader from "@/components/admin/Loader";

const CategoryManagementPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: 700, color: "text.primary" }}
				>
					Manage Todo Categories
				</Typography>
				<Button
					variant="outlined"
					onClick={() => router.push("/admin/todolist")}
					startIcon={<ArrowLeft size={20} />}
					sx={{ textTransform: "none", fontWeight: 500 }}
					aria-label="Back to todos"
				>
					Back to Todos
				</Button>
			</Box>
			<CategoryManagement />
		</Box>
	);
};

export default CategoryManagementPage;
