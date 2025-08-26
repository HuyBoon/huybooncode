import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const QuickNoteHeader: React.FC = () => {
	return (
		<AppBar
			position="sticky"
			sx={{
				bgcolor: "background.paper",
				borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
			}}
		>
			<Toolbar>
				<Typography variant="h6" sx={{ flexGrow: 1, color: "text.primary" }}>
					Quick Notes
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default QuickNoteHeader;
