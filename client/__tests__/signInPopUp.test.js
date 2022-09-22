import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import SignInPopUp from "../components/SignInPopUp";

import useAuth from "../store/authStore";

describe("SignInPopUp", () => {
    const authHook = renderHook(() => useAuth());
    authHook.hydrate();
    act(() => {
        authHook.result.current.login(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
        );
    });

    it("Renders the camera when verify is false", async () => {
        render(
            <MockedProvider>
                <SignInPopUp 
                    refetch={() => {}}
                    showSignInModal={true}
                    setShowSignInModal={() => {}}
                    setSearch={() => {}}
                />
            </MockedProvider>
        );

        await waitFor(() => screen.getByText("Camera not available"));
        expect(screen.getByText("Ensure face is visible in camera")).toBeVisible();
        const user = userEvent.setup();

        await user.click(screen.getByText("Authorize"));

    })
});
