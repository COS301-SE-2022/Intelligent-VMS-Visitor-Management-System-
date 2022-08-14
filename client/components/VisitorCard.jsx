import Link from "next/link";

const VisitorCard = ({ name, email, numInvites }) => {
    return (
        <div>
            <div className="flex items-center justify-between shadow rounded-lg p-3 bg-base-200">
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
                        <p className="text-sm text-neutral-content">
                            {email}
                        </p>
                    </div>
                </div>
                <div className="stats text-2xl">
                    <div className="stat">
                        <div className="stat-value">{numInvites}</div>
                        <div className="stat-desc">Total Invites</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorCard;
