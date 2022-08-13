import Link from "next/link";

const VisitorCard = ({ name, email, numInvites }) => {
    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-xl capitalize">{name[0]}</span>
                        </div>
                    </div>
                    <h2 className="card-title capitalize text-secondary">{name}</h2>
                    <p className="text-sm text-neutral-content">
                        {email}
                    </p>
                </div>
                <div className="divider">Invites</div>
                <div className="flex flex-col">
                    <p>Total Invites</p>
                    <p className="text-2xl">{numInvites}</p>
                </div>
                <div className="card-actions justify-end">
                    <Link href={"/createInvite?name=" 
                        + name
                        + "&email=" +
                        email}>
                        <a className="btn btn-primary">Create Invite</a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VisitorCard;
