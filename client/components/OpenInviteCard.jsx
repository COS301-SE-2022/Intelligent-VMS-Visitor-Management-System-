import { MdPassword, MdOutlineDeleteOutline } from "react-icons/md";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { HiIdentification } from "react-icons/hi";

const OpenInviteCard = ({
    key,
    name,
    email,
    inviteID,
    inviteDate,
    idDocType,
    idNumber,
    cancelInvite,
}) => {
    return (
        <div
            key={key}
            className="relative flex flex-col rounded-xl bg-base-200 p-3"
        >
            <div className="flex justify-between">
                <div className="flex items-center space-x-3">
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
                        <p className="text-sm text-neutral-content">{email}</p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        if (!e.currentTarget.classList.contains("loading")) {
                            e.currentTarget.classList.add("loading");
                        }
                        cancelInvite(inviteID);
                    }}
                    data-testid="cancelbutton"
                    className="btn btn-circle btn-sm absolute top-[-0.5em] right-[-0.5em] text-lg"
                >
                    <MdOutlineDeleteOutline size={25} color={"#ff4d4d"}/>
                </button>
            </div>
            <div className="divider">Invite</div>
            <div className="flex justify-between p-1">
                <div className="flex items-center space-x-3">
                    <BsFillCalendarEventFill className="text-xl" />
                    <p className="font-bold">{inviteDate}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <HiIdentification className="text-2xl" />
                    <p className="font-bold capitalize">{idDocType}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <MdPassword className="text-2xl" />
                    <p className="font-bold capitalize">{idNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default OpenInviteCard;
