import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

export const inviteUnauthMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2020-08-21",
                        requiresParking: true
                    )
                }
            `
        },
        result: {
            errors: [new GraphQLError("Unauthorized")],
        }
    }
];

export const inviteDataErrorMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "error@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2022-08-21",
                        requiresParking: true,
                        )
                }
            `,
        }, 
        result: {
            errors: [new GraphQLError("ERROR")],
        }
    }
];

export const inviteDataMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2020-08-21",
                        requiresParking: true,
                        )
                }
            `
        },
        result: {
            data: {
                createInvite: {
                    "response": true
                }
            }
        }
    }
];

export const unAuthInvitesMock = [{
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
        errors: [new GraphQLError("Unauthorized")]
    }
}];

export const inviteLimitReached = [{
    request: {
        query: gql`
            query {
                 getTotalNumberOfInvitesOfResident(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfInvitesOfResident: 4
        }
    }
},
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


export const inviteLimitNotReached = [{
    request: {
        query: gql`
            query {
                 getTotalNumberOfInvitesOfResident(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfInvitesOfResident: 2
        }
    }
},
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
