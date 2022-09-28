import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

const getFormattedDateString = (date) => {
    if(date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            date.getFullYear(),
            (month > 9 ? "" : "0") + month,
            (day > 9 ? "" : "0") + day,
        ].join("-");
    }
};

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

export const cancelInviteMock = [
{
    request: {
        query: gql`
            mutation {
                cancelInvite(inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346")
            }
        `
    },
    result: {
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
                            visitorName
                            idDocType
                            inviteID
                            inviteDate
                            inviteState
                        }
                    }
                `,
            },
            result: {
                data: {
                    getInvites: [
                        {
                            idNumber: "0109195273080",
                            visitorEmail: "visitor@mail.com",
                            idDocType: "RSA-ID",
                            inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346",
                            inviteDate: getFormattedDateString(new Date()),
                            inviteState: "inActive",
                            visitorName: "kyle"
                        },
                    ],
                },
            },
}
];

export const cancelInviteMockError = [
{
    request: {
        query: gql`
            mutation {
                cancelInvite(inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346")
            }
        `
    },
    result: {
        errors: [new GraphQLError("ERROR")],
    }
},
{
            request: {
                query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            visitorName
                            idDocType
                            inviteID
                            inviteDate
                            inviteState
                        }
                    }
                `,
            },
            result: {
                data: {
                    getInvites: [
                        {
                            idNumber: "0109195273080",
                            visitorEmail: "visitor@mail.com",
                            idDocType: "RSA-ID",
                            inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346",
                            inviteDate: getFormattedDateString(new Date()),
                            inviteState: "inActive",
                            visitorName: "kyle"
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

export const historyInvites = [
{
            request: {
                query: gql`
                    query {
                        getInvites {
                            idNumber
                            visitorEmail
                            visitorName
                            idDocType
                            inviteID
                            inviteDate
                            inviteState
                        }
                    }
                `,
            },
            result: {
                data: {
                    getInvites: [
                        {
                            idNumber: "0109195273080",
                            visitorEmail: "visitor@mail.com",
                            idDocType: "RSA-ID",
                            inviteID: "43e17f1b-4b2d-4db7-93d1-c76e2a00f346",
                            inviteDate: "2022-09-12",
                            inviteState: "inActive",
                            visitorName: "kyle"
                        },
                    ],
                },
            },
}
];

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

export const numInvitesMock = [
{
    request: {
       query: gql`
        query {
                getNumInvitesPerResident {
                    value
                }
        }
       ` 
    },
    result: {
        data: {
            getNumInvitesPerResident: {
                value: 3
            }
        }
    }
}
];
