import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";

import Login from "../../pages/Login";
import useAuth from "../../store/authStore";

describe("create invite", () => {
    it("user can create an invite after logging in", async () => {

        render(
            <MockedProvider>
                <Login />
            </MockedProvider>
        );

    });
});
