"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import AddJournalForm from "@/components/journal/AddJournalForm";
import JournalHistory from "@/components/journal/JournalHistory";
import JournalDetail from "@/components/journal/JournalDetail";
import { JournalType, MoodType, PaginationType } from "@/types/interface";

interface FormData {
  id?: string;
  title: string;
  content: string;
  mood: string;
  date: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  mood?: string;
  date?: string;
}

interface JournalLayoutProps {
  journals: JournalType[];
  moods: MoodType[];
  isLoading: boolean;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
  handleEditJournal: (journal: JournalType) => void;
  handleDeleteJournal: (id: string) => void;
  handleSelectJournal: (journal: JournalType) => void;
  handleCancel: () => void;
  initialJournalData?: JournalType;
  selectedJournal: JournalType | null;
  formData: FormData;
  formErrors: FormErrors;
  handleFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const JournalLayout: React.FC<JournalLayoutProps> = ({
  journals,
  moods,
  isLoading,
  pagination,
  setPagination,
  handleEditJournal,
  handleDeleteJournal,
  handleSelectJournal,
  handleCancel,
  initialJournalData,
  selectedJournal,
  formData,
  formErrors,
  handleFormChange,
  handleSubmit,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1400px",
        mx: "auto",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Journal Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={3}
            sx={{
              mb: 3,
              borderRadius: 2,
              minHeight: { xs: "auto", md: "450px" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {initialJournalData ? "Edit Journal" : "Add New Journal"}
              </Typography>
              <AddJournalForm
                moods={moods}
                initialData={initialJournalData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                formData={formData}
                formErrors={formErrors}
                handleChange={handleFormChange}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={3}
            sx={{
              mb: 3,
              borderRadius: 2,
              minHeight: { xs: "auto", md: "450px" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Journal Details
              </Typography>
              <JournalDetail journal={selectedJournal} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <JournalHistory
                journals={journals}
                moods={moods}
                initialPagination={pagination}
                handleEdit={handleEditJournal}
                handleDelete={handleDeleteJournal}
                handleSelectJournal={handleSelectJournal}
                loading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalLayout;