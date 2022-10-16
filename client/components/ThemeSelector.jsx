import { useEffect, useState } from "react";
import useAuth from "../store/authStore.js";
import { BsPalette2 } from "react-icons/bs";
import { gql, useApolloClient, useLazyQuery } from "@apollo/client";

import useTheme from "../store/themeStore";

const ThemeSelector = () => {
    // const client = useApolloClient();
    // const allThemes = ["dark", "business", "winter", "autumn", "random"];
    
    // // Get Data From JWT Token
    // const token = useAuth((state) => state.decodedToken)();
    // let themes = []; 

    // if(token){
    //     if(token.permission === 2){

    //         client.query({
    //             query: gql`
    //             query {
    //                 getNumThemes( email: "${token.email}" )
    //             }
    //         `,
    //         }).then((res) => {  
    //             themes = allThemes.slice(0,(Number(res.data.getNumThemes))+4);
    //         })
             
    //     } else {
    //         themes = allThemes.slice(0,5);
    //     }
    // } else {
    //     themes = allThemes.slice(0,2);
    // }

    const token = useAuth((state) => state.decodedToken)();
    const theme = useTheme((state) => state.theme);
    const themes = useTheme((state) => state.themes);
    const otherThemes = useTheme((state) => state.otherThemes);
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
                { token && token.permission >= 0 ?
                themes.map((theme, idx) => {
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
                })
                :
                otherThemes.map((theme, idx) => {
                    return (
                        <li
                            key={idx}
                            onClick={() => {
                                setTheme(
                                    theme !== "random"
                                        ? theme
                                        : otherThemes[
                                              Math.floor(
                                                  Math.random() *
                                                      otherThemes.length -
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
                })
                }
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
