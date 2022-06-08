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
        await user.type(screen.getByPlaceholderText("Your Email"), "notvalidmail");

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        expect(screen.getByText("Invalid email address")).toBeVisible();
    });

    it("shows an error message when no password is provided", async () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(screen.getByPlaceholderText("Your Email"), "test@mail.com");

        // Submit the form
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("shows an error message when invalid password is provided", async () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in valid email
        await user.type(screen.getByPlaceholderText("Your Email"), "test@mail.com");

        // Type in invalid password 
        await user.type(screen.getByPlaceholderText("Password"), "password");

        // Confirm invalid password 
        await user.type(screen.getByPlaceholderText("Confirm Password"), "password");

        // Submit the form
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Password needs minimum of 8 characters with one number and one special character")).toBeVisible();
    });

    it("shows an error message when the passwords provided do not match", async () => {
        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in valid email
        await user.type(screen.getByPlaceholderText("Your Email"), "test@mail.com");

        // Type in invalid password 
        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        // Confirm invalid password 
        await user.type(screen.getByPlaceholderText("Confirm Password"), "password");

        // Submit the form
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Passwords do not match")).toBeVisible();
    });

    it("redirects to the verify page with valid data", async () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={validSignup} addTypename={false}>
                <SignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in valid email
        await user.type(screen.getByPlaceholderText("Your Email"), "test@mail.com");

        // Type in invalid password 
        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        // Confirm invalid password 
        await user.type(screen.getByPlaceholderText("Confirm Password"), "password1!");

        // Select resident radio button
        await user.click(screen.getByDisplayValue("resident"));

        // Submit the form
        await user.click(screen.getByRole("button"));

        // Wait for submission to take affect
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(router.push).toHaveBeenCalledWith("/verify");
        });
    });
    
});
