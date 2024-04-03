import { useState, useRef } from "react";

const useScrollCarousel = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);

    // Function to handle scroll event
    const handleScroll = () => {
        const { scrollLeft, offsetWidth, scrollWidth } = containerRef.current;
        const maxScroll = scrollWidth - offsetWidth;
        const position =
            scrollLeft === maxScroll ? "end" : scrollLeft > 0 ? "middle" : "start";
        setScrollPosition(position);
    };

    // Function to scroll to the next item
    const scrollToNext = () => {
        const container = containerRef.current;
        if (container) {
            const nextScrollLeft = container.scrollLeft + container.offsetWidth;
            container.scrollTo({
                left: nextScrollLeft,
                behavior: "smooth",
            });
        }
    };

    // Function to scroll to the previous item
    const scrollToPrevious = () => {
        const container = containerRef.current;
        if (container) {
            const nextScrollLeft = container.scrollLeft - container.offsetWidth;
            container.scrollTo({
                left: nextScrollLeft,
                behavior: "smooth",
            });
        }
    };

    return {
        containerRef,
        handleScroll,
        scrollPosition,
        scrollToNext,
        scrollToPrevious,
    };
};

export default useScrollCarousel;
