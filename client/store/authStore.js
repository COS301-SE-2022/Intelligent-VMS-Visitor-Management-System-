import create from "zustand";
import { persist } from "zustand/middleware";

const useAuth = create(
	persist(
		(set,get) => ({
			access_token: "",
			login: (access_token) => {
				set((state) => ({
					access_token: access_token
				}));
			},
			logout: () => {
				set((state) => ({
					access_token: ""
				}));
			}
		}),
		{ name: "auth" }
	)
);

export default useAuth;