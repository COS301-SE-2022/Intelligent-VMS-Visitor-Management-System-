import Image from "next/image";

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
            <section className="mb-8 space-y-4 mx-5">
                <h1 className="text-primary text-center font-bold text-xl md:text-left md:text-2xl">
                    Our Mission
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:mr-10 lg:mr-24">
                        <p className="text-lg font-bold">
                            We&apos;re building a platform to bring security
                            and intelligence to residential buildings while still
                            providing a simple and effiecent process for its
                            residents.
                        </p>
                        <div className="divider"></div>
                        <p>
                            VMS aims to provide a simple and modern interface
                            where residents, receptionists and building managers 
                            will come together to create a modern residential building
                            community.
                        </p>
                    </div>
                    <div>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>01.</span>
                                    <h2 className="font-bold">Visitor And Parking Forecasting</h2>
                                </div>
                                <p className="ml-8">
                                    We provide you with visitor and parking prediction data based
                                    on system usage.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>02.</span>
                                    <h2 className="font-bold">Facial Recognition</h2>
                                </div>
                                <p className="ml-8">
                                    Facial recognition systems are used to add another layer of security.
                                    Visitors must sign in using their face before the invite is authorised.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>03.</span>
                                    <h2 className="font-bold">Intelligent Visitor Invite Suggestions</h2>
                                </div>
                                <p className="ml-8">
                                    The system generates visitor suggestions for specific days on the week
                                    based on past invites and activities.
                                </p>
                            </li>
                            <li className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <span>04.</span>
                                    <h2 className="font-bold">Rewards</h2>
                                </div>
                                <p className="ml-8">
                                    To promote good behviour our badge and leveling system is used to allow users
                                    to gain extra invites and longer visitor hours when invites are used. 
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div>
                    </div>
                </div>
            </section>
            <section className="mb-8 space-y-4 mx-5">
                <h1 className="text-primary text-center font-bold text-xl md:text-left md:text-2xl">
                    Our Development Team
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="card bg-base-200 p-3 space-y-1">
                        <div className="card-body p-3">
                            <Image className="rounded-lg" src={KyleImg} alt="Kyle Smith" width="100" height="100" layout="responsive"/>
                        </div>
                        <h2 className="text-center font-bold text-lg">Kyle Smith</h2>
                        <p className="text-center">Developer</p>
                        <div className="flex justify-center text-xl space-x-3">
                            <a href="https://github.com/KyleSmith19091" target="blank">
                                <AiFillGithub />
                            </a>
                            <a href="http://www.linkedin.com/in/kyle-s-008636162/" target="blank">
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="card bg-base-200 p-3 space-y-1">
                        <div className="card-body p-3">
                            <Image className="rounded-lg" src={LarisaImg} alt="Larisa Botha" width="100" height="100" layout="responsive"/>
                        </div>
                        <h2 className="text-center font-bold text-lg">Larisa Botha</h2>
                        <p className="text-center">Developer</p>
                        <div className="flex justify-center text-xl space-x-3">
                            <a href="https://github.com/LarisaBothaTuks" target="blank">
                                <AiFillGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/larisa-botha-80512419a/" target="blank">
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="card bg-base-200 p-3 space-y-1">
                        <div className="card-body p-3">
                            <Image className="rounded-lg" src={StefanImg} alt="Stefan van Schoor" width="100" height="100" layout="responsive"/>
                        </div>
                        <h2 className="text-center font-bold text-lg">Stefan van Schoor</h2>
                        <p className="text-center">Developer</p>
                        <div className="flex justify-center text-xl space-x-3">
                            <a href="https://github.com/stefan-van-schoor" target="blank">
                                <AiFillGithub />
                            </a>
                            <a href="http://www.linkedin.com/in/stefan-van-schoor-0a0367138/" target="blank">
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="card bg-base-200 p-3 space-y-1">
                        <div className="card-body p-3">
                            <Image className="rounded-lg" src={TabithaImg} alt="Tabitha Jemwa" width="100" height="100" layout="responsive"/>
                        </div>
                        <h2 className="text-center font-bold text-lg">Tabitha Jemwa</h2>
                        <p className="text-center">Developer</p>
                        <div className="flex justify-center text-xl space-x-3">
                            <a href="https://github.com/Tabby709" target="blank">
                                <AiFillGithub />
                            </a>
                            <a href="http://www.linkedin.com/in/tabitha-jemwa-008636162/" target="blank">
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="card bg-base-200 p-3 space-y-1">
                        <div className="card-body p-3">
                            <Image className="rounded-lg" src={DanielImg} alt="Daniel Burgess" width="100" height="100" layout="responsive"/>
                        </div>
                        <h2 className="text-center font-bold text-lg">Daniel Burgess</h2>
                        <p className="text-center">Developer</p>
                        <div className="flex justify-center text-xl space-x-3">
                            <a href="https://github.com/Daniel-J-Burgess" target="blank">
                                <AiFillGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/daniel-burgess-2bb12897/" target="blank">
                                <AiFillLinkedin />
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </Layout>
    );
};

export default Home;
