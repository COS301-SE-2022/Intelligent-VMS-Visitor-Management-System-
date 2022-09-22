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
                <div className="inline-flex absolute -top-2 -right-2 justify-center border-none bg-secondary items-center w-6 h-6 text-xs font-bold text-white rounded-full">{(new Date()).getDate()-(new Date(signInTime).getDate())}</div>
            ):(
                <div></div>
            )}

            
        </label>
        
        </div>
    );
};

export default ReceptionistSignButton;
