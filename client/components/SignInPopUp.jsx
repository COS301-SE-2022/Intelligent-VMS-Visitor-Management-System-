import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState, setState } from "react";
import Layout from "./Layout";


const SignInPopUp = ({visitorID,inviteID}) => {
    const videoRef = useRef(null);
    const [notes, setNotes] = useState("");
    const client = useApolloClient();
   

    return (
      <div className="relative max-w-sm flex-col justify-center">
          
          <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 flex-shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg" 
	          viewBox="0 0 600 600" 
            className="w-3/5 h-3/5 m-auto pt-5 stroke-current"
            >
              <circle className="fill-primary stroke-primary" cy="40%" cx="40%" r="150" />
              <path className="fill-secondary stroke-secondary" d="M231.634,79.976v-0.751C231.634,30.181,192.772,0,137.32,0c-31.987,0-57.415,9.018-77.784,22.98
              c-11.841,8.115-12.907,25.906-4.232,37.355l6.326,8.349c8.675,11.444,24.209,12.532,36.784,5.586
              c11.46-6.331,23.083-9.758,34-9.758c18.107,0,28.294,7.919,28.294,20.75v0.375c0,16.225-15.469,39.411-59.231,43.181l-1.507,1.697
              c-0.832,0.936,0.218,13.212,2.339,27.413l1.741,11.58c2.121,14.201,14.065,25.71,26.668,25.71s23.839-5.406,25.08-12.069
              c1.256-6.668,2.268-12.075,2.268-12.075C199.935,160.882,231.634,127.513,231.634,79.976z"/>
              <path className="fill-secondary stroke-secondary" d="M118.42,217.095c-14.359,0-25.993,11.64-25.993,25.999v12.14c0,14.359,11.64,25.999,25.993,25.999
              h22.322c14.359,0,25.999-11.64,25.999-25.999v-12.14c0-14.359-11.645-25.999-25.999-25.999H118.42z"/>
              
            </svg>
          <h1 className="font-bold text-center text-3xl mt-5 ">Confirm Sign-in</h1>
          <p>Confirm sign-in of visitor with id {visitorID}</p>
          <input type="text" value={notes} maxLength="100" placeholder="Add some observations.." className="input input-bordered w-5/6 mt-5 ml-5" />
          <button onClick={()=>{
                            alert(inviteID);
                            client.mutate({
                              mutation: gql`
                                  mutation {
                                    signIn(inviteID: "${inviteID}", notes: "bhgv"){
                                      inviteID
                                    }
                                  }
                              `
                          })                           
                          }
                        
                        } className="btn btn-primary w-5/6 m-5">Sign in</button>
      </div>
    );
};

export default SignInPopUp;
