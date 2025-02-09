import { db, storage } from "../../config/firestore";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { doc, deleteDoc, updateDoc, collection, getDocs, arrayRemove, writeBatch } from "firebase/firestore";

/** 
 * Deletes a posting from Firestore and its associated images from Firebase Storage
 * Also removes the posting ID from the admin's administeredPostings and all users' bookmarkedPostings.
 * @param {string} postingId - The ID of the posting to delete.
 * @param {string} adminUid - The UID of the admin who created the posting.
 */

const deletePostingAndImages = async (postingId, adminUid) => {
    if (!postingId || !adminUid) {
        throw new Error("Posting ID and Admin UID are required to delete a post.")
    }

    const folderRef = ref(storage, `images/posting_${postingId}/`);
    const usersRef = collection(db, "users");
    
    try {
        console.log(`Attempting to delete post with ID: ${postingId}`);

        // 🔹 1. Remove the posting from the "postings" collection
        await deleteDoc(doc(db, "postings", postingId));
        console.log(`✅ Successfully deleted post document: ${postingId}`);

        // 🔹 2. Remove the post from the admin's administeredPostings
        await updateDoc(doc(db, "users", adminUid), {
            administeredPostings: arrayRemove(postingId),
        });
        console.log(`✅ Removed post ID ${postingId} from admin (${adminUid})'s administeredPostings.`);

        // 🔹 3. Remove the post from all users' bookmarkedPostings (if bookmarked)
        const usersSnapShot = await getDocs(usersRef);
        const batch = writeBatch(db); // Use Firestore batch updates for efficiency

        usersSnapShot.forEach((userDoc) => {
            const userData = userDoc.data();
            if (userData.bookmarkedPostings?.includes(postingId)) {
                const userRef = doc(db, "users", userDoc.id);
                batch.update(userRef, {
                    bookmarkedPostings: arrayRemove(postingId),
                });
                console.log(`📌 Queued removal of post ${postingId} from user ${userDoc.id}'s bookmarkedPostings.`);
            }
        });

        await batch.commit(); // Commit batch updates
        console.log(`✅ Successfully removed post ${postingId} from all affected users' bookmarkedPostings.`);

        // 🔹 4. Delete all images in the corresponding Firebase Storage folder
        try {
            const files = await listAll(folderRef);
            const deleteFilePromises = files.items.map((file) => deleteObject(file));
            await Promise.all(deleteFilePromises);
            console.log(`✅ Deleted all images for post ${postingId} from Firebase Storage.`);
        } catch (imageDeleteError) {
            console.error(`❌ Error deleting images for post ${postingId}:`, imageDeleteError);
        }
    } catch (error) {
        console.error(`❌ Error deleting post ${postingId}:`, error);
        throw new Error("Failed to delete posting and associated data.");
    }
};

export { deletePostingAndImages };