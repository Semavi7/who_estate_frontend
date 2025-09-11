"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const isMobile = window.screen.width < 768

        const aosOptions = {
            duration: 800,
            once: false,
            offset: isMobile ? 500 : 1000
        }

        AOS.init(aosOptions)
    }, []);

    return <>{children}</>;
}