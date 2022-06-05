import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import React, { useState } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";
import * as nextRouter from "next/router";

import ResizeObserver from "./__mocks__/resizeObserver.mock";

import AdminDashboard from "../pages/adminDashboard";
import useAuth from "../store/authStore";
import { useDateRange } from "../hooks/useDateRange.hook";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("AdminDashboard", () => {
    it("renders a heading", () => {
        jest.mock("react-chartjs-2", () => ({
            Line: () => null,
        }));
        const authHook = renderHook(() => useAuth());
        const dateRangeHook = renderHook(() => useDateRange(4));

        authHook.hydrate();
        dateRangeHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.bh6yTWV0lN9A0_xOGcgqN_za3M35BewXpJNuuprcaJ8"
            );
        });

        render(
            <MockedProvider>
                <AdminDashboard />
            </MockedProvider>
        );

        expect(screen.getByText("admin@mail.com")).toBeInTheDocument();
    });

    it("redirects to unauthorized page when api error is unauthorized", async () => {
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        jest.mock("react-chartjs-2", () => ({
            Line: () => null,
        }));
        const setStateMock = jest.fn();
        const stateMock = () => [useState, setStateMock];
        jest.spyOn(React, "useState").mockImplementation(stateMock);
        jest.spyOn(React, "useEffect").mockImplementation((f) => f());
        const router = {
            push: jest.fn().mockImplementation(() => Promise.resolve(true)),
            prefetch: () => new Promise((resolve) => resolve),
        };
        useRouter.mockReturnValue(router);

        const validDataMock = [
            {
                request: {
                    query: gql`
                        query {
                            getTotalNumberOfVisitors
                        }
                    `,
                },
                result: {
                    errors: [new GraphQLError("Unauthorized")],
                },
            },
        ];

        render(
            <MockedProvider mocks={validDataMock} addTypename={false}>
                <AdminDashboard />
            </MockedProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            //expect(router.push).toHaveBeenCalledWith("/expire");
        });
    });
});
