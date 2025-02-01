import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

// Function to get a reference to a folder
const getFolderRef = (folderName) => ref(storage, folderName);

// Function to get a reference to a specific file
const getFileRef = (folderName, fileName) => ref(storage, `${folderName}/${fileName}`);

export { getFolderRef, getFileRef };
