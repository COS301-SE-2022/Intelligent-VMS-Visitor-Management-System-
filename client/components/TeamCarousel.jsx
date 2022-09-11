import { useState, useEffect } from "react";

import TeamCard from "../components/TeamCard"; 

const TeamCarousel = ({ slideContent, numToShowPerSlide }) => {
    const [slides, setSlides] = useState([]);

    const calculateSlides = (slideData) => {
        const slides = [];
        const numSlides = Math.ceil(slideContent.length / numToShowPerSlide);

        for (let currSlide = 0; currSlide < numSlides; currSlide++) {
            const slideArr = [];
            const lhs = slideData.shift();
            const rhs = slideData.shift();

            if (lhs) {
                slideArr.push({
                    email: lhs.email,
                    numInvites: lhs.numInvites,
                    numVisitors: lhs.numVisitors,
                    lastInvite: lhs.firstDate
                });
            }

            if (rhs) {
                slideArr.push({
                    email: rhs.email,
                    numInvites: rhs.numInvites,
                    numVisitors: rhs.numVisitors,
                    lastInvite: lhs.firstDate
                });
            }

            slides.push({
                currSlide: currSlide + 1,
                prevSlide: currSlide+1 !== 1 ? currSlide : numSlides,
                nextSlide: currSlide !== numSlides ? currSlide + 1 : 1,
                data: slideArr
            });
        }
        return slides;
    };

    useEffect(() => {
        const slides = calculateSlides(slideContent);
        setSlides(slides);
        console.log(slides);
    }, [slideContent]);

    return (
        <div className="carousel carousel-center w-full">
            {slides.length === 0 ? 
                <div>Nothing to show...</div>
                :
                slides.map((slide, idx) => {
                    return(
                    <div key={idx} id={`slide${slide.currSlide}`} className="carousel-item w-full">
                        <div className="mx-8 grid w-full grid-cols-1 justify-center gap-3 md:grid-cols-2">
                            {slide.data.map((c, idx) => {
                                return (
                                    <TeamCard 
                                        key={idx} 
                                        name={c.email} 
                                        numInvites={c.numInvites} 
                                        numVisitors={c.numVisitors}
                                        lastActivity={c.lastInvite}
                                    />
                                );
                            })}
                        </div>

                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a href={`#slide${slide.prevSlide}`} className="btn btn-circle">
                                ❮
                            </a>
                            <a href={`#slide${slide.nextSlide}`} className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TeamCarousel;
