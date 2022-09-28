import { MockedProvider } from "@apollo/client/testing";
import { renderHook, act } from "@testing-library/react-hooks/server";
import { gql } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as nextRouter from "next/router";

import {
    validDataMock,
    noDataMock,
    cancelInviteMock,
    cancelInviteMockError,
    historyInvites,
    unauthReq,
    errorReq,
    numInvitesMock,
} from "./__mocks__/visitorDashboard.mock";
import ResizeObserver from "./__mocks__/resizeObserver.mock";
import useAuth from "../store/authStore";
import VisitorDashboard from "../pages/visitorDashboard";
import useDateRange from "../hooks/useDateRange.hook";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

const getFormattedDateString = (date) => {
    if(date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            date.getFullYear(),
            (month > 9 ? "" : "0") + month,
            (day > 9 ? "" : "0") + day,
        ].join("-");
    }
};

jest.mock("../hooks/useDateRange.hook", () => (
    () => ["2022-09-12", "2022-09-12", new Map(), jest.fn()]
));

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

    it("should remove an invite when cancelled", async () => {
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
            <MockedProvider mocks={cancelInviteMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        
        const user = userEvent.setup();

        await user.click(screen.getByTestId("cancelbutton"));

    });

    it("should catch an error invite when cancelled", async () => {
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
            <MockedProvider mocks={cancelInviteMockError} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        
        const user = userEvent.setup();

        await user.click(screen.getByTestId("cancelbutton"));
    });

    it("should render an invite in the history if it is old", async () => {
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
            <MockedProvider mocks={historyInvites} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        const user = userEvent.setup();
    
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        
        const invites = screen.getAllByTestId("historyInvite");

        expect(invites.length).toEqual(1);

        await user.click(invites[0]);
        
    })

    it("should render an invite modal when clicking on history invite", async () => {
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
            <MockedProvider mocks={historyInvites} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        const user = userEvent.setup();
    
        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        
        const invites = screen.getAllByTestId("historyInvite");

        expect(invites.length).toEqual(1);

        await user.click(invites[0]);

        await user.click(screen.getByTestId("closeInviteModal"));
        
    })

    it("should show max num invites", async () => {
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
            <MockedProvider mocks={numInvitesMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        
        expect(screen.getByText("Maximum Invites Allowed"));
    })
});
