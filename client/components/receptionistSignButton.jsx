const ReceptionistSignButton = ({ htmlFor, text, colour, onClick }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`modal-button btn max-w-md border-0 ${colour} text-white`}
            onClick={onClick}
        >
            {text}
        </label>
    );
};

export default ReceptionistSignButton;
