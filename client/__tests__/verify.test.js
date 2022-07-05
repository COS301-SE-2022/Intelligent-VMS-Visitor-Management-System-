import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as nextRouter from "next/router";

import { validVerify } from "./__mocks__/verify.mock";
import Verify from "../pages/verify";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: "/verify?verifyID=4e036ea3-40ec-4622-8317-cb5898f58fdd&email=admin@mail.com",
}));

describe("Verify", () => {
    it("renders a heading", () => {
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
            query: {
                verifyID: "4e036ea3-40ec-4622-8317-cb5898f58fdd",
                email: "admin@mail.com",
            },
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider>
                <Verify />
            </MockedProvider>
        );

        expect(
            screen.getByText("Please check your email to verify your account")
        );
    });

    it("redirects to the authorize page on valid data", async () => {
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
            query: {
                id: "4e036ea3-40ec-4622-8317-cb5898f58fdd",
                email: "admin@mail.com",
            },
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider mocks={validVerify} addTypename={false}>
                <Verify />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(router.push).toHaveBeenCalledWith("/authorize");
        });
    });
});
