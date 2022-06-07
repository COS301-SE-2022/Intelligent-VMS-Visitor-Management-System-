import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import { ImEnter } from "react-icons/im";

const SignInPopUp = ({ visitorID, inviteID }) => {
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
          <p className="max-w-5/6">Confirm sign-in of visitor with id {visitorID}</p>
          <input type="text" onChange={(evt) => setNotes(evt.target.value)} maxLength="100" placeholder="Add some observations.." className="input input-bordered w-5/6 mt-5 ml-5" />
          <a href ="#" onClick={()=>{
                            client.mutate({
                              mutation: gql`
                                  mutation {
                                    signIn(inviteID: "${inviteID}", notes: "${notes}"){
                                      inviteID
                                    }
                                  }
                              `
                          }) 
                          //window.location.reload(true);                          
        }
                        
                        } className="btn btn-primary w-5/6 m-5">Sign in</a>
      </div>
    );
};

export default SignInPopUp;
