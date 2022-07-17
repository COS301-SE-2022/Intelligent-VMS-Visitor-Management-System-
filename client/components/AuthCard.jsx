import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const AuthCard = ({
    email,
    authorized,
    type,
    permission,
    deleteUserAccount,
}) => {
    const [auth, setAuth] = useState(authorized === true ? true : false);
    const [clicked, setClicked] = useState(false);

    return (
        <div className="card bg-base-300 shadow-xl hover:shadow-none">
            <div className="card-body">
                <div className="card-actions justify-end">
                    {permission === 0 && (
                        <label
                            htmlFor={"confirm-modal-" + email}
                            className="modal-button btn btn-circle btn-sm hover:btn-primary"
                        >
                            ✕
                        </label>
                    )}
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
                    <span className="text-xs md:text-sm">{email}</span>
                    <span className="badge badge-secondary uppercase">
                        {auth === true ? "authorized" : "new"}
                    </span>
                </h2>
                <div className="card-actions">
                    <div className="flex w-full items-center justify-between space-x-3">
                        <div className="badge badge-primary">{type}</div>
                        <label
                            className="label cursor-pointer space-x-3"
                            onChange={() => {
                                setAuth(!auth);
                            }}
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
            <input
                type="checkbox"
                id={"confirm-modal-" + email}
                className="modal-toggle"
            />
            <label
                htmlFor={"confirm-modal-" + email}
                className="modal cursor-pointer"
            >
                <label className="modal-box space-y-4">
                    <label
                        htmlFor={"confirm-modal-" + email}
                        className="btn btn-circle btn-sm absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Confirm Delete</h3>
                    <p>
                        You are about to delete a{" "}
                        <span className="text-warning">{type} </span>
                        account <span className="text-error">{email}</span>{" "}
                        forever...
                    </p>
                    <div className="modal-action">
                        <label
                            onClick={() => {
                                deleteUserAccount(email, type);
                            }}
                            htmlFor={"confirm-modal-" + email}
                            className="btn btn-error"
                        >
                            Delete
                        </label>
                    </div>
                </label>
            </label>
        </div>
    );
};

export default AuthCard;
