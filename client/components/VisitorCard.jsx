import { useRouter } from "next/router";
import { useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const VisitorCard = ({ name, email, numInvites }) => {
    const router = useRouter();

    const [getInviteDateQuery, { data, loading, error }] = useLazyQuery(gql`
        query {
          getMostUsedInviteData(email: "${email}") {
            idNumber,
            visitorName,
            idDocType,
            visitorEmail
          }
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            if (data) {
                const { idNumber, visitorName, idDocType, visitorEmail } =
                    data.getMostUsedInviteData;
                router.push(
                    `/createInvite?name=${name}&email=${visitorEmail}&idNumber=${idNumber}&idDocType=${idDocType}`
                );
            }
        } else if (error) {
        }
    }, [data, loading, error]);

    return (
        <div className={`cursor-pointer`}>
            <div
                className={`
                    flex items-center justify-between 
                    rounded-xl bg-base-100 p-3`}
            >
                <div className="flex items-center space-x-4">
                    <div className="avatar placeholder">
                        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-xl capitalize">
                                {name[0]}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold capitalize text-secondary">
                            {name}
                        </h3>
                        <p className="text-xs text-neutral-content lg:text-sm">
                            {email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.currentTarget.classList.add("loading");
                        getInviteDateQuery();
                    }}
                    className="btn btn-primary btn-xs md:btn-sm"
                >
                    Invite
                </button>
            </div>
        </div>
    );
};

export default VisitorCard;
