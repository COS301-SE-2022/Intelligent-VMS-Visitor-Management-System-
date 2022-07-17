import { motion } from "framer-motion";

const ErrorAlert = ({ message, showConditon }) => {
    const alertVariants = {
        hidden: { opacity: 1, y: -200 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -100 },
        click: { scale: 0.9 },
    };

    return (
        <motion.div
            variants={alertVariants}
            initial="hidden"
            animate={showConditon && "enter"}
            exit="exit"
            whileTap="click"
            transition={{ type: "linear" }}
            className="fixed top-3"
        >
            <div className="alert alert-error shadow-lg">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 flex-shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Error! {message}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ErrorAlert;
