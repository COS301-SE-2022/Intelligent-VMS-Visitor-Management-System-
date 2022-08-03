import { motion } from "framer-motion";

const SuccessAlert = ({ message, showConditon }) => {
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
            <div className="alert alert-success shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Success!
                    <br/>
                    {message}
                </div>
            </div>
        </motion.div>
    );
};

export default SuccessAlert;
