import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firestore';
import Swal from "sweetalert2";


// Function to update posting status in Firestore and UI
const updateStatus = async (newStatus, currentStatus, setCurrentStatus, postID) => {
    if (!postID || newStatus === currentStatus) return; // Prevent redundant updates

    try {
      // Show loading alert
      Swal.fire({
        title: "Updating Status...",
        text: "Please wait while we update your posting status.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Update Firestore document
      const postRef = doc(db, "postings", postID);
      await updateDoc(postRef, { status: newStatus });

      // Update UI
      setCurrentStatus(newStatus);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Status Updated!",
        text: `Your posting status has been updated to "${newStatus}".`,
        confirmButtonColor: "#501315",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating status:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the posting status. Please try again.",
        confirmButtonColor: "#501315",
        confirmButtonText: "OK",
      });
    }
  };

  export default updateStatus;