import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import Alert from "../components/Alert";
import SignInPopUp from "../components/SignInPopUp";

import useAuth from "../store/authStore";

const options = {
    position: positions.TOP_CENTER,
      timeout: 8000,
      offset: '30px',
      transition: transitions.SCALE
}


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
            <AlertProvider {...options} template={Alert}>
                <MockedProvider>
                    <SignInPopUp 
                        refetch={() => {}}
                        showSignInModal={true}
                        setShowSignInModal={() => {}}
                        setSearch={() => {}}
                    />
                </MockedProvider>
            </AlertProvider>
        );

        await waitFor(() => screen.getByText("Camera not available"));
        expect(screen.getByText("Ensure face is visible in camera")).toBeVisible();
        const user = userEvent.setup();

        await user.click(screen.getByText("Authorize"));

    })
});
