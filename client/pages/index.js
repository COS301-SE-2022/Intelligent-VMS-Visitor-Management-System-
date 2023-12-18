import Image from "next/image";
import { motion } from "framer-motion";

import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";

import Layout from "../components/Layout";
import Hero from "../components/Hero";

import KyleImg from "../images/Kyle.JPG";
import StefanImg from "../images/Stefan.jpeg";
import TabithaImg from "../images/Tabitha.png";
import LarisaImg from "../images/Larisa.jpeg";
import DanielImg from "../images/Daniel.jpeg";

const Home = () => {
    return (
        <Layout>
            <Hero />
            <section className="mx-5 mb-8 space-y-4">
                <h1 className="text-center text-xl font-bold text-primary md:text-left md:text-2xl">
                    Our Mission
                </h1>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:mr-10 lg:mr-24">
                        <p className="text-lg font-bold">
                            We&apos;re building a platform to bring security and
                            intelligence to residential buildings while still
                            providing a simple and effiecent process for its
                            residents.
                        </p>
                        <div className="divider"></div>
                        <p>
                            <b>ASFALEAI</b> aims to provide a simple and modern
                            interface where residents, receptionists and
                            building managers will come together to create a
                            modern residential building community.
                        </p>
                    </div>
                    <div>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>01.</span>
                                    <h2 className="font-bold">
                                        Visitor And Parking Forecasting
                                    </h2>
                                </div>
                                <p className="ml-8">
                                    We provide you with visitor and parking
                                    prediction data based on system usage.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>02.</span>
                                    <h2 className="font-bold">
                                        Facial Recognition
                                    </h2>
                                </div>
                                <p className="ml-8">
                                    Facial recognition systems are used to add
                                    another layer of security. Visitors must
                                    sign in using their face before the invite
                                    is authorised.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>03.</span>
                                    <h2 className="font-bold">
                                        Intelligent Visitor Invite Suggestions
                                    </h2>
                                </div>
                                <p className="ml-8">
                                    The system generates visitor suggestions for
                                    specific days on the week based on past
                                    invites and activities.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>04.</span>
                                    <h2 className="font-bold">Rewards</h2>
                                </div>
                                <p className="ml-8">
                                    To promote good behviour our badge and
                                    leveling system is used to allow users to
                                    gain extra invites and longer visitor hours
                                    when invites are used.
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div></div>
                </div>
            </section>
            <section className="mx-5 mb-8 space-y-4"></section>
        </Layout>
    );
};

export default Home;
