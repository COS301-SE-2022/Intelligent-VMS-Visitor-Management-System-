import create from "zustand";
import { persist } from "zustand/middleware";

const useTheme = create(
    persist(
        (set,get) => ({
            theme: "dark",
            themes: ["dark", "business", "winter", "random"],
            otherThemes: ["dark", "business", "winter", "random"],
            setTheme: (theme) => {
                set((state) => ({
                    theme: theme
                }));
            },
            addTheme: () => {
                set((state) => ({
                    themes: ["dark", "business", "winter", "autumn", "random"]
                }));
            },
        }),
		{ name: "theme" }
    )
);

export default useTheme;
