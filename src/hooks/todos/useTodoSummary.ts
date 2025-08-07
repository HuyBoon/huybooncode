import { useMemo } from "react";
import { TodoType, StatusType } from "@/types/interface";

interface UseTodoSummaryProps {
    todos: TodoType[];
    statuses: StatusType[];
}

interface SummaryData {
    status: string;
    count: number;
    icon: string;
}

export const useTodoSummary = ({ todos, statuses }: UseTodoSummaryProps) => {
    const summaryByStatus = useMemo(() => {
        const summary: SummaryData[] = statuses.map((status) => ({
            status: status.name,
            count: todos.filter((todo) => todo.status === status.id).length,
            icon: status.icon,
        }));
        return summary;
    }, [todos, statuses]);

    const summaryByPriority = useMemo(() => {
        const priorities = ["low", "medium", "high"];
        return priorities.map((priority) => ({
            priority,
            count: todos.filter((todo) => todo.priority === priority).length,
        }));
    }, [todos]);

    const totalTodos = useMemo(() => todos.length, [todos]);

    return {
        summaryByStatus,
        summaryByPriority,
        totalTodos,
    };
};