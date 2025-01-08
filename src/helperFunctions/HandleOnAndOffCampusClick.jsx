import { useContext } from "react";
import { ResetTriggerContext } from "../context/resetTriggerContext";
import { SearchContext } from "../context/searchContext";

export const useHandleLocationClick = () => {
  const { setListingLocation } = useContext(SearchContext);
  const { toggleResetTrigger } = useContext(ResetTriggerContext); //the value of the resetTriggerContext is loaded into the following variable (which is initially 1)

  //PRINT STATEMENTS for DEBUGGING
  const context = useContext(SearchContext);
  console.log("SearchContext: ", context);

  const handleOffCampusClick = () => {
    setListingLocation("offcampus");
    toggleResetTrigger(); //change resetTrigger to cause formData context to reset
    console.log(`Listing location set to: offcampus`);
  };

  const handleOnCampusClick = () => {
    setListingLocation("oncampus");
    toggleResetTrigger(); //change resetTrigger to cause formData context to reset
    console.log(`Listing location set to: oncampus`);
  };

  return { handleOnCampusClick, handleOffCampusClick };
};
