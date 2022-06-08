import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import * as nextRouter from "next/router";
import React, { useState } from "react";

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
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );

        expect(screen.getByText("admin@mail.com")).toBeInTheDocument();
    });

});
