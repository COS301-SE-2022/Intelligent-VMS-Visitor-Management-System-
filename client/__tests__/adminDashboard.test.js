import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import AdminDashboard from "../pages/adminDashboard";
import useAuth from "../store/authStore";

describe("AdminDashboard", () => {

    it("renders a heading", () => {


        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8");
        });

        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );

        expect(screen.getByText("admin@mail.com")).toBeInTheDocument();
    })

}); 