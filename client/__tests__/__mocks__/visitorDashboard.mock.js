import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

export const validDataMock = [
        {
            request: {
                query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            idDocType
                            inviteID
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
                            inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346",
                        },
                    ],
                },
            },
        },
    ];

export const noDataMock = [
        {
            request: {
                query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            idDocType
                            inviteID
                        }
                    }
                `,
            },
            result: {
                data: {
                    getInvites: [],
                },
            },
        },
    ];

export const cancelInviteMock = [{
    request: {
        query: gql`
            mutation {
                cancelInvite(inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346")
            }
        `
    },
    response: {
        data: {
            cancelInvite: true
        }
    }
},
{
            request: {
                query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            idDocType
                            inviteID
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
                            inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346",
                        },
                    ],
                },
            },
}
];

export const unauthReq = [{
    request: {
        query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            idDocType
                            inviteID
                        }
                    }
        `
    },
    result: {
        errors: [new GraphQLError("Unauthorized")],
    }
}];

export const errorReq = [{
    request: {
        query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            idDocType
                            inviteID
                        }
                    }
        `
    },
    result: {
        errors: [new GraphQLError("Error")],
    }
}]
