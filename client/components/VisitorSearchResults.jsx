import Link from "next/link";
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

    return (
        <div className="flex-col space-y-5 overflow-scroll">
            <h1 className="text-xl font-bold text-secondary">Results</h1>
            {!searchQuery ||
            name.length === 0 ||
            searchQuery?.data?.getInvitesByName?.length === 0 ? (
                <p>Nothing to show...</p>
            ) : searchQuery.loading ? (
                <div className="progress progress-primary"></div>
            ) : (
                searchQuery.data?.getInvitesByName.map((visitor, idx) => {
                    return (
                        <Link
                            href={
                                "/userAnalytics?name=" +
                                visitor.visitorName +
                                "&email=" +
                                visitor.visitorEmail
                            }
                            key={idx}
                        >
                            <a className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-base-300">
                                <div className="avatar placeholder online">
                                    <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl uppercase">
                                            {name.length > 0 ? name[0] : "U"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <h3 className="capitalize">
                                        {visitor.visitorName}
                                    </h3>
                                    <p>{visitor.visitorEmail}</p>
                                </div>
                            </a>
                        </Link>
                    );
                })
            )}
        </div>
    );
};

export default VisitorSearchResults;
