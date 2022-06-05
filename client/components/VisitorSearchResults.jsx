import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const VisitorSearchResults = ({ name }) => {

    const searchQuery = useQuery(gql`
        query {
            getInvitesByName(name: "${name}") {
                visitorName,
                visitorEmail
            }
        }
    `);

    useEffect(() => {
    }, [searchQuery.data, name]);

    return (
        <div className="flex-col space-y-5 overflow-scroll">
            <h1 className="text-xl text-secondary font-bold">Results</h1>
            {
                !searchQuery || name.length === 0 || searchQuery?.data?.getInvitesByName?.length === 0 ?
                    <p>Nothing to show...</p>
                    :
                    searchQuery.data?.getInvitesByName.map((visitor, idx) => {
                        return (
                            <div key={idx} className="flex p-3 items-center space-x-3 rounded-lg hover:bg-base-300 cursor-pointer">
                                <div className="avatar placeholder online">
                                    <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl uppercase">
                                            {name.length > 0 ? name[0] : "U"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <h3 className="capitalize">{visitor.visitorName}</h3>
                                    <p>{visitor.visitorEmail}</p>
                                </div>
                            </div>
                        );
                    })
            }
        </div>
    );
};

export default VisitorSearchResults;
