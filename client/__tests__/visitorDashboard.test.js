import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import VisitorDashboard from "../pages/visitorDashboard";

describe("VisitorDashboard", () => {

const validDataMock = [
  {
    request: {
      query: gql`
        query {
            getInvites {
                idNumber
                visitorEmail
                idDocType
            }
        }
      `,
    },
    result: {
      data: {
        getInvites: [
            {
                idNumber: "0109195273080",
                visitorEmail: "visitorEmail@mail.com",
                idDocType: "RSA-ID",
            }

        ]
      }
    }
  },
]; 


const noDataMock = [
  {
    request: {
      query: gql`
        query {
            getInvites {
                idNumber
                visitorEmail
                idDocType
            }
        }
      `,
    },
    result: {
      data: {
        getInvites: [
        ]
      }
    }
  },
] 

    it("renders a heading", () => {
        render(
            <MockedProvider>
                <VisitorDashboard />
            </MockedProvider>
        );
        expect(screen.getByText("Visitor History")).toBeInTheDocument();
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
            await new Promise(resolve => setTimeout(resolve, 5));
            expect(screen.getByText("visitorEmail@mail.com")).toBeInTheDocument();
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
            await new Promise(resolve => setTimeout(resolve, 5));
            expect(screen.getByText("Nothing to show...")).toBeInTheDocument();
        });
    });
});
