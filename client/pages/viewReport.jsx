import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

import Layout from "../components/Layout";
import AnalyticsReport from "../components/AnalyticsReport";

const ViewReport = () => {
    const router = useRouter();
    const { email, startDate, endDate, name, total } = router.query;

    const { loading, error, data } = useQuery(gql`
        query {
            getInvitesWithEmail(email: "${email}") {
                visitorEmail,
                visitorName,
                inviteDate,
                idDocType,
                userEmail,
                inviteState
            }
        }
    `);

    useEffect(() => {
        if(!loading && !error) {

        } else if(error) {
            if(error.message === "Unauthorized") {
                router.push("/expire");
            }
        }
    }, [data]);

    return (
        <Layout>
            <AnalyticsReport name={name} data={data && data.getInvitesWithEmail} total={total} />
        </Layout>
    );
};

export default ViewReport;
