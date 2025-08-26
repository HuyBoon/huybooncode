import {
    LayoutDashboard,
    DollarSign,
    CheckSquare,
    NotebookPen,
    FileText,
    Calendar as CalendarIcon,
    Video,
    Settings,
    Clock,
    Pencil,
    Shapes,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

import React from "react";

export interface NavLink {
    url: string;
    label: string;
    icon?: React.ReactNode;
    submenu?: {
        url: string;
        label: string;
        icon?: React.ReactNode;
    }[];
}

export const navLinks: NavLink[] = [
    {
        url: "/admin/dashboard",
        label: "Dashboard",
        icon: React.createElement(LayoutDashboard, { size: 20 }),
    },
    {
        url: "/admin/quicknotes",
        label: "Quick Notes",
        icon: React.createElement(Pencil, { size: 20 }),
    },
    {
        url: "/admin/todolist",
        label: "To-Do List",
        icon: React.createElement(CheckSquare, { size: 20 }),
        submenu: [
            {
                url: "/admin/todolist/today",
                label: "Today",
                icon: React.createElement(Clock, { size: 16 }),
            },
            {
                url: "/admin/todolist/tomorrow",
                label: "Tomorrow",
                icon: React.createElement(CalendarIcon, { size: 16 }),
            },
        ],
    },
    {
        url: "/admin/finance",
        label: "HB's Finance",
        icon: React.createElement(DollarSign, { size: 20 }),
        submenu: [
            {
                url: "/admin/finance/categories",
                label: "Categories",
                icon: React.createElement(Shapes, { size: 16 }),
            },
            {
                url: "/admin/finance/income",
                label: "Income",
                icon: React.createElement(TrendingUp, { size: 16 }),
            },
            {
                url: "/admin/finance/expense",
                label: "Expense",
                icon: React.createElement(TrendingDown, { size: 16 }),
            },
        ],
    },
    {
        url: "/admin/journal",
        label: "Journal",
        icon: React.createElement(NotebookPen, { size: 20 }),
    },
    {
        url: "/admin/manageblogs",
        label: "Blogs",
        icon: React.createElement(FileText, { size: 20 }),
        submenu: [
            {
                url: "/admin/manageblogs/blogcategories",
                label: "Categories",
                icon: React.createElement(Shapes, { size: 16 }),
            },
        ]
    },
    {
        url: "/admin/calendar",
        label: "Calendar",
        icon: React.createElement(CalendarIcon, { size: 20 }),
    },
    {
        url: "/admin/media",
        label: "Media",
        icon: React.createElement(Video, { size: 20 }),
    },
    {
        url: "/admin/settings",
        label: "Settings",
        icon: React.createElement(Settings, { size: 20 }),
    },
];
