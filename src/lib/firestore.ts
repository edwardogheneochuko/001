import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

// Kept separate from firebase.ts so pages that only need auth do not bundle Firestore
export const db = getFirestore(app);
