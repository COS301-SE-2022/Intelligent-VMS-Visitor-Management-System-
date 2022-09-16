const ReceptionistSignButton = ({ htmlFor, text, colour, onClick, key }) => {
    return (
        <label
            key={key}
            className={`max-w-md border-0 text-white p-3 ${colour} badge badge-md z-10`}
            onClick={onClick}
        >
            {text}
        </label>
    );
};

export default ReceptionistSignButton;
