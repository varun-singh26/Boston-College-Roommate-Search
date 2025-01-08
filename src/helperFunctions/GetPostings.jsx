import { db } from "../config/firestore";
import { collection, getDocs, doc } from "firebase/firestore";

const GetPostings = async () => {
    try {
        const querySnapShot = await getDocs(collection(db, "postings")); //reference to the service and the path of the collection we want to access
        const queriedPostings = querySnapShot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        //return postings from cloud firestore
        return queriedPostings;
    } catch (error) {
        console.error("Error fetching postings:", error);
        return [];
    }   
};

export default GetPostings;