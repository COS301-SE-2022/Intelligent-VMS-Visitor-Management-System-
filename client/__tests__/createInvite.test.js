import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";

import CreateInvite from "../pages/createInvite";
import useAuth from "../store/authStore";

import {
    inviteUnauthMock,
    unAuthInvitesMock,
    inviteDataErrorMock,
    inviteLimitReached,
    inviteLimitNotReached,
    inviteDataMock,
} from "./__mocks__/createInvite.mock";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("CreateInvite", () => {
    const authHook = renderHook(() => useAuth());
    authHook.hydrate();
    act(() => {
        authHook.result.current.login(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
        );
    });
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    const router = {
        push: jest.fn().mockImplementation(() => Promise.resolve(true)),
        prefetch: () => new Promise((resolve) => resolve),
        query: { name: "", email: "", idNumber: "", idDocType: "" },
    };
    useRouter.mockReturnValue(router);

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

        // Setup user event object
        const user = userEvent.setup();

        // Type email into input box
        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "notvalidmail"
        );

        // Just to cause blur event to be called on previous input
        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "notvalidmail"
        );

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

        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "valid@mail.com"
        );

        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);

        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "notvalidid"
        );

        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "Dave"
        );

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid RSA ID Number")).toBeDefined();
    });

    it("should show an error if the visitor email field is ignored", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.click(screen.getByPlaceholderText("Visitor Email"));

        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "notvalidmail"
        );

        expect(screen.getByText("Required")).toBeDefined();
    });

    it("should show an error message on an invalid up student number", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "visitor@mail.com"
        );

        await user.selectOptions(screen.getByRole("combobox"), [
            "UP-Student-ID",
        ]);

        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "0109195273080"
        );

        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "Dave"
        );

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid UP student number")).toBeDefined();
    });

    it("should show an error message when no visitor name is provided", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        // Create user event generator
        const user = userEvent.setup();

        // Type in visitor email in field
        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "visitor@mail.com"
        );

        // Select RSA-ID option from comboxbox
        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);

        // Type ID number into field
        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "0109195273080"
        );

        // Click submit button
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeDefined();
    });

    it("redirects to expire page when query error is unauthorized", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });

        render(
            <MockedProvider mocks={unAuthInvitesMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
    });

    it("redirects to unauthorized page when api error is unauthorized", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });

        render(
            <MockedProvider mocks={inviteUnauthMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "visitor@mail.com"
        );

        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);

        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "0109195273080"
        );

        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "Dave"
        );

        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );

        await user.click(screen.getByRole("checkbox"));

        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
    });

    it("should show an error message when name is invalid", async () => {
        render(
            <MockedProvider>
                <CreateInvite />
            </MockedProvider>
        );

        // Create user event generator
        const user = userEvent.setup();

        // Type in visitor email in field
        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "visitor@mail.com"
        );

        // Select RSA-ID option from comboxbox
        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);

        // Type ID number into field
        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "0109195273080"
        );

        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "12232"
        );

        await user.click(screen.getByRole("button"));
    });

    it("redirects to visitor dashboard when data is valid", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        // SSR => Wait till page is hydrated with JS code
        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });

        render(
            <MockedProvider mocks={inviteDataMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText("Visitor Email"),
            "visitor@mail.com"
        );

        await user.selectOptions(screen.getByRole("combobox"), ["RSA-ID"]);

        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "Dave"
        );

        await user.type(
            screen.getByPlaceholderText("Enter ID number"),
            "0109195273080"
        );

        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );

        await user.click(screen.getByRole("checkbox"));

        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
    });

    it("should show when the invite limit is reached", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsIm5hbWUiOiJyZXNpZGVudCIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6Mn0.XAKWsYNFj5Zgt0iv9781q4WziJv9toC-NuuIXpsBGSA"
            );
        });

        render(
            <MockedProvider mocks={inviteLimitReached} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
    });

    it("should show allow invite to be created when invite limit is not reached", async () => {
        const { result, hydrate } = renderHook(() => useAuth());
        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.9YXDzBFoNzfZJ0tw73f3RTcWmxEkJjcMcs9bwtSGykA"
            );
        });

        render(
            <MockedProvider mocks={inviteLimitNotReached} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(screen.getByRole("button")).toBeEnabled();
        });
    });

    it("should show an error alert if given an error from api", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.9YXDzBFoNzfZJ0tw73f3RTcWmxEkJjcMcs9bwtSGykA"
            );
        });

        render(
            <MockedProvider mocks={inviteDataErrorMock} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
    });
});
