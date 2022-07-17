import { useEffect } from "react";

import { AiOutlineFormatPainter } from "react-icons/ai";

import useTheme from "../store/themeStore";


const ThemeSelector = () => {
    
    const themes = [
        "night",
        "dark",
        "dracula",
        "light",
        "pastel",
        "retro",
        "random"
    ];
    const theme = useTheme((state) => state.theme);
    const setTheme = useTheme((state) => state.setTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className="dropdown dropdown-end">
        <label tabIndex="0" className="btn m-1 text-xl"><AiOutlineFormatPainter /></label>
          <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              {themes.map((theme, idx) => {
                return (<li key={idx} onClick={() => { setTheme(theme !== "random" ? theme : themes[Math.floor(Math.random() * themes.length-1)]); }} className="capitalize cursor-pointer">
                    <a>{theme}</a>
                    </li>)
              })}
          </ul>
        </div>
    );
};

export default ThemeSelector;
