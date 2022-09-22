import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import OpenInviteCard from "../components/OpenInviteCard";

describe("Open Invite Card", () => {
    it("should render a name", () => {
        render(
            <OpenInviteCard 
                name="Kyle"
                email="kyle@mail.com"
                inviteID="invite-id"
                inviteDate="2022-09-12"
                idDocType="RSA-ID"
                idNumber="0109195273090"
                cancelInvite={() => {}}
            />
        );

        expect(screen.getByText("Kyle")).toBeVisible();
    })

    it("should remove an invite", async () => {
        const cancelInvite = jest.fn();
        render(
            <OpenInviteCard 
                name="Kyle"
                email="kyle@mail.com"
                inviteID="invite-id"
                inviteDate="2022-09-12"
                idDocType="RSA-ID"
                idNumber="0109195273090"
                cancelInvite={cancelInvite}
            />
        );

        const user = userEvent.setup();

        expect(screen.getByTestId("cancelbutton")).toBeVisible();
        
        await user.click(screen.getByTestId("cancelbutton"));
        
        expect(cancelInvite).toBeCalled();
    })
})

