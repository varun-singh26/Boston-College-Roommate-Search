import React, { useEffect, useState, useRef } from "react";
import css from "../../styles/purpose.module.css";
import { Link } from "react-router-dom";
import Stairs from "../../images/backdropImages/MillionDollarStairs.jpeg";

const Explanation = () => {
    const [scrollY, setScrollY] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(500);
    const pRefs = useRef([]); // Reference array for all <p> elements
    const [visibleParagraphs, setVisibleParagraphs] = useState([]); // Tracks visible <p> elements

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const handleResize = () => {
            const height = window.innerHeight;

            if (height >= 350 && height <= 600) {
                setScrollOffset(350);
            } else if (height > 600 && height <= 800) {
                setScrollOffset(450);
            } else if (height > 800 && height <= 1000) {
                setScrollOffset(550);
            } else if (height > 1000 && height <= 1500) {
                setScrollOffset(650);
            } else if (height > 1500 && height <= 2000) {
                setScrollOffset(750);
            } else {
                setScrollOffset(850);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.dataset.index, 10);

                    if (entry.isIntersecting) {
                        // Add paragraph to visible list when in view
                        setVisibleParagraphs((prev) =>
                            prev.includes(index) ? prev : [...prev, index]
                        );
                    } else {
                        // Only remove if it's completely out of view
                        if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                            setVisibleParagraphs((prev) => prev.filter((i) => i !== index));
                        }
                    }
                });
            },
            { threshold: 0.7 } // Trigger when 70% of the element is visible
        );

        // Attach the observer to all <p> elements only once
        if (pRefs.current.length > 0) {
            pRefs.current.forEach((p) => observer.observe(p));
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            observer.disconnect(); // Cleanup observer
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div className={css.onCampusBlock}>
                <div
                    className={css.onCampusTextBlock}
                    style={{
                        transform: `translateX(${Math.max(50 - scrollY / 5, 0)}%)`,
                        opacity: Math.min(scrollY / 300, 1),
                    }}
                >
                    <div className={css.textTitle}>
                        <p>On Campus Purpose</p>
                    </div>
                    <div className={css.textBody}>
                    <p className={css.paragraph1}>
                        If you need additional roommates to form your housing group—whether before the housing lottery or after an unexpected lottery outcome—you can <Link to="/postings" className={css.keyword1}>search our database</Link>, where we are confident there waits a match for you.
                    </p>
                    <p className={css.paragraph2}>
                        If no postings meet your criteria, <Link to="/create-posting" className={css.keyword2}>create your own</Link>, and we are confident the right match will find you.
                    </p>

                    </div>
                </div>
                <div className={css.onCampusImageBlock}>
                    <img
                        className={css.onCampusImage}
                        src={Stairs}
                        alt="BC Million Dollar Stairs"
                    />
                </div>
            </div>

            <div className={css.offCampusBlock}>
                <div className={css.offCampusImageBlock}>
                    <img
                        className={css.offCampusImage}
                        src={Stairs}
                        alt="BC Million Dollar Stairs"
                    />
                </div>

                <div
                    className={css.offCampusTextBlock}
                    style={{
                        transform: `translateX(${Math.min(
                            -50 + (scrollY - scrollOffset) / 5,
                            0
                        )}%)`,
                        opacity: Math.min((scrollY - scrollOffset) / 300, 1),
                        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                    }}
                >
                    <div className={css.textTitle}>
                        <p>Off Campus Purpose</p>
                    </div>
                    <div className={css.textBody}>
                    <p className={css.paragraph3}>
                        If you're looking to sublet or are searching for additional roommates for an off-campus property you can <Link to="/postings" className={css.keyword1}>search our database</Link>, where we are confident you'll find a match for you.
                    </p>
                    <p className={css.paragraph4}>
                        If no postings meet your criteria, <Link to="/create-posting" className={css.keyword2}>create your own</Link>, and we are confident the right match will find you.
                    </p>
                    </div>
                </div>
            </div>

            <div className={css.generalPurposeBlock}>
                {[
                    "BCRS was created by 3 BC students for BC students",
                    "We hope to unite BC students with their ideal roommates and housing setups",
                    "Thereby alleviating any stress associated with your housing journey",
                    "Happy searching!"
                ].map((text, index) => (
                    <p
                        key={index}
                        ref={(el) => (pRefs.current[index] = el)}
                        data-index={index}
                        className={
                            visibleParagraphs.includes(index)
                                ? css.visibleParagraph
                                : css.hiddenParagraph
                        }
                    >
                        {text}
                    </p>
                ))}
            </div>
        </>
    );
};

export default Explanation;
