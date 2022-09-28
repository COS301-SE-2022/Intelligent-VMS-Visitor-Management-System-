import { BiMailSend } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";

const TeamCard = ({name, numInvites, numVisitors, lastActivity}) => {
    return (
        <div className="card col-span-1 bg-base-100 p-2 text-center md:mx-4">
            <div className="card-title flex flex-col justify-center">
                <div className="avatar placeholder">
                    <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                        <span className="text-xl capitalize">{name[0]}</span>
                    </div>
                </div>
                <h2 className="text-base">{name}</h2>
            </div>
            <div className="card-body">
                <div>
                    <p>
                        <span className="text-lg">{lastActivity}</span>
                        <span>/last invite</span>
                    </p>
                </div>
                <br />
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="flex space-x-3">
                            <BiMailSend className="text-2xl" />
                            <p>{numInvites} invites sent</p>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex">
                        <div className="flex space-x-3">
                            <BsFillPeopleFill className="text-2xl" />
                            <p>{numVisitors} visitors received</p>
                        </div>
                    </div>
                    <div className="divider"></div>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;
