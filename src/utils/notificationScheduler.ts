import cron from "node-cron";
import mongoose from "mongoose";
import Todo from "@/models/Todo";
import { dbConnect } from "@/libs/dbConnect";

async function sendNotification(todo: any) {
    console.log(`Sending notification for todo: ${todo.title}, due at ${new Date(todo.dueDate).toLocaleString()}`);
    await Todo.findByIdAndUpdate(todo._id, { notificationSent: true });
}

export function startNotificationScheduler() {
    cron.schedule("* * * * *", async () => {
        try {
            await dbConnect();

            const now = new Date();
            const inOneMinute = new Date(now.getTime() + 60 * 1000);

            const todosToNotify = await Todo.find({
                notifyEnabled: true,
                notificationSent: false,
                dueDate: {
                    $gte: now,
                    $lte: new Date(
                        inOneMinute.getTime() +
                        mongoose.models.Todo.schema.path("notifyMinutesBefore").options.max * 60 * 1000
                    ),
                },
            });

            for (const todo of todosToNotify) {
                const notificationTime = new Date(
                    todo.dueDate.getTime() - todo.notifyMinutesBefore * 60 * 1000
                );
                if (now >= notificationTime && now <= new Date(notificationTime.getTime() + 60 * 1000)) {
                    await sendNotification(todo);
                }
            }
        } catch (error: any) {
            console.error("Error in notification scheduler:", error);
        }
    });
}