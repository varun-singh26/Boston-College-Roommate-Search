import React from "react";
import css from "../../../styles/WelcomeToPostingsPageStyles/WelcomeToPostingsPage.module.css"

const WelcomeToPostingsPage = () => {
    return (
        <div className={css.container}>
            <header className={css.headerWrapper}>
                <h1 className={css.headerText}>Welcome to the BCRS Listings Page!</h1>
            </header>
            <main className={css.mainWrapper}>
                <h3 className={css.subHeader}>What type of housing are you searching for?</h3>
                <div className={css.buttonContainer}>
                    <button className={css.button}>
                        <span className={css.buttonText}>On Campus</span>
                    </button>
                    <button className={css.button}>
                        <span className={css.buttonText}>Off Campus</span>
                    </button>
                </div>
                <p className={css.infoText}>On BCRS students may filter search our listing page to find housing opportunities that match their needs.</p>
                <p className={css.finalText}>We unite BC Students with their ideal roommates and housing setups.</p>
            </main>
        </div>
    );
};

export default WelcomeToPostingsPage;

/*
const WelcomeToPostingsPage = () => {

    return (
        <div className ="container">
            <div id="welcomeWrapper" className={css.welcomeWrapper}>
                <h1 id = "welcomeText" className={css.welcomeText}>Welcome to the BCRS Listings Page!</h1>
            </div>
            <main id="mainWrapper" className={css.mainWrapper}>
                <h3 id ="subheader" className={`${css.mainItem} ${css.subHeader}`}> What type of housing are you searching for?</h3>
                <div id = "buttonWrapper" className={`${css.mainItem} ${css.buttonWrapper}`}>
                    <button>
                        <p>On Campus</p>
                    </button>
                    <button>
                        <p>Off Campus</p>
                    </button>
                </div>
                <p className={css.mainItem}>On BCRS students may filter search our listing page to find housing opportunities that match their needs.</p>
                <p className={`${css.mainItem} ${css.finalParagraph}`}>We unite BC Students with their ideal roommates and housing set-ups.</p>
            </main>
        </div>
    );
};

export default WelcomeToPostingsPage;*/
