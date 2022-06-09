import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from '@apollo/client/testing';
import "@testing-library/jest-dom";

import React from "react";
import * as nextRouter from "next/router";

import { numInvitesValid, numInvitesOneLess, numInvitesEqual } from "./__mocks__/createInvite.mock";

import useAuth from "../../store/authStore";
import SignUp from "../../pages/signUp";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({route: "/signUp"}));

describe("Sign Up Integration", () => {
    it("it should redirect to the index page if the user already has a valid account", async () => {
        const authHook = renderHook(() => useAuth());

        authHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/");
        });
    }); 

    it("should redirect to the verify page if the user has already created an account, but not yet verified", async () => {
        const authHook = renderHook(() => useAuth());

        authHook.hydrate();

        act(() => {
            authHook.result.current.logout();
            authHook.result.current.setVerify();
        });

        console.log(authHook.result.current.verified);
        console.log(authHook.result.current.permission());

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        render(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );

        
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/verify");
        });
    });

});
