import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

import Layout from "../components/Layout";
import useDateRange from "../hooks/useDateRange.hook";
import useAuth from "../store/authStore";

import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import {
    MdBlock,
    MdDataSaverOn,
    MdDataSaverOff,
} from "react-icons/md";

// Returns string in format yyyy-mm-dd given Date Object
const getFormattedDateString = (date) => {
    if (date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            date.getFullYear(),
            (month > 9 ? "" : "0") + month,
            (day > 9 ? "" : "0") + day,
        ].join("-");
    }
};

const Initialize = () => {
    // NextJS Page Router
    const router = useRouter();

    // Number of invites sent state
    const [numInvitesSent, setNumInvitesSent] = useState(0);

    const [hoursMenu, setHours] = useState(0);
    const [minutesMenu, setMinutes] = useState(0);

    const hours = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
    const mins = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29"
    ,"30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];

    // Visitor invite data object for chart
    const [visitorVals, setVisitorVals] = useState({
        data: [],
        labels: [],
        label: "Invites",
    });

    // Parking data object for chart
    const [parkingVals, setParkingVals] = useState({
        data: [],
        labels: [],
        label: "Parking",
    });


    // Parking Date Range Hook
    const [
        parkingStartDate,
        parkingEndDate,
        parkingDateMap,
        setParkingDateMap,
    ] = useDateRange(getFormattedDateString(new Date(Date.now())), 7);


    // Initial number of invites per resident for fallback
    const [initialNumInvitesPerResident, setInitialNumInvitesPerResident] =
        useState(1);

    const [initialSleepovers, setInitialSleepovers] = useState(0);

    const [initialNumParkingSpots, setInitialNumParkingSpots] = useState(0);

    const [numParkingSpotsAvailableToday, setNumParkingSpotsAvailableToday] =
        useState(0);

    // State to track whether the restrictions have changed
    const [restrictionsChanged, setRestrictionsChanged] = useState(false);


    const [numParkingSpotsAvailable, setNumParkingSpotsAvailable] = useState(0);

    // JWT Token data from Model
    const decodedToken = useAuth((state) => {
        return state.decodedToken;
    })();

    const numInvitesPerResidentQuery = useQuery(gql`
        query {
            getNumInvitesPerResident {
                value
            }
        }
    `);

    const CurfewTimeQuery = useQuery(gql`
        query {
            getCurfewTime {
                value
            }
        }
    `);

    const numSleepoversPerResidentQuery = useQuery(gql`
        query {
            getMaxSleepovers {
                value
            }
        }
    `);



    // Number of invites per resident state
    const [numInvitesPerResident, setNumInvitesPerResident] = useState(1);
    const [maxSleepovers, setMaxSleepovers] = useState(1);
    const [curfewTime, setCurfewTime] = useState(1);

    const [defaultHours, setDefaultHours] = useState(0);
    const [defaultMins, setDefaultMins] = useState(0);

    const numInvitesQuery = useQuery(gql`
        query {
            getTotalNumberOfVisitors
        }
    `);

    const numParkingSpotsAvailableQuery = useQuery(gql`
         query {
            getTotalAvailableParking
        }
    `);

    const [setNumInvitesPerResidentMutation, { data, loading, error }] =
        useMutation(gql`
        mutation {
        setNumInvitesPerResident(numInvites: ${numInvitesPerResident}) {
            value
        }
        }
    `);

    const [setMaxSleepoversMutation, {}] =
        useMutation(gql`
        mutation {
        setMaxSleepovers(sleepovers: ${maxSleepovers}) {
            value
        }
        }
    `);

    const [adjustParkingMutation, { }] =
        useMutation(gql`
       mutation {
        adjustParking(numDisiredParkingTotal: ${numParkingSpotsAvailable}) 
       }
   `);

    const client = useApolloClient();
    function curfewMutationFunc(CURFEW) {

        client.mutate({
            mutation: gql`
        mutation {
            setCurfewTime(curfewTime: ${CURFEW}) {
            value
            }
        }
    `});
    }

    const cancelRestrictions = () => {
        setNumInvitesPerResident(initialNumInvitesPerResident);
        setNumParkingSpotsAvailable(initialNumParkingSpots);
        setInitialSleepovers(initialSleepovers);
        setRestrictionsChanged(false);
    };

    const saveRestrictions = () => {

        if (numInvitesPerResident !== initialNumInvitesPerResident) {
            setInitialNumInvitesPerResident(numInvitesPerResident);
            setNumInvitesPerResidentMutation();
        }

        if (maxSleepovers !== initialSleepovers) {
            setInitialSleepovers(maxSleepovers);
            setMaxSleepoversMutation();
        }

        if (numParkingSpotsAvailable !== initialNumParkingSpots) {
            setInitialNumParkingSpots(numParkingSpotsAvailable);
            adjustParkingMutation();
            setNumParkingSpotsAvailableToday(
                numParkingSpotsAvailable - parkingDateMap.get(parkingStartDate)
            );
        }

        if (minutesMenu == "1") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "2") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "3") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "4") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "5") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "6") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "7") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "8") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "9") {
            minutesMenu = "0" + minutesMenu;
        } else if (minutesMenu == "0") {
            minutesMenu = "0" + minutesMenu;
        }

        if (hoursMenu == "0") {
            hoursMenu = "0" + hoursMenu;
        }

        let temp = hoursMenu + minutesMenu;
        
        let numTemp = parseInt(temp);
        setCurfewTime(numTemp);

        if (parseInt(hoursMenu) != defaultHours || parseInt(minutesMenu)!=defaultMins) {
            //setInitialCurfewTime(curfewTime);  
            curfewMutationFunc(numTemp);   
            setDefaultHours(hoursMenu);
            setDefaultMins(minutesMenu);    
        }

        setRestrictionsChanged(false);
    };

    useEffect(() => {
        // Num invites
        if (!numInvitesQuery.loading && !numInvitesQuery.error) {
            const invites = numInvitesQuery.data.getTotalNumberOfVisitors;
            setNumInvitesSent(invites);
        } else if (numInvitesQuery.error) {
            if (numInvitesQuery.error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
        }

        // Parking spots available
        if (
            !numParkingSpotsAvailableQuery.loading &&
            !numParkingSpotsAvailableQuery.error
        ) {
            const numParkingspots =
                numParkingSpotsAvailableQuery.data.getTotalAvailableParking;
            setNumParkingSpotsAvailable(numParkingspots);
            setInitialNumParkingSpots(numParkingspots);
            setNumParkingSpotsAvailableToday(
                numParkingSpotsAvailable - parkingDateMap.get(parkingStartDate)
            );
        } else if (numParkingSpotsAvailableQuery.error) {
            setNumParkingSpotsAvailable("Error");
        }

        if (
            !numInvitesPerResidentQuery.loading &&
            !numInvitesPerResidentQuery.error
        ) {
            setNumInvitesPerResident(
                numInvitesPerResidentQuery.data.getNumInvitesPerResident.value
            );
            setInitialNumInvitesPerResident(numInvitesPerResident);
        } else if (numInvitesPerResident.error) {
        }

        if (
            !numSleepoversPerResidentQuery.loading &&
            !numSleepoversPerResidentQuery.error
        ) {
            setMaxSleepovers(
                numSleepoversPerResidentQuery.data.getMaxSleepovers.value
            );
            setInitialSleepovers(maxSleepovers);
        } else if (numSleepoversPerResidentQuery.error) {
        }


    }, [
        numInvitesQuery,
        numParkingSpotsAvailableQuery,
        setParkingVals,
        setNumParkingSpotsAvailable,
        numInvitesPerResidentQuery,
        numSleepoversPerResidentQuery,

    ]);

    function populateCurfew(){
        if (!CurfewTimeQuery.loading && !CurfewTimeQuery.error) {
            const curfew = CurfewTimeQuery.data.getCurfewTime.value;
            let tempH;
            let tempM;
            if (curfew == "0") {
                tempH = "00";
                tempM = "00";
            } else {
                let tempCurfew = String(curfew);
                if (tempCurfew.length == 3) {
                    tempCurfew = "0" + tempCurfew;
                }
                tempH = tempCurfew.substring(0, 2);
                tempM = tempCurfew.substring(2, 4);
            }
            setDefaultHours(tempH);
            setDefaultMins(tempM);
            setHours(tempH);
            setMinutes(tempM);
        }
    }

    useEffect(() => {
        populateCurfew();
    }, [CurfewTimeQuery]);

    return (
        <Layout>
            <div className="mb-3 space-y-3 px-3 pt-9">
                <div className="grid grid-cols-1 grid-rows-1 space-y-3">
                    <h1 className="flex flex-col items-center justify-center space-x-3 text-2xl font-bold lg:flex-row">
                        <span className="mr-3 text-xl text-primary md:text-3xl">
                            <MdBlock />
                        </span>{" "}
                        First things first, let's set a few rules
                        <div className="flex items-center">
                            {restrictionsChanged && (
                                <div className="flex space-x-1">
                                    <button
                                        onClick={saveRestrictions}
                                        className="btn btn-primary btn-sm space-x-3 lg:btn-md"
                                    >
                                        <span>
                                            <MdDataSaverOn className="mr-3 text-xl" />
                                        </span>{" "}
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={cancelRestrictions}
                                        className="btn btn-secondary btn-sm space-x-3 lg:btn-md"
                                    >
                                        <span>
                                            <MdDataSaverOff className="mr-3 text-xl" />
                                        </span>{" "}
                                        Cancel Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </h1>



                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Invites Per Resident{" "}
                                    <div className="badge badge-secondary">
                                        Resident
                                    </div>
                                </h2>
                                <p>
                                    Number of invites a resident is allowed to
                                    have open/sent at a time.
                                </p>
                                <div className="card-actions flex items-center justify-start">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            data-testid="increaseInvites"
                                            className="btn btn-circle"
                                            onClick={() => {
                                                setNumInvitesPerResident(
                                                    numInvitesPerResident + 1
                                                );
                                                setRestrictionsChanged(true);
                                            }}
                                        >
                                            <AiOutlinePlus className="text-xl md:text-2xl lg:text-3xl" />
                                        </button>
                                        <p
                                            id="numInvitesPerResident"
                                            className="text-4xl font-bold text-secondary"
                                        >
                                            {numInvitesPerResident}
                                        </p>
                                        <button
                                            data-testid="decreaseInvites"
                                            className="btn btn-circle"
                                            onClick={() => {
                                                numInvitesPerResident > 1 &&
                                                    setNumInvitesPerResident(
                                                        numInvitesPerResident -
                                                        1
                                                    );
                                                setRestrictionsChanged(true);
                                            }}
                                        >
                                            <AiOutlineMinus className="text-xl md:text-2xl lg:text-3xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Parking Spots Available{" "}
                                    <div className="badge badge-secondary">
                                        User
                                    </div>
                                </h2>
                                <p>
                                    Number of parking spots left in the
                                    building.
                                </p>
                                <div className="card-actions flex items-center justify-start">
                                    <div className="flex items-center space-x-3">

                                        <button className="btn btn-circle" onClick={() => {
                                            setNumParkingSpotsAvailable(numParkingSpotsAvailable + 1);
                                            setRestrictionsChanged(true);
                                        }}>
                                            <AiOutlinePlus className="text-xl md:text-2xl lg:text-3xl" />

                                        </button>
                                        <p
                                            id="numParkingSpotsAvailable"
                                            className="text-4xl font-bold text-secondary"
                                        >
                                            {numParkingSpotsAvailable}
                                        </p>

                                        <button className="btn btn-circle" onClick={() => {
                                            if (numParkingSpotsAvailable > 0) {
                                                setNumParkingSpotsAvailable(numParkingSpotsAvailable - 1);
                                            }

                                            setRestrictionsChanged(true);
                                        }}>
                                            <AiOutlineMinus className="text-xl md:text-2xl lg:text-3xl" />

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Curfew Time{" "}
                                    <div className="badge badge-secondary">
                                        Visitor
                                    </div>
                                </h2>
                                <p>
                                    Current curfew: {defaultHours}:{defaultMins}
                                </p>

                                <div className="card-actions flex items-center justify-start">
                                    <div className="flex items-center justify-center">

                                        <select className="select select-bordered select-secondary mx-5" name="hours" id="hours" onChange={(e) => {
                                            setHours(e.target.value);
                                            setRestrictionsChanged(true);
                                        }}>
                                            {hours.map( (value,index) => (
                                                value == defaultHours ? (
                                                    <option selected value={value}>{value}</option> 
                                                ):(
                                                    <option value={value}>{value}</option> 
                                                )
                                            ))}
                                        </select>
                                        <h1>    :    </h1>
                                        <select className="select select-bordered select-secondary mx-5" name="minutes" id="minutes" onChange={(e) => {
                                            setMinutes(e.target.value);
                                            setRestrictionsChanged(true);
                                        }}>
                                            {mins.map( (value,index) => (
                                                value == defaultMins ? (
                                                    <option selected value={value}>{value}</option> 
                                                ):(
                                                    <option value={value}>{value}</option> 
                                                )
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Sleepovers{" "}
                                    <div className="badge badge-secondary">
                                        Resident
                                    </div>
                                </h2>
                                <p>
                                    Number of sleepovers a resident is allowed per month
                                </p>
                                <div className="card-actions flex items-center justify-start">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            data-testid="increaseSleepovers"
                                            className="btn btn-circle"
                                            onClick={() => {
                                                setMaxSleepovers(
                                                    maxSleepovers +
                                                    1
                                                );
                                                setRestrictionsChanged(true);
                                            }}
                                        >
                                            <AiOutlinePlus className="text-xl md:text-2xl lg:text-3xl" />
                                        </button>
                                        <p
                                            id="numInvitesPerResident"
                                            className="text-4xl font-bold text-secondary"
                                        >
                                            {maxSleepovers}
                                        </p>
                                        <button
                                            data-testid="decreaseInvites"
                                            className="btn btn-circle"
                                            onClick={() => {
                                                maxSleepovers > 1 &&
                                                    setMaxSleepovers(
                                                        maxSleepovers -
                                                        1
                                                    );
                                                setRestrictionsChanged(true);
                                            }}
                                        >
                                            <AiOutlineMinus className="text-xl md:text-2xl lg:text-3xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pl-4">Here we set the ammount of invites a resident is allowed to have open at any given time</div>
                        <div className="pl-4">Here we set the ammount of parking spots our building has availiable</div>
                        <div className="pl-4">Here we set the time by which visitors must leave the building before they are clasified as sleeping over</div>
                        <div className="pl-4">Here we set the ammount of sleepovers a resident is allowed per month</div>

                    </div>
                </div>
            </div>

        </Layout>
    );
};

// export async function getStaticProps(context) {
//     return {
//         props: {
//             protected: true,
//             permission: 0,
//         },
//     };
// }

export default Initialize;
