const ReceptionistSignButton = ({ htmlFor, text, colour }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`mmodal-button btn max-w-md border-0 ${colour} text-white`}
            >
                { text }
        </label>
    );
}

export default ReceptionistSignButton;
