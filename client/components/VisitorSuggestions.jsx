import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import { useFormikContext } from "formik";
import { HiEmojiSad } from "react-icons/hi";
import { AiOutlinePlus,AiOutlineMinus } from "react-icons/ai"
import useAuth from "../store/authStore.js";

const VisitorSuggestions = ({ date, setName, setFieldValue }) => {

    const formikProps = useFormikContext();
    const [suggestionData, setSuggestionsData] = useState([]);
    const [amount, setAmount] = useState(3);
    const [show, setShow] = useState(false);

    // Get Data From JWT Token
    const jwtTokenData = useAuth((state) => {
        return state.decodedToken;
    })();

    const router = useRouter();
    const [suggestionQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getSuggestions( date: "${date}", userEmail: "${jwtTokenData.email}" ) {
                _id
                visitorName
                idNumber
                idDocType
            }
        }
    `
    );

    useEffect(() => {
        suggestionQuery();

        if (!loading && !error) {
            if (data) {
                setSuggestionsData(data.getSuggestions);
            }
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setSuggestionsData([]);
        }
    }, [loading, error, router, data, suggestionQuery]);

    return (
        loading ? (
            <progress className="progress progress-primary w-56">
                progress
            </progress>
        ) : (
            suggestionData.length > 0 ? (
                
                <div className="card bg-base-300 border border-base-100">

                    <span className="card-title ml-3 mt-2 mb-2">
                        {show? (
                            <AiOutlineMinus className="" onClick={()=> setShow(!show)}/>
                        ):(
                            <AiOutlinePlus className="" onClick={()=> setShow(!show)}/>
                        )}
                        
                        Suggestions
                    
                    </span>

                    {show?
                    (
                        <div className='flex flex-col'>
                        {suggestionData.map((visitor, idx) => {

                            if( idx < amount){
                                return (
                                    <button className="" onClick={ () => {
                                        formikProps.setFieldValue('name', visitor.visitorName); 
                                        formikProps.setFieldValue('email', visitor._id); 
                                        formikProps.setFieldValue('idValue', visitor.idNumber); 
                                        formikProps.setFieldValue('idDocType', visitor.idDocType); 
                                    }} key={idx}>
                                        
                                        <div className="hover:bg-base-200 bg-base-100 shadow-xl mb-3 mx-3 rounded-lg flex">
                                            <div className="avatar placeholder m-3">
                                                <div className="w-10 rounded-full bg-secondary text-neutral-content">
                                                    <span className="text-lg capitalize">
                                                        {visitor.visitorName[0]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-start">
                                                <div className="text-sm font-bold capitalize">{visitor.visitorName}</div>
                                                <div className="text-xs">{visitor._id}</div>
                                            </div>
                                        </div>
    
                                    </ button>
                                )  
                            }
                            
                        })}
    
                        {suggestionData.length > 3 ? (
                            amount < suggestionData.length ? (
                                <button className="button text-xs mt-1 mb-2" onClick={()=>{setAmount(amount+2)}}>
                                    Show More
                                </button>
                            ):(
                                <button className="button text-xs mt-1 mb-2" onClick={()=>{setAmount(3)}}>
                                    Show Less
                                </button>
                            )
                        ):(
                            <div className='mt-3'></div>
                        )}
                        </div>
                    ):(
                        <div></div>
                    )}

                </div>
            ):(
                <div className="flex w-full mt-3 ml-3">
                    <span className="fill-current text-error w-5 align-middle h-full"><HiEmojiSad size="sm" color="bg-error"/></span>
                    <span className="ml-1 text-error text-sm">No Suggestions</span>
                </div>
            )

        )
    );
}

export default VisitorSuggestions;
