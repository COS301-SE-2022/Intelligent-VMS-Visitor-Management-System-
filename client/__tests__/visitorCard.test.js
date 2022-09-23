import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";

import VisitorCard from "../components/VisitorCard";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("VisitorCard", () => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    const router = {
        push: jest.fn().mockImplementation(() => Promise.resolve(true)),
        prefetch: () => new Promise((resolve) => resolve),
        query: { name: "", email: "", idNumber: "", idDocType: "" },
    };
    useRouter.mockReturnValue(router);

    it("should render the visitor name", () => {
        render(
            <MockedProvider>
            <VisitorCard 
                name="Kyle"
                email="visitor@mail.com"
                numInvites={2}
            />
            </MockedProvider>
        );

        expect(screen.getByText("Kyle")).toBeVisible();
    })

    it("gets the most used invite data", async () => {
        render(
            <MockedProvider>
            <VisitorCard 
                name="Kyle"
                email="visitor@mail.com"
                numInvites={2}
            />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.click(screen.getByText("Invite"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
    })

})
