const ReceptionistSignButton = ({ htmlFor, text }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`modal-button btn max-w-md border-0 text-white bg-secondary`}
            >
                { text }
        </label>
    );
}

export default ReceptionistSignButton;
