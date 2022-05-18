import Link from "next/link";

import useAuth from "../store/authStore";

const Hero = () => {
    const decodedToken = useAuth((state) => state.decodedToken)();

    return (
        <div className="hero min-h-[80vh]">
            <div className="hero-content">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there 👋</h1>
                    <p className="py-6">
                        <span className="text-secondary">V Ʌ S</span> is an intelligent visitor management system aiming
                        to bring an efficient and customizable interface for our
                        clients.
                    </p>
                    <Link
                        href={
                            decodedToken === undefined
                                ? "/login"
                                : "/createInvite"
                        }
                    >
                        <button className="btn btn-primary">Get Started</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
