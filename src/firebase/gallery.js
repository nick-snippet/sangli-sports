import { db, storage, auth } from "./client";
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const galleryRef = collection(db, "gallery");

export async function addGalleryImage(file, title = "") {
  if (!auth.currentUser) throw new Error("Not authorized");

  const ext = file.type.split("/")[1] || "jpg";
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";

  // Create Firestore doc first
  const docRef = await addDoc(galleryRef, {
    title,
    url: "",
    createdAt: serverTimestamp(),
  });

  // Upload file
  const fileRef = ref(storage, `gallery/${docRef.id}.${safeExt}`);
  await uploadBytes(fileRef, file);

  // Get URL & update doc
  const url = await getDownloadURL(fileRef);
  await updateDoc(doc(db, "gallery", docRef.id), { url });

  return docRef.id;
}

export async function fetchGallery() {
  const snapshot = await getDocs(galleryRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteGallery(id) {
  await deleteDoc(doc(db, "gallery", id));
  const exts = ["png", "jpg", "jpeg", "webp"];
  for (const e of exts) {
    await deleteObject(ref(storage, `gallery/${id}.${e}`)).catch(() => {});
  }
}
