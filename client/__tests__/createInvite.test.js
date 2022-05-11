import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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

        expect(screen.getByText("Let's Invite Someone🔥")).toBeInTheDocument();
    });

    // Reset all stores after each test run
    afterEach(() => {
        act(() => storeResetFns.forEach((resetFn) => resetFn()));
    });
});
