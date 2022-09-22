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

const today = new Date();
const startDate = getFormattedDateString(today);
const endDate = getFormattedDateString(today.getDate() + 7);

export const inviteUnauthMock = [{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "admin@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "benjamin",
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
    },
    {
        request: {
        query: gql`
            query {
                getNumberOfOpenInvites(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getNumberOfOpenInvites: 2
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

export const unAuthInvitesMock = [{
    request: {
        query: gql`
            query {
                getMaxInvitesPerResident {
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
                getNumberOfOpenInvites(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getNumberOfOpenInvites: 4
        }
    }
},
{
    request: {
        query: gql`
            query {
                getMaxInvitesPerResident {
                    value
              }
            }
        `
    },
    result: {
        data: {
            getMaxInvitesPerResident: {
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
                getNumberOfOpenInvites(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getNumberOfOpenInvites: 2
        }
    }
},
{
    request: {
        query: gql`
            query {
                getMaxInvitesPerResident {
                    value
              }
            }
        `
    },
    result: {
        data: {
            getMaxInvitesPerResident: {
                value: 3
            }
        }
    }
}
];
