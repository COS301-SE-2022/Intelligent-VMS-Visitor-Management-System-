import { MockedProvider } from "@apollo/client/testing";
import { renderHook, act } from "@testing-library/react-hooks/server";
import { gql } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as nextRouter from "next/router";

import {
    validDataMock,
    noDataMock,
    cancelInviteMock,
    unauthReq,
    errorReq,
} from "./__mocks__/visitorDashboard.mock";
import ResizeObserver from "./__mocks__/resizeObserver.mock";
import useAuth from "../store/authStore";
import VisitorDashboard from "../pages/visitorDashboard";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("VisitorDashboard", () => {
    it("renders a heading", () => {
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
                <VisitorDashboard />
            </MockedProvider>
        );
        expect(screen.getByText("Welcome back,")).toBeInTheDocument();
    });


});
