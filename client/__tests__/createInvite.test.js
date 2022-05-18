import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { MockedProvider } from "@apollo/client/testing";

import CreateInvite from "../pages/createInvite";

import actualCreate from "zustand";
import { act } from "react-dom/test-utils";

describe("Login", () => {
    // a variable to hold reset functions for all stores declared in the app
    const storeResetFns = new Set();

    it("renders a heading", () => {
        // when creating a store, we get its initial state, create a reset function and add it in the set
        const create = (createState) => {
            const store = actualCreate(createState);
            const initialState = store.getState();
            storeResetFns.add(() =>
                store.setState(
                    access_token,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY"
                )
            );
            return store;
        };

        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        expect(screen.getAllByText("Invite")).toBeDefined();
    });

    it("shows an error message with invalid email", async () => {

        const create = (createState) => {
            const store = actualCreate(createState);
            const initialState = store.getState();
            storeResetFns.add(() =>
                store.setState(
                    access_token,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY"
                )
            );
            return store;
        };

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

        const create = (createState) => {
            const store = actualCreate(createState);
            const initialState = store.getState();
            storeResetFns.add(() =>
                store.setState(
                    access_token,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY"
                )
            );
            return store;
        };

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
        const create = (createState) => {
            const store = actualCreate(createState);
            const initialState = store.getState();
            storeResetFns.add(() =>
                store.setState(
                    access_token,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY"
                )
            );
            return store;
        };

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
        const create = (createState) => {
            const store = actualCreate(createState);
            const initialState = store.getState();
            storeResetFns.add(() =>
                store.setState(
                    access_token,
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY"
                )
            );
            return store;
        };

        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Visitor Email"), "admin@mail.com");
        await user.selectOptions(screen.getByRole("combobox"), ["UP-Student-ID"]);
        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273080");
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid UP student number")).toBeDefined();
    });

    // Reset all stores after each test run
    afterEach(() => {
        act(() => storeResetFns.forEach((resetFn) => resetFn()));
    });
});
