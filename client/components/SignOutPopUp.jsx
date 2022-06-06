import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImExit } from "react-icons/im";

const SignOutPopUp = ({ visitorID, inviteID }) => {
    const client = useApolloClient();

    return (
        <div className="relative flex-col items-center justify-center text-center">
            <div className="avatar placeholder online">
                <div className="w-24 rounded-full bg-neutral-focus text-4xl text-neutral-content">
                    <ImExit />
                </div>
            </div>

            <h1 className="mt-5 text-center text-3xl font-bold ">
                Confirm Sign-Out
            </h1>
            <p>Confirm sign-out of visitor with id {visitorID}</p>
            <a
                href="#"
                onClick={() => {
                    alert(inviteID);
                    //window.location.reload(true);
                }}
                className="btn btn-primary m-5 w-5/6"
            >
                Sign out
            </a>
        </div>
    );
};

export default SignOutPopUp;
