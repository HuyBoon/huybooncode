import { MoodType, StatusType } from "@/types/interface";

export const defaultStatuses: StatusType[] = [
    { id: "pending", name: "Pending", icon: "⏳" },
    { id: "in-progress", name: "In Progress", icon: "🔄" },
    { id: "completed", name: "Completed", icon: "✅" },
];

export const moods: MoodType[] = [
    { id: "1", name: "Happy", emoji: "😊" },
    { id: "2", name: "Sad", emoji: "😢" },
    { id: "3", name: "Neutral", emoji: "😐" },
    { id: "4", name: "Excited", emoji: "🎉" },
    { id: "5", name: "Anxious", emoji: "😓" },
];