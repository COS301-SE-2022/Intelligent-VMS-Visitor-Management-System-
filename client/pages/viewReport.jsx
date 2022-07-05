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
            getNumInvitesPerDateOfUser(email: "${email}", dateStart: "${startDate}", dateEnd: "${endDate}") {
                visitorEmail,
                visitorName,
                inviteDate,
                idDocType,
                userEmail
            }
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            console.log(data);
        } else if (error) {
            console.error("Something went wrong");
        }
    }, [data]);

    return (
        <Layout>
            <AnalyticsReport
                name={name}
                data={data && data.getNumInvitesPerDateOfUser}
                total={total}
                startDate={startDate}
                endDate={endDate}
            />
        </Layout>
    );
};

export default ViewReport;
