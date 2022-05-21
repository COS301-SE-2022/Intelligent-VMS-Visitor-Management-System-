import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";
import { renderHook, act } from "@testing-library/react-hooks/server";
import * as nextRouter from "next/router";
import { useRouter } from "next/router";

import ErrorAlert from "../components/ErrorAlert";
import CreateInvite from "../pages/createInvite";
import useAuth from "../store/authStore";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("CreateInvite", () => {
    // a variable to hold reset functions for all stores declared in the app
    const storeResetFns = new Set();

    const inviteUnauthMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "visitor@mail.com",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        requiresParking: true,
                        )
                }
            `
        },
        result: {
            errors: [new GraphQLError("Unauthorized")],
        }
    }
    ];

    const inviteDataErrorMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "error@mail.com",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        requiresParking: true,
                        )
                }
            `,
        }, 
        result: {
            errors: [new GraphQLError("ERROR")],
        }
    }];

    const inviteDataMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "visitor@mail.com",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        requiresParking: true,
                        )
                }
            `
        },
        result: {
            data: {
                createInvite: {
                    "response": true
                }
            }
        }
    }];
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        expect(screen.getAllByText("Invite")).toBeDefined();
    });

    it("shows an error message with invalid email", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Visitor Email")).toBeDefined();

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText("Visitor Email"), "notvalidmail");

        // Just to cause blur event to be called on previous input
        await user.type(screen.getByPlaceholderText("Enter ID number"), "notvalidmail");

        expect(screen.getByText("Invalid email address")).toBeDefined();
        
    });

    it("shows an error message with invalid RSA ID", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Visitor Email")).toBeDefined();

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText("Visitor Email"), "valid@mail.com");

        // Just to cause blur event to be called on previous input
        await user.type(screen.getByPlaceholderText("Enter ID number"), "notvalidid");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid RSA ID")).toBeDefined();
        
    });

    it("should show an error if the visitor email field is ignored", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.click(screen.getByPlaceholderText("Visitor Email"));
        // Just to cause blur event to be called on previous input
        await user.type(screen.getByPlaceholderText("Enter ID number"), "notvalidmail");

        expect(screen.getByText("Required")).toBeDefined();
    });
    
    it("should show an error message on an invalid up student number", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Visitor Email"), "visitor@mail.com");
        await user.selectOptions(screen.getByRole("combobox"), ["UP-Student-ID"]);
        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273080");
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid UP student number")).toBeDefined();
    });

    it("redirects to unauthorized page when api error is unauthorized", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={inviteUnauthMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Visitor Email"), "visitor@mail.com");
        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);
        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273080");
        await user.click(screen.getByRole("checkbox"));
        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/expire");
        });

    });

    it("redirects to visitor dashboard when data is valid", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={inviteDataMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Visitor Email"), "visitor@mail.com");
        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);
        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273080");
        await user.click(screen.getByRole("checkbox"));
        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/visitorDashboard");
        });
    });

    it("displays the error message from the backend", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={inviteDataErrorMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Visitor Email"), "error@mail.com");
        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);
        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273080");
        await user.click(screen.getByRole("checkbox"));
        await user.click(screen.getByRole("button"));

    });

    // Reset all stores after each test run
    afterEach(() => {
        act(() => storeResetFns.forEach((resetFn) => resetFn()));
    });
});
