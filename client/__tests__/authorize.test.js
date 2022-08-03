import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import Authorize from "../pages/authorize";

describe("Authorize", () => {
    it("render message and info", () => {
        render(
            <MockedProvider>
                <Authorize />
            </MockedProvider>
        );
        expect(
            screen.getByText("Woops: you are unauthorized")
        ).toBeInTheDocument();
    });
});
