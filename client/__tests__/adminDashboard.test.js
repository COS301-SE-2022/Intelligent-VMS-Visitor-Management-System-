import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import AdminDashboard from "../pages/adminDashboard";
import useAuth from "../store/authStore";
import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";
import * as nextRouter from "next/router";
import { useRouter } from "next/router";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

describe("AdminDashboard", () => {
    it("renders a heading", () => {
        const { result, hydrate } = renderHook(() => useAuth());

        hydrate();

        act(() => {
            result.current.login(
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

    it("renders the total number of invites sent", async () => {
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
                    data: {
                        getTotalNumberOfVisitors: 129,
                    },
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
            expect(screen.getByText(129)).toBeInTheDocument();
        });
    });

    it("redirects to unauthorized page when api error is unauthorized", async () => {
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
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
            await new Promise((resolve) => setTimeout(resolve, 30));
            expect(router.push).toHaveBeenCalledWith("/expire");
        });
    });
});
