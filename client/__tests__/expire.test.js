import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import Expire from "../pages/expire";

describe("Login", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <Expire />
            </MockedProvider>
        );
        expect(screen.getByText("Woops: you are unauthorized")).toBeInTheDocument();
    });
});
