import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";

import { validLogin, errorMock } from "./__mocks__/login.mock";

import useAuth from "../store/authStore";
import Login from "../pages/login";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("Login", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );
        expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });

    it("shows an error message when no email is provided", async () => {
        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("shows an error message with invalid email", async () => {
        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(screen.getByPlaceholderText("Email"), "notvalidmail");

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password");

        expect(screen.getByText("Invalid email address")).toBeVisible();
    });

    it("shows an error message when no password is provided", async () => {
        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(screen.getByPlaceholderText("Email"), "test@mail.com");

        // Submit the form
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("should redirect page to create invite page on succesful login", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={validLogin} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText("Email"), "admin@mail.com");
        await user.type(screen.getByPlaceholderText("Password"), "password");
        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

    });

    it("should show an error message for any other API error", async () => {
        render(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText("Email"), "admin@mail.com");
        await user.type(screen.getByPlaceholderText("Password"), "password");
        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

    });
});
