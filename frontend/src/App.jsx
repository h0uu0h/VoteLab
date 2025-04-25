/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from "react";
import Treemap from "./components/Treemap";
import BarChart from "./components/BarChart";
import FormPage from "./components/FormPage";
import SearchModal from "./components/SearchModal";
import "./App.css";

const App = () => {
    const sections = [0, 1, 2];
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const isScrolling = useRef(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchInitialTerm, setSearchInitialTerm] = useState("");

    const scrollToSection = useCallback((index) => {
        const container = containerRef.current;
        const section = sectionRefs.current[index];
        if (container && section) {
            isScrolling.current = true;

            const onScrollEnd = () => {
                // 到达目标位置
                const reached =
                    Math.abs(container.scrollTop - section.offsetTop) < 5;
                if (reached) {
                    isScrolling.current = false;
                    container.removeEventListener("scroll", onScrollEnd);
                }
            };

            container.addEventListener("scroll", onScrollEnd);
            container.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        }
    }, []);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const containerCenter = containerScrollTop + containerHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        sectionRefs.current.forEach((section, index) => {
            if (!section) return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + sectionHeight / 2;

            // 计算当前 section 占屏高度百分比
            const vhRatio = sectionHeight / containerHeight;

            // 比例越小，给更小的距离权重（0.5 ~ 1）
            const weight = Math.min(1, Math.max(0.5, vhRatio));

            const distance = Math.abs(containerCenter - sectionCenter) * weight;

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        setActiveIndex(closestIndex);
    }, []);

    // 🚫 禁用全局 wheel 滚动（让容器滚）
    const handleWheel = useCallback(
        (e) => {
            if (isScrolling.current) return;
            if (e.deltaY > 0 && activeIndex < sections.length - 1) {
                scrollToSection(activeIndex + 1);
            } else if (e.deltaY < 0 && activeIndex > 0) {
                scrollToSection(activeIndex - 1);
            }
        },
        [activeIndex, scrollToSection]
    );

    const handleTouchStart = useRef(0);

    const handleTouchStartEvent = (e) => {
        handleTouchStart.current = e.touches[0].clientY;
    };

    const handleTouchEndEvent = (e) => {
        const deltaY = handleTouchStart.current - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && activeIndex < sections.length - 1) {
                scrollToSection(activeIndex + 1);
            } else if (deltaY < 0 && activeIndex > 0) {
                scrollToSection(activeIndex - 1);
            }
        }
    };

    useEffect(() => {
        scrollToSection(1);
    }, [scrollToSection]);

    useEffect(() => {
        document.body.classList.toggle("modal-open", showSearchModal);
    }, [showSearchModal]);

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStartEvent, {
            passive: false,
        });
        container.addEventListener("touchend", handleTouchEndEvent, {
            passive: false,
        });

        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStartEvent);
            container.removeEventListener("touchend", handleTouchEndEvent);
        };
    }, [handleScroll, handleWheel]);

    return (
        <div className="app-container">
            {showSearchModal && (
                <SearchModal
                    initialTerm={searchInitialTerm}
                    onClose={() => setShowSearchModal(false)}
                />
            )}
            <div className="sections-container" ref={containerRef}>
                {sections.map((_, index) => (
                    <section
                        key={index}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        className={`fullpage-section ${
                            index === 2 ? "scrollable-inner-section" : ""
                        }`}
                        style={{
                            height:
                                index === 0
                                    ? "20vh"
                                    : index === 2
                                    ? "auto"
                                    : "100vh",
                            overflowY: index === 2 ? "auto" : "hidden",
                        }}>
                        {index === 0 && (
                            <FormPage
                                onSearchFocus={() => {
                                    setSearchInitialTerm(""); // 如果你之后想预填内容，可以传入值
                                    setShowSearchModal(true);
                                }}
                            />
                        )}
                        {index === 1 && <Treemap />}
                        {index === 2 && (
                            <div className="scrollable-inner">
                                <BarChart />
                            </div>
                        )}
                    </section>
                ))}
            </div>

            <div className="navigation-dots">
                {sections.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${
                            index === activeIndex ? "active" : ""
                        }`}
                        onClick={() => scrollToSection(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
