import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

import useAuth from "../store/authStore";

import Alert from "../components/Alert";
import UploadPopUp from "../components/UploadPopUp";

import { bulkSignInMutation } from "./__mocks__/uploadPopUp.mock";

const options = {
    position: positions.TOP_CENTER,
      timeout: 8000,
      offset: '30px',
      transition: transitions.SCALE
    }

describe("UploadPopUp", () => {
    const authHook = renderHook(() => useAuth());
    authHook.hydrate();
    act(() => {
        authHook.result.current.login(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
        );
    });

    it("should parse file", async () => {
       const refetch = jest.fn();
       render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider mocks={bulkSignInMutation} addTypename={false}>
                    <UploadPopUp 
                        setShowUploadPopUp={() => {}}
                        refetch={refetch}
                    />
                </MockedProvider>
            </AlertProvider>
        ); 
        expect(screen.getByText("Sign-In")).toBeVisible();
        
        const user = userEvent.setup();
        const fakeFile = new File(['hello'], 'file.csv', { type: "text/csv" }); 

        await userEvent.upload(screen.getByTestId("fileupload"), fakeFile);
        await user.click(screen.getByText("Sign-In"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });

        expect(refetch).toBeCalled();
    })

    it("should only allow csv file", async () => {
       const refetch = jest.fn();
       render(
            <AlertProvider {...options} template={Alert}>
            <MockedProvider mocks={bulkSignInMutation} addTypename={false}>
                <UploadPopUp 
                    setShowUploadPopUp={() => {}}
                    refetch={refetch}
                />
            </MockedProvider>
            </AlertProvider>
        ); 
        expect(screen.getByText("Sign-In")).toBeVisible();
        
        const user = userEvent.setup();
        const fakeFile = new File(['hello'], 'file.png', { type: "image/png" }); 

        await userEvent.upload(screen.getByTestId("fileupload"), fakeFile);
        await user.click(screen.getByText("Sign-In"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });

        expect(refetch).not.toHaveBeenCalled();
    })
})
