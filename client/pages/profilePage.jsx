import React from 'react';
import Badge from '../components/badge';
import Layout from '../components/Layout';
import {AiFillStar} from "react-icons/ai";
import {FaFlagCheckered} from "react-icons/fa";

const ProfilePage = () => {
    return (
        <Layout>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
            <div className="avatar placeholder m-3">
                <div className="w-20 rounded-full bg-secondary text-neutral-content">
                    <span className="text-5xl capitalize">
                        {"R"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl font-bold capitalize">{"Larisa Botha"}</div>
                <h3 className='text-primary' >Level 3 </h3>
            </div>

  
        </div>

        <div className="flex flex-row items-center w-full px-10 mx-5 relative">
                <AiFillStar className="text-secondary justify-self-center" size={40}/>
                <div className="rounded bg-base-200 h-4 w-full mx-3 content-center">
                    <div className="bg-secondary rounded h-4 w-1/4 text-right align-text-middle text-[11px] pr-1 font-bold">25 XP</div>
                </div> 
                <FaFlagCheckered className="pb-2" size={30}/>
                <span className='pb-2 ml-2 text-xs ' > Maximum Access </span> 
                
        </div>

            <div className="divider mt-10 text-base md:text-lg lg:text-2xl">
                    BADGES
            </div>
            
        
        <div className="mx-5 mt-5 grid grid-cols-7 space-y-2 space-x-3 w-full">
            <Badge width={160} level={1} type="concept" colour="#be185d" text="CONCEPT CONNOISSEUR" desc="You created 3 invites"/>
            <Badge width={160} level={1} type="invite" colour="#84cc16" text="INVITE ROOKIE" desc="You created 3 invites"/>
            <Badge width={160} level={2} type="invite" colour="#84cc16" text="INVITE AMATEUR" desc="You created 30 invites"/>
            <Badge width={160} level={3} type="invite" colour="#84cc16" text="INVITE EXPERT" desc="You created 300 invites"/>
            <Badge width={160} level={1} type="sleepover" colour="#1e3a8a" text="SLEEPOVER PARTY" desc="You hosted 7 sleepovers"/>
            <Badge width={160} level={1} type="time" colour="#dc2626" text="VMS TODDLER" desc="You are celebrating 30 days with VMS"/>
            <Badge width={160} level={3} type="suggestion" colour="#22d3ee" text="ULTIMATE ADVISEE" desc="You used 2 system suggestions"/>
            <Badge width={160} level={1} type="visits" colour="#facc15" text="MR. POPULAR" desc="You had 15 visitors"/>
            <Badge width={160} level={2} type="visits" colour="#facc15" text="MRS. POPULAR" desc="You had 25 visitors"/>
            <Badge width={160} level={3} type="visits" colour="#facc15" text="DR. POPULAR" desc="You had 100 visitors"/>
        </div>

        <div className="divider mt-10 text-base md:text-lg lg:text-2xl">
            PRIVILEGES
        </div>
        
        </Layout>
    );
}

export default ProfilePage;
