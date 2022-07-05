import { useState } from "react";

const AuthCard = ({email, authorized, type}) => {
    
    const [auth, setAuth] = useState(authorized === true ? true : false);

    return (
        <div className="card bg-base-300 shadow-xl hover:shadow-none">
            <div className="card-body">
                <div className="text-center">
                    <div className="avatar placeholder">
                        <div className="w-24 rounded-full bg-neutral-focus text-neutral-content">
                            <span className="text-3xl uppercase">{email[0]}</span>
                        </div>
                    </div>
                </div>
                <h2 className="card-title items-center">
                    <span className="text-base">{email}</span>
                    <div className="badge badge-secondary uppercase">{auth === true ? "authorized" : "new"}</div>
                </h2>
                <div className="card-actions w-full flex space-x-3 items-center">
                    <div className="justify-start">
                        <div className="badge badge-primary">{type}</div>
                    </div>
                    <div className="justify-end">
                        <label className="label cursor-pointer space-x-3" onClick={() => setAuth(!auth)}>
                            <span className="label-text">Authorize</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={auth ? true : false}/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthCard;
