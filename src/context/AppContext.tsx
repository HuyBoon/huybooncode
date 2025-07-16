"use client";

import { SessionProvider, useSession } from "next-auth/react";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

type UserRole = "admin" | "user";

interface UserContextProps {
	user: {
		id: string;
		email: string;
		name: string;
		avatar: string;
		role: UserRole;
	} | null;
	isAdmin: boolean;
	profileFetched: boolean;
	status: "authenticated" | "unauthenticated" | "loading";
	error: string | null;
}

interface AppProviderProps {
	children: ReactNode;
}

const UserContext = createContext<UserContextProps | null>(null);

export function useUser(): UserContextProps {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within an AppProvider");
	}
	return context;
}

function UserProvider({ children }: AppProviderProps) {
	const { data: session, status } = useSession();
	const [user, setUser] = useState<UserContextProps["user"]>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [profileFetched, setProfileFetched] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			const profile = {
				id: session.user.id,
				email: session.user.email || "",
				name: session.user.name || "",
				avatar: session.user.avatar || "",
				role: session.user.role as UserRole,
			};
			setUser(profile);
			setIsAdmin(profile.role === "admin");
			setProfileFetched(true);
			setError(null);
		} else if (status === "unauthenticated") {
			setUser(null);
			setIsAdmin(false);
			setProfileFetched(false);
			setError(null);
		}
	}, [status, session]);

	return (
		<UserContext.Provider
			value={{
				user,
				isAdmin,
				profileFetched,
				status,
				error,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<SessionProvider>
			<UserProvider>{children}</UserProvider>
		</SessionProvider>
	);
}
