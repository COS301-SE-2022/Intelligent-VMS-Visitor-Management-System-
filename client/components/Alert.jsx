import { BiError } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";

const Alert = ({ style, options, message, close }) => {

    if(options.type === "error") {
        return (
            <div style={style} className="rounded-xl bg-error flex flex-col p-8 juistify-center items-center">
                <div className="flex items-center space-x-4">
                    <BiError className="text-2xl"/>
                    <h2 className="text-bg-error font-bold">Error: </h2>
                    <p className="text-base font-normal">{message}</p>
                    <button onClick={close}>✕</button>
                </div>
            </div>
        );
    } else if(options.type === "info") {
        return (
                        <div style={style} className="rounded-xl bg-info flex flex-col p-8 juistify-center items-center">
                <div className="flex items-center space-x-4">
                    <BiInfoCircle className="text-2xl"/>
                    <h2 className="text-bg-info font-bold">Info: </h2>
                    <p className="text-base font-normal">{message}</p>
                    <button onClick={close}>✕</button>
                </div>
            </div>
        );
    } else if(options.type === "success") {
        return (
            <div style={style} className="rounded-xl bg-success flex flex-col p-8 juistify-center items-center">
                <div className="flex items-center space-x-4">
                    <AiOutlineCheckCircle className="text-2xl"/>
                    <h2 className="text-bg-success font-bold">Success: </h2>
                    <p className="text-base font-normal">{message}</p>
                    <button onClick={close}>✕</button>
                </div>
            </div>
        );
    }

};

export default Alert;
