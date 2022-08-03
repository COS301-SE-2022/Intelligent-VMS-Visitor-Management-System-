import create from "zustand";
import { persist } from "zustand/middleware";

const useTheme = create(
    persist(
        (set,get) => ({
            theme: "dark",
            setTheme: (theme) => {
                set((state) => ({
                    theme: theme
                }));
            }
        }),
		{ name: "theme" }
    )
);

export default useTheme;
