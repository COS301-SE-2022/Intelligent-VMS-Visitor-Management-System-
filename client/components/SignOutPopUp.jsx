import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImExit } from "react-icons/im";

const SignOutPopUp = ({ visitorID, inviteID, refetch }) => {
    const client = useApolloClient();

    return (
        <div className="relative flex-col justify-center items-center text-center">
            <div className="avatar placeholder online">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24 text-4xl">
                    <ImExit />
                </div>
            </div>

            <h1 className="font-bold text-center text-3xl mt-5 ">Confirm Sign-Out</h1>
            <p>Confirm sign-out of visitor with id {visitorID}</p>
            <label htmlFor="signOut-modal" className="btn btn-primary w-5/6 mt-5 mb-5 modal-button" onClick={async () => {
                await client.mutate({
                    mutation: gql`
                    mutation {
                      signOut(inviteID: "${inviteID}")
                    }
                `
                }).then(res => {
                    
                    alert('tray number is: ' + res.data.signOut);
                    //refetch();
                })
            }
            } >Sign out</label>
        </div>
    );
};

export default SignOutPopUp;
