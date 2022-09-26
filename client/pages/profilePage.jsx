import React,{useEffect, useState} from 'react';
import { useRouter } from "next/router";
import Badge from '../components/badge';
import Layout from '../components/Layout';
import {AiFillStar} from "react-icons/ai";
import {FaFlagCheckered} from "react-icons/fa";
import {ImCross,ImCheckmark} from "react-icons/im";
import useAuth from "../store/authStore.js";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";

const ProfilePage = () => {

    const [xp,setXP] = useState(0);
    const [userBadges,setUserBadges] = useState("");
    const [badges,setBadges] = useState([]);
    const [rewards,setRewards] = useState([]);
    const [progress,setProgress] = useState([]);

    // Get Data From JWT Token
    const token = useAuth((state) => state.decodedToken)();

    const [profileQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getProfileInfo( email: "${token.email}" ) {
                xp
                badges
                progress
                allBadges {
                    type
                    levels
                    xp
                    title
                    desc
                }
                allRewards{
                    xp
                    type
                    desc
                }
            }
        }
    `,
        { fetchPolicy: "no-cache" }
    );

    const router = useRouter();
    useEffect(() => {
  
        profileQuery();
        if (!loading && !error) {
            if (data) {
                let info = data.getProfileInfo;
                setXP(info.xp);
                setBadges(info.allBadges);
                setRewards(info.allRewards);
                setUserBadges(info.badges);
                setProgress(info.progress);
            }
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
        }
    }, [loading, error, router, data, profileQuery]);

    document.body.style = "overflow-x:hidden";
    return (

        <Layout>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
            <div className="avatar placeholder m-3">
                <div className="w-20 rounded-full bg-secondary text-neutral-content">
                    <span className="text-5xl capitalize">
                        {token.name[0]}
                    </span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
                <div className="text-xl font-bold capitalize">{token.name}</div>
                
            </div>
        </div>

         <div className="flex flex-row items-center w-full px-10 mx-5 relative">

                <div className="flex justify-self-end items-center">
                    <AiFillStar className="text-secondary" size={40}/>
                    <span className="truncate text-sm font-bold ml-3">{xp} XP</span>
                </div>
                <div className="rounded bg-base-200 h-4 w-full mx-3 content-center">
                    <div style={{ width: `${progress}%`}} className="bg-secondary rounded h-4"></div>
                </div> 
                <FaFlagCheckered className="pb-2" size={30}/>
                <span className='pb-2 ml-2 text-xs' > Maximum Access</span> 
                
        </div>

    
        <div className="divider mt-10 text-base md:text-lg lg:text-2xl px-3">
                BADGES
        </div>
        
        <div className="mx-5 mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 space-y-2 space-x-3">

            {badges.map((badge, idx) => {
                return [...Array(badge.levels)].map((x,i) => {
                    let active = false; 
                    if(parseInt(userBadges[idx])>=i+1){
                        active = true;
                        return <Badge key={i} active={active} width={160} level={i+1} type={badge.type} title={badge.title[i]} desc={badge.desc[i]} xp={badge.xp[i]}/>
                    }  
                })      
            })}
 
        </div>

        <div className="divider mt-10 text-base md:text-lg lg:text-2xl px-3">
            PRIVILEGES
        </div>

        <div className="flex h-full items-center justify-center overflow-x-auto p-3">
                {loading ? (
                    <progress className="progress progress-primary w-56">
                        progress
                    </progress>
                ) : (
                    <table className="mb-5 table w-full">
                        <thead>
                            <tr>
                                <th>Requirement</th>
                                <th>Reward</th>
                                <th></th>
                            </tr>
                        </thead>
                        {rewards.length > 0 ? (
                            <tbody>
                                {rewards.map((reward, idx) => {
                                    return (
                                        <tr
                                            className="hover z-0 cursor-pointer"
                                            key={idx}
                                        >
                                            <td className="capitalize ">
                                                {reward.xp+" XP"}
                                            </td>
                                            <td className="">
                                                {reward.desc}
                                            </td>

                                            <td className="">
                                            {xp<reward.xp? (
                                                <ImCross className="text-error"/>
                                            ):(
                                                <ImCheckmark className="text-success"/>
                                            )}
                                            </td>
                                            
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <th>Nothing to show...</th>
                                </tr>
                            </tbody>
                        )}
                    </table>
                )}
            </div>
        
        </Layout>
    );
}
export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}
export default ProfilePage;
