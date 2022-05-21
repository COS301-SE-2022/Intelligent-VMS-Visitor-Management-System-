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
                    return undefined;
                }
            },
            permission: () => {
                const token = get().decodedToken();
                if(token) {
                    return token.permission;
                } else {
                    return -1;
                }
            },
            navLinks: () => {
                const permission = get().permission();
                
                if(permission !== -1) {
                    switch(permission) {
                        case 0:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Admin Dashboard", path: "/adminDashboard"},
                                { content: "Dashboard", path: "/visitorDashboard"},
                                { content: "Logout", path: "/", onClick: () => get().logout() }
                            ]; 

                        case 1:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Dashboard", path: "/visitorDashboard" },
                                { content: "Logout", path: "/", onClick: () => get().logout() },
                            ];
                        

                        case 2:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Dashboard", path: "/visitorDashboard" },
                                { content: "Logout", path: "/", onClick: () => get().logout() },
                            ];
                    }
                } else {
                    return [
                        { content: "Login", path: "/login" },
                        { content: "Signup", path: "/signUp"}
                    ];
                }

            },
            numParkingSpots: 22,
            updateParkingSpots: (newVal) => {
				set((state) => ({
					numParkingSpots: newVal
				}));
            },
            incParkingSpots: () => {
                set((state) => ({
                    numParkingSpots: get().numParkingSpots+1
                }));
            },
            decParkingSpots: () => {
                set((state) => ({
                    numParkingSpots: get().numParkingSpots-1
                }));
            },
		}),
		{ name: "auth" }
	)
);

export default useAuth;
