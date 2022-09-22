import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import VisitInfoModal from "../components/VisitInfoModal";

describe("VisitInfoModal", () => {
    it("should show progress bar when waiting for data", () => {
        render(
            <VisitInfoModal 
                setCurrentVisitData={() => {}}
                setShowVisitorModal={() => {}}
                setShowSignOutModal={() => {}}
                visitModalData={undefined}
            />
        );

        expect(screen.getByTestId("visitinfoprogress")).toBeVisible();
    });

    it("should render visitor data when provided", () => {
        render(
            <VisitInfoModal 
                setCurrentVisitData={() => {}}
                setShowVisitorModal={() => {}}
                setShowSignOutModal={() => {}}
                visitModalData={{
                    visitorName: "Kyle",
                    inviteDate: "2022-09-21",
                    idDocType: "RSA-ID",
                    idNumber: "0109195273070",
                    inviteState: "inActive"
                }} 
            />
        );

        expect(screen.getByText("Kyle")).toBeVisible();
        expect(screen.getByText("2022-09-21")).toBeVisible();
        expect(screen.getByText("RSA-ID")).toBeVisible();
        expect(screen.getByText("0109195273070")).toBeVisible();
    });

    it("should render the sign out button when invite state is signed in or extended", () => {
        render(
            <VisitInfoModal 
                setCurrentVisitData={() => {}}
                setShowVisitorModal={() => {}}
                setShowSignOutModal={() => {}}
                visitModalData={{
                    visitorName: "Kyle",
                    inviteDate: "2022-09-21",
                    idDocType: "RSA-ID",
                    idNumber: "0109195273070",
                    inviteState: "signedIn"
                }} 
            />
        );

        expect(screen.getByText("Sign Out")).toBeVisible();
    })

    it("should not render the sign out button when invite state is signed out", () => {
        render(
            <VisitInfoModal 
                setCurrentVisitData={() => {}}
                setShowVisitorModal={() => {}}
                setShowSignOutModal={() => {}}
                visitModalData={{
                    visitorName: "Kyle",
                    inviteDate: "2022-09-21",
                    idDocType: "RSA-ID",
                    idNumber: "0109195273070",
                    inviteState: "signedOut"
                }} 
            />
        );

    })

    it("should update visitor data when sign out is clicked", async () => {
        render(
            <VisitInfoModal 
                setCurrentVisitData={() => {}}
                setShowVisitorModal={() => {}}
                setShowSignOutModal={() => {}}
                visitModalData={{
                    visitorName: "Kyle",
                    inviteDate: "2022-09-21",
                    idDocType: "RSA-ID",
                    idNumber: "0109195273070",
                    inviteState: "signedIn"
                }} 
            />
        );

        expect(screen.getByText("Sign Out")).toBeVisible();
        const user = userEvent.setup();

        await user.click(screen.getByText("Sign Out"));
    })
})
