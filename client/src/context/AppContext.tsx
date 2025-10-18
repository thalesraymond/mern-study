import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type AppContextType = {
    isExplore: boolean;
    setIsExplore: (isExplore: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isExplore, setIsExplore] = useState(() => {
        const stored = localStorage.getItem("isExplore");
        return stored ? JSON.parse(stored) : false;
    });

    useEffect(() => {
        localStorage.setItem("isExplore", JSON.stringify(isExplore));
    }, [isExplore]);

    return <AppContext.Provider value={{ isExplore, setIsExplore }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
