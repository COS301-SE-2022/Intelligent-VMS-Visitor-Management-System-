import { motion } from "framer-motion";

const InfoAlert = ({ 
    trayNr, 
    currentVisitData, 
    showConditon, 
    setShowCondition 
}) => {
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
            onClick={() => { 
                setShowCondition(false); 
            }}
        >
            <div className="alert shadow-lg">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 flex-shrink-0 stroke-info"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <span>
                        Tray number for {currentVisitData.visitorName} : {trayNr}{" "}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoAlert;
