import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";
import React, { useState } from "react";

import { validPageLoad } from "./__mocks__/adminDashboard.mock";
import ResizeObserver from "./__mocks__/resizeObserver.mock";

import AdminDashboard from "../pages/adminDashboard";
import useAuth from "../store/authStore";
import { useDateRange } from "../hooks/useDateRange.hook";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("AdminDashboard", () => {
    it("renders a heading", () => {
        jest.mock("react-chartjs-2", () => ({
            Line: () => null,
        }));
        const authHook = renderHook(() => useAuth());
        const dateRangeHook = renderHook(() => useDateRange(4));

        authHook.hydrate();
        dateRangeHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });

        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );

        expect(screen.getAllByText("admin").length).toEqual(1);
    });

    it("renders save and cancel buttons", async () => {
        jest.mock("react-chartjs-2", () => ({
            Line: () => null,
        }));
        const authHook = renderHook(() => useAuth());
        const dateRangeHook = renderHook(() => useDateRange(7));

        authHook.hydrate();
        dateRangeHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });

        render(
            <MockedProvider mocks={validPageLoad} addTypename={false}>
                <AdminDashboard />
            </MockedProvider>
        );

        const user = userEvent.setup();

        user.click(screen.getByTestId("increaseInvites"));
    });
});
