const AlertGroup = ({ children }) => {
    return (
        <div className="absolute left-0 right-0 z-[999] my-0 mx-auto mt-1 flex w-full flex-col items-center space-y-3">
            {children}
        </div>
    );
};

export default AlertGroup;
