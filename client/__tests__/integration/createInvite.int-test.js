import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from '@apollo/client/testing';
import "@testing-library/jest-dom";

import React from "react";
import * as nextRouter from "next/router";

import { numInvitesValid, numInvitesOneLess, numInvitesEqual } from "./__mocks__/createInvite.mock";

import useAuth from "../../store/authStore";
import CreateInvite from "../../pages/createInvite";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({route: "/createInvite"}));

describe("Create Invite Integration", () => {

    it("will allow an invite to be sent if num invites sent is less than the amount allowed", async () => {
        const authHook = renderHook(() => useAuth());

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);
        
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6Mn0.JKZdvuyQbYwujcKUDefoavkRrGrMnB_eq8Fi2yl1u78"
            );
        });

        render(
            <MockedProvider mocks={numInvitesValid} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );    
        
        // Assert that the global store was update correctly and decodes the token correctly
        expect(authHook.result.current.decodedToken().email).toEqual("resident@mail.com");
        
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

        // Type in visitor name
        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "dave"
        );

        // Enter invite date
        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );
        
        // Click submit
        await user.click(screen.getByRole("button"));

        // Wait for the the request to take affect
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            // Assert that the request went through 
            expect(router.push).toHaveBeenCalledWith("/visitorDashboard");
        });
        
    });

    it("will allow an invite to be sent if num invites sent is one less than the amount allowed", async () => {
        const authHook = renderHook(() => useAuth());

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);
        
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6Mn0.JKZdvuyQbYwujcKUDefoavkRrGrMnB_eq8Fi2yl1u78"
            );
        });

        render(
            <MockedProvider mocks={numInvitesOneLess} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );    
        
        // Assert that the global store was update correctly and decodes the token correctly
        expect(authHook.result.current.decodedToken().email).toEqual("resident@mail.com");
        
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

        // Type in visitor name
        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "dave"
        );

        // Enter invite date
        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );
        
        // Click submit
        await user.click(screen.getByRole("button"));

        // Wait for the the request to take affect
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            // Assert that the request went through 
            expect(router.push).toHaveBeenCalledWith("/visitorDashboard");
        });
    });

    it("will return an error when an invite is sent when num invites used is equal to num invites allowed", async () => {
        const authHook = renderHook(() => useAuth());

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);
        
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJyZXNpZGVudEBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6Mn0.JKZdvuyQbYwujcKUDefoavkRrGrMnB_eq8Fi2yl1u78"
            );
        });

        render(
            <MockedProvider mocks={numInvitesEqual} addTypename={false}>
                <CreateInvite />
            </MockedProvider>
        );    
        
        // Assert that the global store was update correctly and decodes the token correctly
        expect(authHook.result.current.decodedToken().email).toEqual("resident@mail.com");
        
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

        // Type in visitor name
        await user.type(
            screen.getByPlaceholderText("Enter Visitor Name"),
            "dave"
        );

        // Enter invite date
        await user.type(
            screen.getByPlaceholderText("Visit Date"),
            "2020-08-21"
        );
        
        // Click submit
        await user.click(screen.getByRole("button"));

        // Wait for the the request to take affect
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            // Assert that the request went through 
            expect(screen.getByRole("button")).toBeDisabled();
        });
    });

});

