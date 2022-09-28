import { HiIdentification } from "react-icons/hi";
import { MdPassword } from "react-icons/md";
import { AiFillCar } from "react-icons/ai";
import { BsFillCalendarEventFill, BsFillPersonCheckFill } from "react-icons/bs";
import { IoFileTrayFull } from "react-icons/io5";

const VisitInfoModal = ({ setCurrentVisitData, setShowVisitorModal, setShowSignOutModal, visitModalData }) => {
    if (!visitModalData) {
        return <div data-testid="visitinfoprogress" className="progress"></div>;
    }
    
    const transformStateString = (state) => {
        if(state === "inActive") {
            return "Inactive";
        } else if(state === "signedIn") {
            return "Signed In";
        } else if(state === "signedOut") {
            return "Signed Out";
        } else {
            return state.toUpperCase();
        }
    };

    return (
        <div className="flex w-full flex-col">
            <div className="grid grid-cols-3 items-center justify-between">
                <div className="col-span-2 flex space-x-3">
                    <div className="avatar placeholder">
                        <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-2xl capitalize">
                                {visitModalData.visitorName[0]}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-bold capitalize">
                            {visitModalData.visitorName}
                        </h1>
                        <div className="badge badge-primary">Visitor</div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                        <BsFillCalendarEventFill className="text-xl" />
                        <p>{visitModalData.inviteDate}</p>
                    </div>
                    <div className="flex items-center space-x-3 w-full">
                        <div className={`badge badge-secondary justify-end`}>{transformStateString(visitModalData.inviteState)}</div>
                    </div>
                    { /*
                    <div className="flex items-center space-x-3">
                        <IoFileTrayFull className="text-xl" />
                        <p>7</p>
                        <AiFillCar className="text-xl" />
                        <p>13</p>
                    </div>
                    */
                    }
                </div>
            </div>

            <div className="divider w-full">Invite Info</div>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <HiIdentification className="text-2xl" />
                    <p>
                        Expected ID Document:{" "}
                        <span className="font-bold capitalize">
                            {visitModalData.idDocType}
                        </span>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <MdPassword className="text-2xl" />
                    <p>
                        Expected ID Number:{" "}
                        <span className="font-bold capitalize">
                            {visitModalData.idNumber}
                        </span>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <BsFillPersonCheckFill className="text-2xl" />
                    <p>
                        User Email:{" "}
                        <span className="font-bold">
                            {visitModalData.userEmail}
                        </span>
                    </p>
                </div>
            </div>
            {(visitModalData.inviteState === "signedIn" || visitModalData.inviteState === "EXTENDED") &&
                <div className="card-actions mt-3 justify-end">
                    <button onClick={() => {
                        setCurrentVisitData(visitModalData);
                        setShowVisitorModal(false);
                        setShowSignOutModal(true);
                    }}className="btn btn-error">Sign Out</button>
                </div>
            }
        </div>
    );
};

export default VisitInfoModal;
