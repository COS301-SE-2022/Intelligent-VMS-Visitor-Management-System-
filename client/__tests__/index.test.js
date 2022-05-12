import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "../components/Hero";

describe("Hero", () => {
    it("renders a heading", () => {
        render(<Hero />);
        expect(screen.getByText("Hello there 👋")).toBeInTheDocument();
    });
});
