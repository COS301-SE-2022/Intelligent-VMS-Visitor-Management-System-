import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import axios from "axios";
import AxiosMockAdapter from 'axios-mock-adapter';

import * as nextRouter from "next/router";

import { validSignup } from "./__mocks__/signup.mock";

import useAuth from "../store/authStore";
import ReceptionistSignUp from "../pages/receptionist/signUp";
import SignUp from "../pages/signUp";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/signup" }));

const axiosMockInstance = axios.create();
const axiosMockAdapterInstance= new AxiosMockAdapter(axiosMockInstance, { delayResponse: 0 });

axiosMockAdapterInstance
   .onPost('http://localhost:3001/user/signup')
   .reply(() => {
    return [200, { data: {
        result: true
    }}]
}
);

describe("Receptionist-Sign-up", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByText("Tell Us About Yourself")).toBeInTheDocument();
    });

    it("shows an error message when no email is provided", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
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
                <ReceptionistSignUp />
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

    it("shows a message when no name is provided", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Password"), "dwdwd");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Name required")).toBeVisible();
    });

    it("shows a message when an invalid name is provided", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "1290190");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid name")).toBeVisible();
    });

    it("shows an error on invalid ID number", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Invalid RSA ID Number")).toBeVisible();
    });

    it("shows an error when no password is provided", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("shows an error when no confirm password is provided", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Required")).toBeVisible();
    });

    it("shows an error when password is invalid", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.type(screen.getByPlaceholderText("Password"), "pas!");

        await user.type(screen.getByPlaceholderText("Confirm Password"), "pas!");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Password needs minimum of 8 characters with one number and one special character")).toBeVisible();
    });

    it("shows an error when password and confirm password is not same", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        await user.type(screen.getByPlaceholderText("Confirm Password"), "password2!");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Passwords do not match")).toBeVisible();
    });

    it("shows an error when pin number is invalid", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        await user.type(screen.getByPlaceholderText("Confirm Password"), "password1!");

        await user.type(screen.getByPlaceholderText("5 digit Confirmation Pin"), "dwiioiodw");

        await user.click(screen.getByRole("button"));

        expect(screen.getByText("Pin needs to be a 5 digit number")).toBeVisible();
    });

    it("shows an error if an image with no face is uploaded", async () => {
        render(
            <MockedProvider>
                <ReceptionistSignUp />
            </MockedProvider>
        );

        expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();

        const user = userEvent.setup();

        // Type in invalid email
        await user.type(
            screen.getByPlaceholderText("Your Email"),
            "admin@mail.com"
        );

        // Take focus away from email input
        await user.type(screen.getByPlaceholderText("Enter Name"), "Kyle");

        await user.type(screen.getByPlaceholderText("Enter ID number"), "0109195283090");

        await user.type(screen.getByPlaceholderText("Password"), "password1!");

        await user.type(screen.getByPlaceholderText("Confirm Password"), "password1!");

        await user.type(screen.getByPlaceholderText("5 digit Confirmation Pin"), "19091");

        const fakeFile = new File(['hello'], 'file.png', { type: "image/png" }); 

        await userEvent.upload(screen.getByTestId("fileupload"), fakeFile);

        await user.click(screen.getByRole("button"));

    });

});
