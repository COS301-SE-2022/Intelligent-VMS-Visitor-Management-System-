import { gql } from "@apollo/client";

export const numInvitesValid = [{
    request: {
        query: gql`
            query {
                 getTotalNumberOfInvitesOfResident(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfInvitesOfResident: 1
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
},
{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "resident@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2020-08-21",
                        requiresParking: false
                    )
                }
            `
        },
        result: {
            data: {
                createInvite: true
            }
        }
    }
];

export const numInvitesOneLess = [{
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
},
{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "resident@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2020-08-21",
                        requiresParking: false
                    )
                }
            `
        },
        result: {
            data: {
                createInvite: true
            }
        }
    }
];

export const numInvitesEqual = [{
    request: {
        query: gql`
            query {
                 getTotalNumberOfInvitesOfResident(email: "resident@mail.com") 
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfInvitesOfResident: 3
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
},
{
        request: {
            query: gql`
                mutation {
                    createInvite(
                        userEmail: "resident@mail.com",
                        visitorEmail: "visitor@mail.com",
                        visitorName: "dave",
                        IDDocType: "RSA-ID",
                        IDNumber: "0109195273080",
                        inviteDate: "2020-08-21",
                        requiresParking: false
                    )
                }
            `
        },
        result: {
            data: {
                createInvite: true
            }
        }
    }
];

