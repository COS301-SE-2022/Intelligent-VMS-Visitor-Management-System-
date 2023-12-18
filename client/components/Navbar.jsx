import Link from "next/link";

import ThemeSelector from "./ThemeSelector";
import useAuth from "../store/authStore";

const Navbar = () => {
    const navlinks = useAuth((state) => {
        return state.navLinks;
    })();
    const token = useAuth((state) => {
        return state.decodedToken;
    })();

    return (
        <nav className="navbar w-full bg-neutral sm:rounded-xl">
            <div className="navbar-start">
                <Link href="/">
                    <a className="navIcon btn btn-ghost text-xl normal-case">
                        <svg
                            width="77"
                            height="36"
                            viewBox="0 0 77 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M44.1619 28.8182L38.8885 12.2415H38.6861L33.402 28.8182L28.2884 28.8182L35.8097 7H41.7543L49.2862 28.8182H44.1619Z"
                                fill="black"
                            />
                            <path
                                d="M63.2678 22.5433C63.353 23.4027 63.7187 24.0703 64.3651 24.5462C65.0114 25.022 65.8885 25.2599 66.9964 25.2599C67.7493 25.2599 68.3849 25.1534 68.9034 24.9403C69.4219 24.7344 69.8196 24.4467 70.0966 24.0774C70.3665 23.7081 70.5014 23.2891 70.5014 22.8203C70.5156 22.4297 70.4339 22.0888 70.2564 21.7976C70.0717 21.5064 69.8196 21.2543 69.5 21.0412C69.1804 20.8352 68.8111 20.6541 68.392 20.4979C67.973 20.3487 67.5256 20.2209 67.0497 20.1143L65.0895 19.6456C64.1378 19.4325 63.2642 19.1484 62.4688 18.7933C61.6733 18.4382 60.9844 18.0014 60.402 17.483C59.8196 16.9645 59.3686 16.3537 59.049 15.6506C58.7223 14.9474 58.5554 14.1413 58.5483 13.2322C58.5554 11.897 58.8963 10.7393 59.571 9.75923C60.2386 8.78622 61.2045 8.02983 62.4688 7.49006C63.7259 6.95739 65.2422 6.69105 67.0178 6.69105C68.7791 6.69105 70.3132 6.96094 71.62 7.50071C72.9197 8.04048 73.9354 8.83949 74.6669 9.89773C75.3913 10.9631 75.7713 12.2805 75.8068 13.8501H71.343C71.2933 13.1186 71.0838 12.5078 70.7145 12.0178C70.3381 11.5348 69.8374 11.169 69.2124 10.9205C68.5803 10.679 67.8665 10.5582 67.071 10.5582C66.2898 10.5582 65.6115 10.6719 65.0362 10.8991C64.4538 11.1264 64.0028 11.4425 63.6832 11.8473C63.3636 12.2521 63.2038 12.7173 63.2038 13.2429C63.2038 13.733 63.3494 14.1449 63.6406 14.4787C63.9247 14.8125 64.3437 15.0966 64.8977 15.331C65.4446 15.5653 66.1158 15.7784 66.9112 15.9702L69.2869 16.5668C71.1264 17.0142 72.5788 17.7138 73.6442 18.6655C74.7095 19.6172 75.2386 20.8991 75.2315 22.5114C75.2386 23.8324 74.8871 24.9865 74.1768 25.9737C73.4595 26.9609 72.4759 27.7315 71.2259 28.2855C69.9759 28.8395 68.5554 29.1165 66.9645 29.1165C65.3452 29.1165 63.9318 28.8395 62.7244 28.2855C61.5099 27.7315 60.5653 26.9609 59.8906 25.9737C59.2159 24.9865 58.8679 23.843 58.8466 22.5433H63.2678Z"
                                fill="black"
                            />
                        </svg>
                    </a>
                </Link>
            </div>
            <div className="navbar-end space-x-5 text-xs text-neutral-content md:text-sm">
                <div>
                    <ThemeSelector />
                </div>
                {token && (
                    <Link href="/visitorDashboard">
                        <a>
                            <div
                                className={
                                    "avatar placeholder rounded-full " +
                                    (token.permission === 0
                                        ? "bg-primary"
                                        : token.permission === 1
                                        ? "bg-secondary"
                                        : "bg-accent")
                                }
                            >
                                <div className="w-10 text-primary-content">
                                    <span className="text-xl">
                                        {token ? token.name[0] : ""}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </Link>
                )}
                <div className="dropdown-end dropdown">
                    <label tabIndex="0" className="menuIcon btn btn-ghost">
                        <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                className="menuPath"
                                width="16"
                                height="2"
                                rx="1"
                                fill="#D9D9D9"
                            />
                            <rect
                                className="menuPath"
                                y="5"
                                width="16"
                                height="2"
                                rx="1"
                                fill="#D9D9D9"
                            />
                            <rect
                                className="menuPath"
                                y="10"
                                width="16"
                                height="2"
                                rx="1"
                                fill="#D9D9D9"
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex="0"
                        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-neutral p-2 text-neutral-content shadow"
                    >
                        {navlinks.map((link, idx) => {
                            return (
                                <Link key={idx} href={link.path}>
                                    <a
                                        className="btn btn-ghost"
                                        onClick={link.onClick && link.onClick}
                                    >
                                        {link.content}
                                    </a>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
