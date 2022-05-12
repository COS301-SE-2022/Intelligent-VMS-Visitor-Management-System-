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
            result.current.login("");
        });

        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );

        expect(screen.getByText("admin@mail.com")).toBeInTheDocument();
    })

}); 