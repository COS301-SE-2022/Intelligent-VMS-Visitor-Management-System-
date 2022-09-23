import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import { signOutMutation, signOutMutationError } from "./__mocks__/signOutPopUp.mock";

import SignOutPopUp from "../components/SignOutPopUp";

describe("SignOutPopUp", () => {
    it("should render visitor id number", () => {
        render(
            <MockedProvider>
                <SignOutPopUp
                    refetch={() => {}}
                    currentButton={{add: () => {}}}
                    visitData={
                        { 
                            visitorName: "Kyle", 
                            idNumber: "0109195273070"
                        }
                    }
                    setShowSignOutModal={() => {}}
                    setSearch={() => {}}
                />
            </MockedProvider>
        );

        expect(screen.getByText("Confirm sign-out of visitor with id 0109195273070")).toBeVisible();
    })

    it("should sign out the current visitor", async () => {
        const refetch = jest.fn();
        render(
            <MockedProvider mocks={signOutMutation} addTypename={false}>
                <SignOutPopUp
                    refetch={refetch}
                    currentButton={{add: () => {}}}
                    visitData={
                        { 
                            visitorName: "Kyle", 
                            idNumber: "0109195273070",
                            inviteID: "1234"
                        }
                    }
                    setShowSignOutModal={() => {}}
                    setSearch={() => {}}
                />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.click(screen.getByTestId("signout-label"));
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });

        expect(refetch).toBeCalled();
    })

    it("should catch an error from api", async () => {
        const refetch = jest.fn();
        render(
            <MockedProvider mocks={signOutMutationError} addTypename={false}>
                <SignOutPopUp
                    refetch={refetch}
                    currentButton={{add: () => {}}}
                    visitData={
                        { 
                            visitorName: "Kyle", 
                            idNumber: "0109195273070",
                            inviteID: "1234"
                        }
                    }
                    setShowSignOutModal={() => {}}
                    setSearch={() => {}}
                />
            </MockedProvider>
        );
        
        const user = userEvent.setup();

        await user.click(screen.getByTestId("signout-label"));

        expect(refetch).not.toHaveBeenCalled();
    })


})

