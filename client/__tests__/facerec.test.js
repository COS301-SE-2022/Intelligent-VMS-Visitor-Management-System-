import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import FaceRec from "../components/FaceRec";

describe("FaceRec", () => {
    it("should render", async () => {
        render(<FaceRec />);
        await waitFor(() => screen.getByText("Camera not available"));

        const user = userEvent.setup();
        await user.click(screen.getByText("Authorize"));
    });
});
