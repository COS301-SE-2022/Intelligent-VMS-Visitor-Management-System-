import { useEffect, useState } from "react";
import useAuth from "../store/authStore.js";
import { BsPalette2 } from "react-icons/bs";
import { gql, useQuery } from "@apollo/client";

import useTheme from "../store/themeStore";

const ThemeSelector = () => {

    /*
    const allThemes = ["dark", "business", "winter", "autumn", "random"];
    const [numThemes,setNumThemes] = useState(2);
    
    // Get Data From JWT Token
    const token = useAuth((state) => state.decodedToken)();
    let themes = []; 

    if(token){
        if(token.permission === 2){

            const  themesQuery = useQuery(gql`
                query {
                    getNumThemes( email: "${token.email}" )
                }
            `,{ enabled: false });

            useEffect(() => {


                    if (!themesQuery.loading && !themesQuery.error) {
                        if (themesQuery.data) {
                            setNumThemes(themesQuery.data.getNumThemes);
                        }
                    }
                
        
    }, [numThemes]);

            themes = allThemes.slice(0,numThemes+4);
        } else {
            themes = allThemes.slice(0,5);
        }
    } else {
        themes = allThemes.slice(0,numThemes);
    }
    */
    
    const themes = ["dark", "business", "winter", "autumn", "random"];
    
    const theme = useTheme((state) => state.theme);
    const setTheme = useTheme((state) => state.setTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className="dropdown-end dropdown">
            <label tabIndex="0" className="btn m-1 text-xl">
                <BsPalette2 />
            </label>
            <ul
                tabIndex="0"
                className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 shadow"
            >
                {themes.map((theme, idx) => {
                    return (
                        <li
                            key={idx}
                            onClick={() => {
                                setTheme(
                                    theme !== "random"
                                        ? theme
                                        : themes[
                                              Math.floor(
                                                  Math.random() *
                                                      themes.length -
                                                      1
                                              )
                                          ]
                                );
                            }}
                            className={
                                "w-full bg-base-100 capitalize text-base-content"
                            }
                        >
                            <a>{theme}</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}
export default ThemeSelector;
