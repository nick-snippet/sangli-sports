// src/firebase/gallery.js
import { db, storage, auth } from "./client.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const galleryRef = collection(db, "gallery");

// ➕ ADD IMAGE
export async function addGalleryImage(file, title = "") {
  if (!file) throw new Error("Image required");
  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  const ext = file.type.split("/")[1];
  const safeExt = ["png", "jpg", "jpeg"].includes(ext) ? ext : "jpg";

  // 1) Create empty doc
  const docRef = await addDoc(galleryRef, {
    title,
    url: "",
    createdAt: serverTimestamp(),
  });

  // 2) Upload file
  const storageRef = ref(storage, `gallery/${docRef.id}.${safeExt}`);
  await uploadBytes(storageRef, file);

  // 3) Get url and update Firestore
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "gallery", docRef.id), { url });

  return docRef.id;
}

// 📌 FETCH GALLERY IMAGES
export async function fetchGallery() {
  const snapshot = await getDocs(galleryRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 🗑 DELETE GALLERY IMAGE
export async function deleteGallery(id) {
  await deleteDoc(doc(db, "gallery", id));

  const types = ["png", "jpg", "jpeg"];
  for (const t of types) {
    await deleteObject(ref(storage, `gallery/${id}.${t}`)).catch(() => {});
  }
}
