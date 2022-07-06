import { useState } from "react";

const AuthCard = ({ email, authorized, type, permission, deleteUserAccount }) => {
    const [auth, setAuth] = useState(authorized === true ? true : false);
    const [clicked, setClicked] = useState(false);

    return (
        <div className="card bg-base-300 shadow-xl hover:shadow-none">
            <div className="card-body">
                <div className="card-actions justify-end">
                    { permission === 0 && 
                        <label
                            htmlFor="my-modal"
                            className="modal-button btn btn-circle btn-sm hover:btn-primary"
                        >
                            ✕
                        </label>
                    }
                </div>
                <div className="text-center">
                    <div className="avatar placeholder">
                        <div className="w-24 rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-3xl uppercase">
                                {email[0]}
                            </span>
                        </div>
                    </div>
                </div>
                <h2 className="card-title items-center">
                    <span className="text-base">{email}</span>
                    <div className="badge badge-secondary uppercase">
                        {auth === true ? "authorized" : "new"}
                    </div>
                </h2>
                <div className="card-actions">
                    <div className="flex w-full items-center justify-between space-x-3">
                        <div className="badge badge-primary">{type}</div>
                        <label
                            className="label cursor-pointer space-x-3"
                            onChange={() => {}}
                            onClick={() => setAuth(!auth)}
                        >
                            <span className="label-text">Authorize</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={auth ? true : false}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box space-y-4">
                    <h3 className="text-lg font-bold">
                        Confirm Delete
                    </h3>
                    <p>
                        You are about to delete a <span className="text-warning">{type} </span>
                        account <span className="text-error">{email}</span> forever...
                    </p>
                    <div className="modal-action">
                        <label onClick={() => { deleteUserAccount(email, type); }} htmlFor="my-modal" className="btn btn-error">
                            Delete
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthCard;
