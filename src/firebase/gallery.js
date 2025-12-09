import { db, storage } from "./client";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// 📌 Fetch gallery items
export async function fetchGallery() {
  const snap = await getDocs(collection(db, "gallery"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 📌 Add gallery image + optional title
export async function addGalleryImage(file, title = "") {
  // Upload to storage
  const fileRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const imageUrl = await getDownloadURL(fileRef);

  // Save record
  return addDoc(collection(db, "gallery"), {
    imageUrl,
    title: title || "", // empty string if not given
    createdAt: Date.now()
  });
}

// 📌 Delete gallery image (Firestore + Storage)
export async function deleteGallery(id, imageUrl) {
  await deleteDoc(doc(db, "gallery", id));

  if (imageUrl) {
    const imgRef = ref(storage, imageUrl);
    await deleteObject(imgRef).catch(() => {});
  }
}
