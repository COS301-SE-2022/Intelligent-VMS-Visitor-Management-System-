import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImEnter } from "react-icons/im";


const SignInPopUp = ({ visitorID, inviteID, refetch, setShowInfoAlert, setTrayNr }) => {
    const [notes, setNotes] = useState("");
    const client = useApolloClient();

    return (
      <div className="relative flex-col justify-center items-center text-center">
          <div className="avatar placeholder online">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-24 text-4xl">
                  <ImEnter />
              </div>
          </div>
          
          <h1 className="font-bold text-center text-3xl mt-5 ">Confirm Sign-in</h1>
          <p className="max-w-5/6">Confirm sign-in of visitor with id {" "}  
            <span className="font-bold">
                {visitorID}
            </span>
          </p>
          <input type="text" onChange={(evt) => setNotes(evt.target.value)} maxLength="100" placeholder="Add some observations.." className="input input-bordered w-5/6 mt-5" />
          <label className="btn btn-primary w-5/6 mt-5 mb-5 modal-button" htmlFor="signIn-modal" onClick={ ()=>{
                            const time = new Date();
                            client.mutate({
                              mutation: gql`
                                  mutation {
                                    signIn(inviteID: "${inviteID}", notes: "${notes}", time: "${time.toLocaleTimeString()}") 
                                  }
                              `
                            }
                            ).then((res) => {
                              console.log(res);
                              setTrayNr(res.data.signIn);
                              setShowInfoAlert(true);
                              console.log("Called: " + refetch);
                              refetch();
                            });
                        }
                        
                        }>Sign in</label>
      </div>
    );
};

export default SignInPopUp;
