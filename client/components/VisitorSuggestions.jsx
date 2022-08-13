import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";

const VisitorSuggestions = ({ date }) => {

    const [suggestionData, setSuggestionsData] = useState([]);

    const router = useRouter();
    const [suggestionQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getSuggestions( date: "${date}" ) {
                idNumber
                visitorName
                userEmail
            }
        }
    `,
        { fetchPolicy: "no-cache" }
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
        <div className="card bg-base-100 shadow-md ">
            <div className="card-body">

                {loading ? (
                    <progress className="progress progress-primary w-56">
                        progress
                    </progress>
                ) : (

                    suggestionData > 0 ? (
                        <div>
                            { suggestionData.map((visit, idx) => {
                                return (
                                    <div></div>
                                );
                            })}
                        </div>
                    ):(
                        <p> no suggestions </p>
                    )

                )}
                            
            </div>
        </div>
    );
}

export default VisitorSuggestions;
