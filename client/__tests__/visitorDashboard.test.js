import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as nextRouter from "next/router";

import {
    validDataMock,
    noDataMock,
    cancelInviteMock,
    unauthReq,
    errorReq,
} from "./__mocks__/visitorDashboard.mock";
import VisitorDashboard from "../pages/visitorDashboard";

// Setup router mock hook
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("VisitorDashboard", () => {
    it("renders a heading", () => {
        render(
            <MockedProvider>
                <VisitorDashboard />
            </MockedProvider>
        );
        expect(screen.getByText("Visitor" && "History")).toBeInTheDocument();
    });

    it("renders progressbar when getting data", async () => {
        const component = render(
            <MockedProvider mocks={validDataMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        expect(component.getByText("progress")).toBeInTheDocument();
    });

    it("renders the api data in the table", async () => {
        render(
            <MockedProvider mocks={validDataMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(
                screen.getByText("visitorEmail@mail.com")
            ).toBeInTheDocument();
            expect(screen.getByText("0109195273080")).toBeInTheDocument();
            expect(screen.getByText("RSA-ID")).toBeInTheDocument();
        });
    });

    it("renders nothing to show in the table when no data is returned", async () => {
        render(
            <MockedProvider mocks={noDataMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(screen.getByText("Nothing to show...")).toBeInTheDocument();
        });
    });

    it("removes cancelled invite from table", async () => {
        render(
            <MockedProvider mocks={cancelInviteMock} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(
                screen.getByText("visitorEmail@mail.com")
            ).toBeInTheDocument();
            expect(screen.getByText("0109195273080")).toBeInTheDocument();
            expect(screen.getByText("RSA-ID")).toBeInTheDocument();
        });

        const user = userEvent.setup();
        await user.click(
            screen.getByRole("button", {
                name: /cancel/i,
            })
        );
    });

    it("redirects to the expire page when unauthorized", async () => {
        render(
            <MockedProvider mocks={unauthReq} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/expire");
        });
    });

    it("renders error in table when api error occurs", async () => {
        render(
            <MockedProvider mocks={errorReq} addTypename={false}>
                <VisitorDashboard />
            </MockedProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(screen.getAllByText("ERROR")).toHaveLength(2);
        });
    });
});
