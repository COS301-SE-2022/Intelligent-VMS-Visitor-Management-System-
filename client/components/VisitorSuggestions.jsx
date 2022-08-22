import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import { HiEmojiSad } from "react-icons/hi";
import useAuth from "../store/authStore.js";

const VisitorSuggestions = ({ date }) => {

    const [suggestionData, setSuggestionsData] = useState([]);

    // Get Data From JWT Token
    const jwtTokenData = useAuth((state) => {
        return state.decodedToken;
    })();

    const router = useRouter();
    const [suggestionQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getSuggestions( date: "${date}", userEmail: "${jwtTokenData.email}" ) {
                email
                name
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
            suggestionData.length > 0 ? (
                <div className="card bg-base-300 border border-base-100">
                    <span className="card-title ml-3 mt-2">Suggestions</span>
                    {suggestionData.map((visitor, idx) => {
                        return (
                            <div className="bg-base-100 shadow-xl m-3 rounded-lg flex">
                                <div className="avatar placeholder m-3">
                                    <div className="bg-secondary text-neutral-content rounded-full p-4">
                                        <span className="text-lg capitalize">{visitor.name[0]}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-sm font-bold capitalize">{visitor.name}</span>
                                    <div className="text-xs">{visitor.email}</div>
                                </div>
                            </div>
                        )  
                    })}
                    <button className="button text-xs m-2">Show More</button>
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
