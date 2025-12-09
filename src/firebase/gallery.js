// src/firebase/gallery.js

import { db, storage, auth } from "./client.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const galleryRef = collection(db, "gallery");

/** ➕ ADD GALLERY IMAGE  (url + title + timestamp) */
export async function addGalleryImage(file, title = "") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  // upload image
  const ext = file.type.split("/")[1] || "jpg";
  const fileRef = ref(storage, `gallery/${Date.now()}.${ext}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  // save firestore doc
  await addDoc(galleryRef, {
    url,
    title,
    createdAt: serverTimestamp(),
  });
}

/** 🔍 FETCH GALLERY IMAGES (latest first) */
export async function fetchGallery() {
  const snap = await getDocs(galleryRef);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/** 🗑 DELETE IMAGE */
export async function deleteGallery(id, url) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  await deleteDoc(doc(db, "gallery", id));
  await deleteObject(ref(storage, url.replace(/.*\/o\//, "").split("?")[0]));
}
