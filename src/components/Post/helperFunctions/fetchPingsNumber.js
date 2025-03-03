import { db} from "../../../config/firestore";
import {collection, query, where, getDocs } from "firebase/firestore";


const fetchPingsNumber = async (postID) => {
    try {
      if (!postID) {
        throw new Error("Invalid postID");
      }
  
      const pingsCollection = collection(db, "pings");
      const pingsQuery = query(pingsCollection, where("postID", "==", postID)); // Get all pings for this post
      const querySnapshot = await getDocs(pingsQuery);
  
      return querySnapshot.size; // Return the number of docs (pings) that match the query
    } catch (error) {
      console.error("Error fetching pings:", error);
      return 0; // Return 0 in case of failure
    }
  };


export default fetchPingsNumber;