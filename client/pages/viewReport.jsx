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
                userEmail,
                inviteState
            }
        }
    `);

    useEffect(() => {
<<<<<<< Updated upstream
        if (!loading && !error) {
            console.log(data);
        } else if (error) {
            console.error("Something went wrong");
=======
        if(!loading && !error) {

        } else if(error) {
            if(error.message === "Unauthorized") {
                router.push("/expire");
            }
>>>>>>> Stashed changes
        }
    }, [data]);

    return (
        <Layout>
            <AnalyticsReport name={name} data={data && data.getNumInvitesPerDateOfUser} total={total} />
        </Layout>
    );
};

export default ViewReport;
