const ReceptionistSignButton = ({ htmlFor, text, colour, onClick, key }) => {
    return (
        <label
            htmlFor={htmlFor}
            key={key}
            className={`modal-button btn max-w-md border-0 ${colour} text-white z-10`}
            onClick={onClick}
        >
            {text}
        </label>
    );
};

export default ReceptionistSignButton;
