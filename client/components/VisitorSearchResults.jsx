import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

const VisitorSearchResults = ({ query }) => {
    const searchQuery = useQuery(gql`
        query {
            searchUser(searchQuery: "${query}") {
                email,
                name,
                permission
            }
        } 
    `);

    return (
        <div className="flex-col space-y-5 overflow-scroll">
            <h1 className="text-xl font-bold text-secondary">Results</h1>
            {!searchQuery ||
            query.length === 0 ||
            searchQuery?.data?.searchUser?.length === 0 ? (
                <p>Nothing to show...</p>
            ) : searchQuery.loading ? (
                <div className="progress progress-primary"></div>
            ) : (
                searchQuery.data?.searchUser.map((user, idx) => {
                    return (
                        <Link
                            href={
                                "/userAnalytics?name=" +
                                user.name +
                                "&email=" +
                                user.email +
                                "&permission=" +
                                user.permission
                            }
                            key={idx}
                        >
                            <a className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-base-300">
                                <div className="avatar placeholder online">
                                    <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl uppercase">
                                            {user.name.length > 0
                                                ? user.name[0]
                                                : "U"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <h3 className="capitalize">{user.name}</h3>
                                    <p>{user.email}</p>
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
