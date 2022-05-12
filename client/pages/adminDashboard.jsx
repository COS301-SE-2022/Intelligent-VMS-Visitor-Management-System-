import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import Layout from "../components/Layout";

import { AiFillEye, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BsFillHouseDoorFill } from 'react-icons/bs';

import useAuth from "../store/authStore";

const AdminDashboard = () => {
    const [numInvitesSent, setNumInvitesSent] = useState(0);
    const numParkingSpotsAvailable = useAuth((state) => state.numParkingSpots);
    const incParkingSpots = useAuth((state) => state.incParkingSpots);
    const decParkingSpots = useAuth((state) => state.decParkingSpots);
    const updateParkingSpots = useAuth((state) => state.updateParkingSpots);
    const decodedToken = useAuth((state) => state.decodedToken)();
    const router = useRouter();

    const { loading, error, data } = useQuery(gql`
        query {
          getTotalNumberOfVisitors
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            const invites = data.getTotalNumberOfVisitors;
            setNumInvitesSent(invites); 
        } else if (error) {

            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setIsVisitorData([
                {
                    visitorEmail: "ERROR",
                    idDocType: "ERROR",
                    isNumber: "ERROR",
                },
            ]);
        }

    }, [loading, error, data, router]);

    return (
        <Layout>
            <div className="px-3">
                <h1 className="mt-4 mb-4 text-left text-3xl font-bold">
                    Hello <span className="text-secondary">{decodedToken.email}</span>
                </h1>
                <p className="prose mb-4 text-tertiary">Welcome Back!</p>

                <div className="space-y-3">
                    <div className="card w-100 h-70 bg-base-300 text-tertiary-content">
                      <div className="card-body">
                            <div className="grid gap-4 grid-cols-3 grid-rows-1 place-center">
                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <button className="btn btn-circle btn-disabled bg-base-100 p-2">
                                        <BsFillHouseDoorFill className="text-primary" size="lg"/>
                                      </button>
                                    </div>
                                    <p className="text-sm">Total Number Of Invites Sent</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>{numInvitesSent}</span>
                                    </p>
                                    <p>Total</p>
                                </div>

                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <button className="btn btn-circle btn-disabled bg-base-100 p-2">
                                        <AiFillEye className="text-primary" size="lg" />
                                      </button>
                                    </div>
                                    <p className="text-sm">Other Data</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>{120}</span>
                                    </p>
                                    <p>Amount</p>
                                </div>

                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <button className="btn btn-circle btn-disabled bg-base-100 p-2">
                                        <AiFillEye className="text-primary" size="lg"/>
                                      </button>
                                    </div>
                                    <p className="text-sm">Other Data</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>{9102}</span>
                                    </p>
                                    <p>Amount</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 card w-100 bg-base-200 text-tertiary-content items-center justify-center font-bold text-2xl space-y-2">
                        <h1>Number of Parking Spots Available</h1>
                        <div className="flex space-x-4 select-none">
                            <button className="btn btn-circle p-2" onClick={incParkingSpots}>
                                <AiOutlinePlus className="text-primary" size="lg"/>
                            </button>

                            <a href="#parking-modal" className="font-bold text-5xl text-secondary btn bg-tertiary modal-button">{numParkingSpotsAvailable}</a>

                            <button className="btn btn-circle p-2" onClick={() => numParkingSpotsAvailable > 0 && decParkingSpots()}>
                                <AiOutlineMinus className="text-primary" size="lg"/>
                            </button>

                        </div>
                    </div>
                </div>

            </div>

            <div className="modal" id="parking-modal">
              <div className="modal-box space-y-2">
                <h3 className="font-bold text-lg">Update Number of Parking Spots Available</h3>
                <input onChange={(e) => updateParkingSpots(Number(e.target.value))} className="input input-bordered w-full max-w-xs" type="number" placeholder={numParkingSpotsAvailable}/>
                <div className="modal-action">
                    <a href="#" className="btn">Update</a>
              </div>
            </div>          

          </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            permission: 0,
        },
    };
}

export default AdminDashboard;
