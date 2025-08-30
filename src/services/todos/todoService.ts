// src/services/todos/todoService.ts
import { dbConnect } from "@/libs/dbConnection";
import Category from "@/models/Category";
import Todo from "@/models/Todo";
import { TodoType, CategoryType, PaginationType } from "@/types/interface";


export async function getInitialTodos(limit = 10) {
    await dbConnect();

    let initialTodos: TodoType[] = [];
    let initialTodoCategories: CategoryType[] = [];
    let initialPagination: PaginationType = {
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
    };
    let initialError: string | null = null;

    try {
        const todoCategories = await Category.find();
        initialTodoCategories = todoCategories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
        }));

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const todos = await Todo.find({
            dueDate: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        })
            .sort({ dueDate: -1 })
            .limit(limit);

        const totalTodos = await Todo.countDocuments({
            dueDate: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        initialTodos = todos.map((todo) => ({
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description || "",
            status: todo.status,
            category: todo.category.toString(),
            priority: (["low", "medium", "high"].includes(todo.priority)
                ? todo.priority
                : "medium") as "low" | "medium" | "high",
            dueDate: todo.dueDate.toISOString(),
            notifyEnabled: todo.notifyEnabled,
            notifyMinutesBefore: todo.notifyMinutesBefore,
            notificationSent: todo.notificationSent,
            createdAt: todo.createdAt.toISOString(),
            updatedAt: todo.updatedAt.toISOString(),
        }));

        initialPagination = {
            page: 1,
            limit,
            total: totalTodos,
            totalPages: Math.ceil(totalTodos / limit),
        };

        return { initialTodos, initialTodoCategories, initialPagination, initialError: null };
    } catch (error: any) {
        console.error("Error fetching initial todo data:", error);
        initialError = "Failed to connect to database";

        return {
            initialTodos: [
                {
                    id: "temp-todo-1",
                    title: "Sample Todo",
                    description: "Sample todo description",
                    status: "Pending",
                    category: "temp-cat-1",
                    priority: "medium",
                    dueDate: new Date().toISOString(),
                    notifyEnabled: false,
                    notifyMinutesBefore: 15,
                    notificationSent: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            initialTodoCategories: [
                {
                    id: "temp-todo-cat-1",
                    name: "Sample Todo Category",
                },
            ],
            initialPagination: {
                page: 1,
                limit,
                total: 1,
                totalPages: 1,
            },
            initialError,
        };
    }
}



