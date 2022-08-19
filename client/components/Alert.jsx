import { useEffect, useState } from "react";

import { BiInfoCircle } from "react-icons/bi";
import { AiOutlineWarning } from "react-icons/ai";
import { HiOutlineXCircle } from "react-icons/hi";
import { FaAd, FaRegCheckCircle } from "react-icons/fa";

const Alert = ({ message, showAlert, info, warning, error, success }) => {
    const [progress, setProgress] = useState(100);
    const [show, setShow] = useState(showAlert);

    useEffect(() => {
        let intervalID = setInterval(() => {
            if (progress > 0) {
                setProgress(progress - 1);
            } else {
                clearInterval(intervalID);
                setShow(false);
            }
        }, 100);

        return () => {
            clearInterval(intervalID);
        };
    }, [progress]);

    const onAlertClick = () => {
        setShow(false);
    };

    if (info) {
        if (!show) {
            return <></>;
        }
        return (
            <div
                onClick={onAlertClick}
                className="alert alert-info max-w-xs cursor-pointer justify-center shadow-lg"
            >
                <div>
                    <BiInfoCircle className="text-2xl" />
                    <p>{message}</p>
                </div>
                <div
                    className="radial-progress text-info-content"
                    style={{
                        "--value": Number(progress),
                        "--size": "1.5rem",
                        "--thickness": "0.25rem",
                    }}
                ></div>
            </div>
        );
    } else if (warning) {
        if (!show) {
            return <></>;
        }
        return (
            <div
                onClick={onAlertClick}
                className="alert alert-warning max-w-xs cursor-pointer justify-center shadow-lg"
            >
                <div>
                    <AiOutlineWarning className="text-2xl" />
                    <p>{message}</p>
                </div>
                <div
                    className="radial-progress text-info-content"
                    style={{
                        "--value": Number(progress),
                        "--size": "1.5rem",
                        "--thickness": "0.25rem",
                    }}
                ></div>
            </div>
        );
    } else if (error) {
        if (!show) {
            return <></>;
        }
        return (
            <div
                onClick={onAlertClick}
                className="alert alert-error max-w-xs cursor-pointer justify-center shadow-lg"
            >
                <div>
                    <HiOutlineXCircle className="text-2xl" />
                    <p>{message}</p>
                </div>
                <div
                    className="radial-progress text-info-content"
                    style={{
                        "--value": Number(progress),
                        "--size": "1.5rem",
                        "--thickness": "0.25rem",
                    }}
                ></div>
            </div>
        );
    } else if (success) {
        if (!show) {
            return <></>;
        }
        return (
            <div
                onClick={onAlertClick}
                className="alert alert-success max-w-xs cursor-pointer justify-center shadow-lg"
            >
                <div>
                    <FaRegCheckCircle className="text-2xl" />
                    <p>{message}</p>
                </div>
                <div
                    className="radial-progress text-info-content"
                    style={{
                        "--value": Number(progress),
                        "--size": "1.5rem",
                        "--thickness": "0.25rem",
                    }}
                ></div>
            </div>
        );
    }
};

export default Alert;
