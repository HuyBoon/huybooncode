import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";// Nhập authOptions từ tệp mới

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
