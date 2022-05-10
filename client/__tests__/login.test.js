import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import Login from "../pages/login";

describe("Login", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );
        expect(screen.getByText("Welcome Back 👋")).toBeInTheDocument();
    });
});
