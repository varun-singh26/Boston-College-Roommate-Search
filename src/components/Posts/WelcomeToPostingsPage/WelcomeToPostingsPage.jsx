import React, { useContext, useState } from "react";
import AllPosts from "../AllPosts.jsx";
import { PostingsContext } from '../../../context/PostingsContext.jsx';
import { SearchContext } from "../../../context/searchContext";
import { SearchBar } from "../../Homepage/SearchBar";
import OnCampusSearchForm from "../../Homepage/onCampusSearchForm";
import OffCampusSearchForm from "../../Homepage/offCampusSearchForm";
import OnCampusPost from "../../Post/OnCampusPost.jsx";
import OffCampusPost from "../../Post/OffCampusPost.jsx";
import { useNavigate } from "react-router-dom";
import css from "../../../styles/WelcomeToPostingsPageStyles/WelcomeToPostingsPage.module.css";

const WelcomeToPostingsPage = () => {

    // When SearchBar renders, the values of the SearchContext are loaded into the following variables
    const { formData, setFormData, listingLocation, setListingLocation } = useContext(SearchContext);

    const context = useContext(SearchContext);
    console.log("context: ", context);

    const handleOnCampusClick = (e) => {
        setListingLocation("oncampus");
        console.log(`Setting listingLocation with new value: oncampus`);
    };

    const handleOffCampusClick = (e) => {
        setListingLocation("offcampus");
        console.log(`Setting listingLocation with new value: offcampus`);
    };

    return (
        <div className={css.container}>
            <header className={css.headerWrapper}>
                <h1 className={css.headerText}>Welcome to the BCRS Postings Page!</h1>
            </header>
            <main className={css.mainWrapper}>
                <AllPosts></AllPosts>
                <h3 className={css.subHeader}>What type of housing are you searching for?</h3>
                <div className={css.buttonContainer}>
                    <button onClick={handleOnCampusClick} className={css.button}>
                        <span className={css.buttonText}>On Campus</span>
                    </button>
                    <button onClick={handleOffCampusClick} className={css.button}>
                        <span className={css.buttonText}>Off Campus</span>
                    </button>
                </div>
                {listingLocation === "oncampus" && <OnCampusSearchForm />}
                {listingLocation === "offcampus" && <OffCampusSearchForm />}
                <p className={css.infoText}>On BCRS students may filter search our listing page to find housing opportunities that match their needs.</p>
                <p className={css.finalText}>We unite BC Students with their ideal roommates and housing setups.</p>
            </main>
        </div>
    );
};

export default WelcomeToPostingsPage;


