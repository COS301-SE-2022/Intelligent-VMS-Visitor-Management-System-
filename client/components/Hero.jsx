import Link from "next/link";

import { motion } from "framer-motion";
import { BiRightArrowAlt } from "react-icons/bi";

import useAuth from "../store/authStore";

const Hero = () => {
    const decodedToken = useAuth((state) => {
        return state.decodedToken;
    })();

    const heroContainer = {
        animate: {
            transition: {
                staggerChildren: 0.8,
                ease: "linear",
            },
        },
    };

    const spinArrow = {
        initial: {
            transition: {
                ease: "easeInOut",
            },
        },
        animate: {
            x: [0, 8, 0],
            transition: {
                ease: "linear",
                repeat: Infinity,
                duration: 1,
            },
        },
        hover: {
            x: 10,
            transition: {
                ease: "linear",
                duration: 0.4,
            },
        },
    };

    return (
        <div className="hero min-h-[80vh]">
            <div className="hero-content">
                <motion.div className="max-w-md overflow-y-hidden">
                    <motion.h1 className="text-4xl font-bold">
                        Go{" "}
                        <motion.span className="text-secondary">
                            Beyond
                        </motion.span>{" "}
                        The Lobby{" "}
                        <motion.span className="text-primary">.</motion.span>
                    </motion.h1>

                    <motion.p className="py-6">
                        Get there with the leading system in intelligent visitor management.
                    </motion.p>
                    <Link
                        href={
                            decodedToken === undefined
                                ? "/login"
                                : "/createInvite"
                        }
                    >
                        <motion.button
                            initial="initial"
                            whileHover="hover"
                            animate="animate"
                            className="btn btn-primary"
                        >
                            Get Started{" "}
                            <motion.span
                                variants={spinArrow}
                                className="text-lg"
                            >
                                {" "}
                                <BiRightArrowAlt />
                            </motion.span>{" "}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
