"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Camera, User, Mail, Lock } from "lucide-react";
import { Grid } from "@mui/material";

export default function ProfilePage(): React.ReactNode {
	const { data: session, status, update } = useSession();
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: session?.user?.name || "",
		email: session?.user?.email || "",
		password: "",
		confirmPassword: "",
	});
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState(
		session?.user?.avatar || "/avatar.png"
	);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});
	const [isLoading, setIsLoading] = useState(false);

	// Initialize formData when session changes
	React.useEffect(() => {
		if (session?.user) {
			setFormData({
				name: session.user.name || "",
				email: session.user.email || "",
				password: "",
				confirmPassword: "",
			});
			setAvatarPreview(session.user.avatar || "/avatar.png");
		}
	}, [session]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setSnackbar({
				open: true,
				message: "Passwords do not match",
				severity: "error",
			});
			return;
		}

		setIsLoading(true);
		try {
			const formDataToSend = new FormData();
			formDataToSend.append("name", formData.name);
			formDataToSend.append("email", formData.email);
			if (formData.password) {
				formDataToSend.append("password", formData.password);
			}
			if (avatar) {
				formDataToSend.append("avatar", avatar);
			}

			const res = await fetch("/api/profile", {
				method: "PUT",
				body: formDataToSend,
			});

			if (!res.ok) {
				throw new Error("Failed to update profile");
			}

			const updatedUser = await res.json();
			await update({ ...session, user: updatedUser });

			setSnackbar({
				open: true,
				message: "Profile updated successfully",
				severity: "success",
			});
			setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
			setAvatar(null);
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Failed to update profile",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Stack spacing={3} sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
			<Typography
				variant="h4"
				sx={{ fontWeight: "bold", color: "text.primary" }}
			>
				Profile
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4, lg: 4 }}>
					<Card sx={{ boxShadow: 3, bgcolor: "background.paper" }}>
						<CardContent sx={{ textAlign: "center", py: 4 }}>
							<div className="relative inline-block">
								<Avatar
									src={avatarPreview}
									alt={session?.user?.name || "User"}
									sx={{
										width: 120,
										height: 120,
										mx: "auto",
										mb: 2,
										border: "2px solid",
										borderColor: "primary.main",
									}}
								/>
								<label
									htmlFor="avatar-upload"
									className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
								>
									<Camera size={20} className="text-white" />
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleAvatarChange}
									/>
								</label>
							</div>
							<Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
								{session?.user?.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{session?.user?.email}
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Typography variant="body2" color="text.secondary">
								Last updated: {new Date().toLocaleDateString()}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 8, lg: 8 }}>
					<Card sx={{ boxShadow: 3, bgcolor: "background.paper" }}>
						<CardContent>
							<Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
								Update Profile
							</Typography>
							<form onSubmit={handleSubmit}>
								<Stack spacing={3}>
									<TextField
										fullWidth
										label="Full Name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										InputProps={{
											startAdornment: (
												<User size={20} className="mr-2 text-gray-500" />
											),
										}}
										variant="outlined"
										required
									/>
									<TextField
										fullWidth
										label="Email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleInputChange}
										InputProps={{
											startAdornment: (
												<Mail size={20} className="mr-2 text-gray-500" />
											),
										}}
										variant="outlined"
										required
									/>
									<TextField
										fullWidth
										label="New Password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleInputChange}
										InputProps={{
											startAdornment: (
												<Lock size={20} className="mr-2 text-gray-500" />
											),
										}}
										variant="outlined"
									/>
									<TextField
										fullWidth
										label="Confirm Password"
										name="confirmPassword"
										type="password"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										InputProps={{
											startAdornment: (
												<Lock size={20} className="mr-2 text-gray-500" />
											),
										}}
										variant="outlined"
									/>
									<Button
										type="submit"
										variant="contained"
										color="primary"
										disabled={isLoading}
										sx={{ py: 1.5, fontWeight: "medium" }}
									>
										{isLoading ? "Saving..." : "Save Changes"}
									</Button>
								</Stack>
							</form>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Stack>
	);
}
