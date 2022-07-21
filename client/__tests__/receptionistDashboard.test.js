import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/server";
import { MockedProvider } from "@apollo/client/testing";

import { todayInvites } from "./__mocks__/receptionistDashboard.mock";

import useAuth from "../store/authStore";
import ReceptionistDashboard from "../pages/receptionistDashboard";

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
            <MockedProvider>
                <ReceptionistDashboard />
            </MockedProvider>
        );

        expect(screen.getAllByText("Today's Invites")).toBeDefined();
    });
});
