import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

import { todayInvites, todayInvitesAndSearch } from "./__mocks__/receptionistDashboard.mock";

import useAuth from "../store/authStore";
import ReceptionistDashboard from "../pages/receptionistDashboard";
import Alert from "../components/Alert";

const getFormattedDateString = (date) => {
    if (date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            date.getFullYear(),
            (month > 9 ? "" : "0") + month,
            (day > 9 ? "" : "0") + day,
        ].join("-");
    }
};

const options = {
    position: positions.TOP_CENTER,
    timeout: 8000,
    offset: '30px',
    transition: transitions.SCALE
}

jest.setTimeout(50000);
describe("Receptionist Dashboard", () => {
    it("renders a heading", () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider>
                    <ReceptionistDashboard />
                </MockedProvider>
            </AlertProvider>
        );

        expect(screen.getAllByText("Today's Invites")).toBeDefined();
    });

    it("renders invites", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider mocks={todayInvites} addTypename={false}>
                    <ReceptionistDashboard />
                </MockedProvider>
            </AlertProvider>
        );

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
        expect(screen.getAllByText("Today's Invites")).toBeDefined();
        expect(screen.getByText("kyle"));

    });

    it("shows invites searched by name", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider mocks={todayInvitesAndSearch} addTypename={false}>
                    <ReceptionistDashboard />
                </MockedProvider>
            </AlertProvider>
        );

        const user = userEvent.setup();

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
            expect(screen.getAllByText("Today's Invites")).toBeDefined();
            await user.type(screen.getByPlaceholderText("Search.."), "kyle");
            await user.click(screen.getByTestId("searchbtn"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

            expect(screen.getByText("kyle"));
    });

    it("resets search results when cancel is clicked", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider mocks={todayInvitesAndSearch} addTypename={false}>
                    <ReceptionistDashboard />
                </MockedProvider>
            </AlertProvider>
        );

        const user = userEvent.setup();

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
        await user.type(screen.getByPlaceholderText("Search.."), "kyle");
        await user.click(screen.getByTestId("searchbtn"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        expect(screen.getByText("kyle"));
        await user.click(screen.getByTestId("resetsearch"));
        expect(screen.getByText("kyle"));
    });

    it("resets search results when cancel is clicked", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();
        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        render(
            <AlertProvider {...options} template={Alert}>
                <MockedProvider mocks={todayInvitesAndSearch} addTypename={false}>
                    <ReceptionistDashboard />
                </MockedProvider>
            </AlertProvider>
        );

        const user = userEvent.setup();

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
            await user.type(screen.getByPlaceholderText("Search.."), "kyle");
            await user.click(screen.getByTestId("searchbtn"));

        await waitFor(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });
            expect(screen.getByText("kyle"));
            await user.click(screen.getByTestId("resetsearch"));
            expect(screen.getByText("kyle"));
    });
});
