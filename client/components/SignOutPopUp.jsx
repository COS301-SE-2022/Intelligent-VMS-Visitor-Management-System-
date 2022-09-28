import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImExit } from "react-icons/im";
import { alert } from "react-custom-alert";

const SignOutPopUp = ({
    setTrayNr,
    visitorName,
    refetch,
    currentButton,
    visitData,
    setShowSignOutModal,
    setSearch,
}) => {

    const [signOutMutation, { data, loading, error }] = useMutation(gql`
        mutation {
            signOut(inviteID: "${visitData.inviteID}")
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            if (data) {
                refetch();
                alert({
                    message: `Tray Number For ${visitData.visitorName}: ${data.signOut}`,
                    type: "info",
                });
                setSearch(false);
            }
        } else if (!loading && error) {
                alert({
                    message: `Error: ${error}`,
                    type: "error",
                });
        }
    }, [loading, error, data]);

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
            <p>Confirm sign-out of visitor with id {visitData.idNumber}</p>
            <label
                data-testid="signout-label"
                htmlFor="signOut-modal"
                className="modal-button btn btn-primary mt-5 mb-5 w-5/6"
                onClick={() => {
                    signOutMutation();
                    if (currentButton) {
                        currentButton.add("loading");
                    }
                    setShowSignOutModal(false);
                }}
            >
                Sign out
            </label>
        </div>
    );
};

export default SignOutPopUp;
