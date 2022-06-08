import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import ReceptionistDashboard from "../pages/receptionistDashboard";

describe("Receptionist Dashboard", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <ReceptionistDashboard />
            </MockedProvider>
        );
    });
});

