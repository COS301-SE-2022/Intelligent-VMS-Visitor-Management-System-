import create from "zustand";
import { persist } from "zustand/middleware";

import jwtDecode from "jwt-decode";

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
			},
            decodedToken: () => {
                try {
                    const token = jwtDecode(get().access_token);
                    return token;
                } catch(e) {
                    return {};
                }
            },
		}),
		{ name: "auth" }
	)
);

export default useAuth;
