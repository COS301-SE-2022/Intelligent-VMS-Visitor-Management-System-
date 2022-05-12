import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import AdminDashboard from "../pages/adminDashboard";
import actualCreate from "zustand";
import { act } from "react-dom/test-utils";
import {create} from "../__mocks__/zustand"
describe("AdminDashboard", () => {
    const useAuth = create((set) => ({
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.ku9WeWbG-RUnSoNM6AHWw4UmfmsLHVSDndSgMwEr1YY",
        decodedToken: () => { return {email: "admin@mail.com", permission: 0} },
      }))
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );
        expect(screen.getByText("Hello")).toBeInTheDocument();
    })

});