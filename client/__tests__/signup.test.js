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

    it("shows an error message with invalid password", async () => {
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
            "user@mail.com"
        );

        await user.type(screen.getByPlaceholderText("Enter Name"), "kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273070");

        // Take focus away from email input
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });


    it("shows an error message with invalid name", async () => {
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
            "user@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password1!");
        
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Name required")).toBeVisible();
    });

    it("shows an error with invalid id number", async () => {
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
            "user@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        await user.type(screen.getByPlaceholderText("Enter Name"), "kyle");
        
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid RSA ID Number")).toBeVisible();
    });

    it("redirects to verify on successful sign up", async () => {
        render(
            <MockedProvider mocks={validSignup} addTypename={false}>
                <SignUp />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "test@mail.com"
        );

        await user.type(screen.getByPlaceholderText("Enter Name"), "kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195273070");

        await user.type(screen.getByPlaceholderText("Password"), "password1!")

        await user.type(screen.getByPlaceholderText("Confirm Password"), "password1!");

        await user.click(screen.getByLabelText("resident"));

        await user.click(screen.getByRole("button"));

        await waitFor(async () => {
            expect(router.push).toBeCalled();
        })
    });
});
