import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImEnter } from "react-icons/im";

const SignInPopUp = ({ visitorID, inviteID }) => {
    const [notes, setNotes] = useState("");
    const client = useApolloClient();

    return (
        <div className="relative flex max-w-sm flex-col justify-center text-center">
            <div className="avatar placeholder online">
                <div className="w-24 rounded-full bg-neutral-focus text-4xl text-neutral-content">
                    <ImEnter />
                </div>
            </div>

            <h1 className="mt-5 text-center text-3xl font-bold ">
                Confirm Sign-in
            </h1>
            <p className="max-w-5/6">
                Confirm sign-in of visitor with id {visitorID}
            </p>
            <input
                type="text"
                onChange={(evt) => {
                    console.log(evt.target.value);
                }}
                maxLength="100"
                placeholder="Add some observations.."
                className="input input-bordered mt-5 ml-5 w-5/6"
            />
            <a
                href="#"
                onClick={() => {
                    client.mutate({
                        mutation: gql`
                                  mutation {
                                    signIn(inviteID: "${inviteID}", notes: "bhgv"){
                                      inviteID
                                    }
                                  }
                              `,
                    });
                    window.location.reload(true);
                }}
                className="btn btn-primary m-5 w-5/6"
            >
                Sign in
            </a>
        </div>
    );
};

export default SignInPopUp;
