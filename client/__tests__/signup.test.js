import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";

import { validSignup } from "./__mocks__/signup.mock";

import useAuth from "../store/authStore";
import SignUp from "../pages/signUp";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/signup" }));

describe("Sign-up", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByText("Tell Us About Yourself")).toBeInTheDocument();
    });

    it("shows an error message when no email is provided", async () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("shows an error message with invalid email", async () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "notvalidmail"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        expect(screen.getByText("Invalid email address")).toBeVisible();
    });
});
