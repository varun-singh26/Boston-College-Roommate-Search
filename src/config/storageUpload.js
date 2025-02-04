import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import auth to check user

const storage = getStorage();
const auth = getAuth(); // Get the authentication instance

// Function to create a file reference
function createFileRef(name, folder = "images") {
    return ref(storage, `${folder}/${name}`); // Allows folder customization
}


// CHAT GPT suggestion
const uploadFiles = async (files, postingId) => {
    const imageUrls = [];
    for (let i = 0; i < files.length; i++) {
        const fileRef = ref(storage, `images/posting_${postingId}/${Date.now()}_${files[i].name}`); //Get reference to or create a folder for specific posting in images/ folder
        await uploadBytes(fileRef, files[i]);
        const fileUrl = await getDownloadURL(fileRef); // Get download URL for the file
        imageUrls.push(fileUrl);
    }
    return imageUrls; // Return the list of image URLs to save in Firestore
} 

export { createFileRef, uploadFiles };
