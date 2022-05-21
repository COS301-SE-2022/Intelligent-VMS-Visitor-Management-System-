import Link from "next/link";

import { motion } from "framer-motion";
import { BiRightArrowAlt } from "react-icons/bi";

import useAuth from "../store/authStore";

const Hero = () => {
    const decodedToken = useAuth((state) => state.decodedToken)();
    
    const spinArrow = {
        initial: {
            transition: {
                ease: "easeInOut"
            }
        },
        hover: {
            rotate: [0,360],
            transition: {
                ease: "easeInOut",
                duration: 1
            },
        }
    };
    
    return (
        <div className="hero min-h-[80vh]">
            <div className="hero-content">
                <motion.div className="max-w-md overflow-y-hidden">
                    <motion.h1 className="text-5xl font-bold">Hello there 👋</motion.h1>

                    <motion.p className="py-6">
                        <span className="text-secondary">V Ʌ S</span> is an intelligent visitor management system aiming
                        to bring an efficient and customizable interface for our
                        clients.
                    </motion.p>
                    <Link
                        href={
                            decodedToken === undefined
                                ? "/login"
                                : "/createInvite"
                        }
                    >
                        <motion.button initial="initial" whileHover="hover" className="btn btn-primary">Get Started <motion.span variants={spinArrow} className="text-lg"> <BiRightArrowAlt /></motion.span> </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
