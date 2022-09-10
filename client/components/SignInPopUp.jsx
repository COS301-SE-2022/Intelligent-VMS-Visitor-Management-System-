import { useEffect, useRef, useState, setState } from "react";
import { gql, useMutation } from "@apollo/client";
import { alert } from "react-custom-alert";
import { ImEnter } from "react-icons/im";

const SignInPopUp = ({
    visitorName,
    visitorID,
    inviteID,
    refetch,
    todayString,
    currentButton,
    visitData,
    setShowSignInModal,
    setSearch,
    trayNr,
}) => {
    const [notes, setNotes] = useState("");
    const now = new Date();
    const [signInMutation, { data, loading, error }] = useMutation(
        gql`
            mutation {
                signIn(inviteID: "${
                    visitData.inviteID
                }", notes: "${notes}", time: "${now.toLocaleString()}") 
            }
    `,
        {
            refetchQueries: [
                {
                    query: gql`
            query {
                getInvitesByDate( date: "${todayString}" ) {
                    inviteID
                    inviteDate
                    idNumber
                    visitorName
                    inviteState
                }
            }
            `,
                },
            ],
        }
    );

    useEffect(() => {
        if (!loading && !error) {
            if (data) {
                refetch();
                alert({
                    message: `Tray Number For ${visitData.visitorName}: ${data.signIn}`,
                    type: "info",
                });
                setSearch(false);
            }
        } else {
        }
    }, [loading, error, data]);

    return (
        <div className="relative flex-col items-center justify-center text-center">
            <div className="avatar placeholder online">
                <div className="w-24 rounded-full bg-neutral-focus text-4xl text-neutral-content">
                    <ImEnter />
                </div>
            </div>

            <h1 className="mt-5 text-center text-3xl font-bold ">
                Confirm Sign-in
            </h1>
            <p className="max-w-5/6">
                Confirm sign-in of visitor with id{" "}
                <span className="font-bold">{visitData.idNumber}</span>
            </p>
            <input
                type="text"
                onChange={(evt) => setNotes(evt.target.value)}
                maxLength="100"
                placeholder="Add some observations.."
                className="input input-bordered mt-5 w-5/6"
            />
            <label
                className="modal-button btn btn-primary mt-5 mb-5 w-5/6"
                htmlFor="signIn-modal"
                onClick={() => {
                    signInMutation();
                    if (currentButton) {
                        currentButton.add("loading");
                    }
                    setShowSignInModal(false);
                }}
            >
                Sign in
            </label>
        </div>
    );
};

export default SignInPopUp;
