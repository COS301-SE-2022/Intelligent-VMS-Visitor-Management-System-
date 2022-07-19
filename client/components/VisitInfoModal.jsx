import { HiIdentification } from "react-icons/hi";
import { MdPassword } from "react-icons/md";
import { BsFillCalendarEventFill, BsFillPersonCheckFill } from "react-icons/bs";

const VisitInfoModal = ({ setShowInfo, visitModalData }) => {
    if(!visitModalData) {
        return (
            <div className="progress"></div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                    <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                            <span className="text-2xl capitalize">{visitModalData.visitorName[0]}</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold capitalize">{visitModalData.visitorName}</h1>
                        <div className="badge badge-primary">Visitor</div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <BsFillCalendarEventFill className="text-2xl" />                    
                    <p>{visitModalData.inviteDate}</p>
                </div>
            </div>

            <div className="divider w-full">Invite Info</div>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <HiIdentification className="text-2xl"/>
                    <p>Expected ID Document: <span className="capitalize font-bold">{visitModalData.idDocType}</span></p>
                </div>
                <div className="flex items-center space-x-3">
                    <MdPassword className="text-2xl"/>
                    <p>Expected ID Number: <span className="capitalize font-bold">{visitModalData.idNumber}</span></p>
                </div>
                <div className="flex items-center space-x-3">
                    <BsFillPersonCheckFill className="text-2xl"/>
                    <p>User Email: <span className="font-bold">{visitModalData.userEmail}</span></p>
                </div>
            </div>
        </div>
    );
};

export default VisitInfoModal;
