import { useEffect } from "react";

import { BsPalette2 } from "react-icons/bs";

import useTheme from "../store/themeStore";

const ThemeSelector = () => {
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

export default ThemeSelector;
