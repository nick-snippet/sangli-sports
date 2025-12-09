// src/firebase/coaches.js
import { db, storage, auth } from "./client.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// 🔹 Collection reference
const coachesRef = collection(db, "coaches");

// =======================================================
// 📌 ADD NEW COACH (Admin Only) — FIREBASE SDK ONLY
// =======================================================
export async function addCoach({ name, title, description, file }) {
  if (!file) throw new Error("Image required");

  // Check user
  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  // Detect proper extension
  const ext = file.type.split("/")[1]; // ex => "png"
  const safeExt = ["png", "jpg", "jpeg"].includes(ext) ? ext : "jpg";

  // 1) Create document (Temporary empty imageUrl)
  const docRef = await addDoc(coachesRef, {
    name,
    title,
    description,
    imageUrl: "",
    createdAt: serverTimestamp()
  });

  // 2) Upload image with doc ID
  const storageRef = ref(storage, `coaches/${docRef.id}.${safeExt}`);
  await uploadBytes(storageRef, file);

  // 3) Generate URL
  const url = await getDownloadURL(storageRef);

  // 4) Update Firestore document with image url
  await updateDoc(docRef, { imageUrl: url });

  return docRef.id;
}

// =======================================================
// 📌 FETCH COACHES (Public Read)
// =======================================================
export async function fetchCoaches() {
  const snapshot = await getDocs(coachesRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// =======================================================
// 📌 DELETE COACH (Delete Document + All Extensions)
// =======================================================
// 📌 Delete coach (doc + image)
// 📌 DELETE COACH (doc + possible image files)
export async function deleteCoach(id) {
  console.log("🗑 Deleting coach:", id);

  try {
    // 1) Delete Firestore document
    await deleteDoc(doc(db, "coaches", id));
    console.log("✅ Firestore doc deleted");

    // 2) Try deleting any image extension (png/jpg/jpeg)
    const exts = ["png", "jpg", "jpeg"];
    for (const ext of exts) {
      const imgRef = ref(storage, `coaches/${id}.${ext}`);
      try {
        await deleteObject(imgRef);
        console.log(` Deleted image file: coaches/${id}.${ext}` );
      } catch (err) {
        console.warn( `Could not delete coaches/${id}.${ext} (maybe not exist)`);
      }
    }

    return true;
  } catch (err) {
    console.error("❌ Delete failed:", err);
    throw err;
  }
}
