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
				set((state) => ({
                    verified: false
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
                    return -999;
                }
            },
            navLinks: () => {
                const permission = get().permission();
                
                if(permission > -1) {
                    switch(permission) {
                        case 0:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Your Dashboard", path: "/visitorDashboard"},
                                { content: "Admin Dashboard", path: "/adminDashboard"},
                                { content: "Reporting", path: "/reporting"},
                                { content: "Manage Users", path: "/authorizeUser"},
                                { content: "Logout", path: "/", onClick: () => get().logout() }
                            ]; 

                        case 1:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Your Dashboard", path: "/visitorDashboard" },
                                { content: "Manage Residents", path: "/authorizeUser"},
                                { content: "Receptionist Dashboard", path: "/receptionistDashboard" },
                                { content: "Logout", path: "/", onClick: () => get().logout() },
                            ];
                        

                        case 2:
                            return [
                                { content: "Create Invite", path: "/createInvite" },
                                { content: "Your Dashboard", path: "/visitorDashboard" },
                                { content: "Logout", path: "/", onClick: () => get().logout() },
                            ];
                    }
                } else if(permission === -1 || permission === -2 || permission === -3){
                    return [
                        { content: "Authorize", path: "/authorize" },
                        { content: "Logout", path: "/", onClick: () => get().logout() },
                    ]
                } else {
                    return [
                        { content: "Login", path: "/login" },
                        { content: "Sign up", path: "/signUp"}

                    ];
                }

            },
            verified: false,
            setVerify: () => {
                set((state) => ({
                    verified: true                     
                }));
            }
		}),
		{ name: "auth" }
	)
);

export default useAuth;
