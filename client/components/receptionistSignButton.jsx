const calculateDiff = (signInTime) => {
        const today = (new Date()).getTime();
        const other = new Date(signInTime.replace(/\-/g, '/')).getTime();
        const diff = today - other;
        return Math.floor(diff / (1000 * 3600 * 24));
}

const ReceptionistSignButton = ({ htmlFor, text, colour, onClick, key, signInTime }) => {
    return (
        <div className="float-left flex flex-wrap">
        <label
            key={key}
            className={`btn-sm inline-flex relative modal-button btn max-w-md border-0 ${colour} text-white`}
            onClick={onClick}
        >
            {text}
            {signInTime != null ? (
                <div className="inline-flex absolute -top-2 -right-2 justify-center border-none bg-secondary items-center w-6 h-6 text-xs font-bold text-white rounded-full">{calculateDiff(signInTime)}</div>
            ):(
                <div></div>
            )}

            
        </label>
        
        </div>
    );
};

export default ReceptionistSignButton;
