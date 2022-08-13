import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import { HiEmojiSad } from "react-icons/hi";


const VisitorSuggestions = ({ date }) => {

    const [suggestionData, setSuggestionsData] = useState([]);

    const router = useRouter();
    const [suggestionQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getSuggestions( date: "${date}" ) {
                idNumber
                visitorName
                visitorEmail
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
        loading ? (
            <progress className="progress progress-primary w-56">
                progress
            </progress>
        ) : (
            suggestionData > 0 ? (
                <div className="bg-base-100">
                    {suggestionData.map((visitor, idx) => {
                        return (
                            <div className="flex col-span-2 space-x-3">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                                        <span className="text-2xl capitalize">{visitor.visitorName[0]}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-2xl font-bold capitalize">{visitor.visitorName}</h1>
                                    <div className="text-md">{visitor.visitorEmail}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ):(
                <div class="flex w-full mt-3 ml-3">
                    <span class="fill-current text-error w-5 align-middle h-full"><HiEmojiSad size="sm" color="bg-error"/></span>
                    <span class="ml-1 text-error text-sm">No Suggestions</span>
                </div>
            )

        )
    );
}

export default VisitorSuggestions;
