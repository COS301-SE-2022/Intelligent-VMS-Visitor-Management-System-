import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderHook, act } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import * as Formik from 'formik';

import useAuth from "../store/authStore";
import VisitorSuggestions from "../components/VisitorSuggestions.jsx";

import { getSuggestions } from "./__mocks__/visitorSuggestions.mock";

describe("VisitorSuggestions", () => {
    const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext');

    it("renders message when there are no suggestions", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        const suggestionFunc = jest.fn();
        const setFieldValueFunc = jest.fn();
        useFormikContextMock.mockReturnValue({
            setFieldValue: setFieldValueFunc
        });

        render(
            <MockedProvider>
                <VisitorSuggestions date="2022-09-12" setSuggestion={suggestionFunc} />
            </MockedProvider>
        )

        await waitFor(async () => {
            expect(screen.getByText("No Suggestions")).toBeVisible();
        });
    });

    it("renders suggestions when there are suggestions", async () => {
        const authHook = renderHook(() => useAuth());
        authHook.hydrate();

        act(() => {
            authHook.result.current.login(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwicGVybWlzc2lvbiI6MH0.DJkzWVCzuQH43IPtFIOChY4VURwQ1b_HSqDUiN9wJuY"
            );
        });
        const suggestionFunc = jest.fn();
        const setFieldValueFunc = jest.fn();
        useFormikContextMock.mockReturnValue({
            setFieldValue: setFieldValueFunc
        });

        const user = userEvent.setup();

        render(
            <MockedProvider mocks={getSuggestions} addTypename={false}>
                <VisitorSuggestions date="2022-09-12" setSuggestion={suggestionFunc} />
            </MockedProvider>
        )
        

        await waitFor(async () => {
            expect(screen.getByText("Suggestions")).toBeVisible();
        });

        await user.click(screen.getByTestId("plussuggest"));
        expect(screen.getByText("Kyle")).toBeDefined();
        await user.click(screen.getAllByTestId("suggestbtn")[0]);
        expect(setFieldValueFunc).toBeCalled();
    });
})
