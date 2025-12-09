// src/firebase/players.js

import { db, storage, auth } from "./client.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL
} from "firebase/storage";

const playersRef = collection(db, "players");

// ➕ ADD PLAYER (same as before)
export async function addPlayer({ name, tournament, file }) {
  if (!file) throw new Error("Image required");

  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  const ext = file.type.split("/")[1];
  const safeExt = ["png", "jpg", "jpeg"].includes(ext) ? ext : "jpg";

  // create document
  const docRef = await addDoc(playersRef, {
    name,
    tournament,
    imageUrl: "",
    createdAt: serverTimestamp(),
  });

  // upload image
  const storageRef = ref(storage, `players/${docRef.id}.${safeExt}`);
  await uploadBytes(storageRef, file);

  // get URL
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, "players", docRef.id), { imageUrl: url });

  return docRef.id;
}

// 📌 FETCH PLAYERS
export async function fetchPlayers() {
  const snapshot = await getDocs(playersRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ✏ UPDATE PLAYER TEXT
export async function updatePlayer(id, { name, tournament }) {
  return await updateDoc(doc(db, "players", id), { name, tournament });
}

// 🖼 REPLACE IMAGE
export async function replacePlayerImage(id, file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authorized");

  const ext = file.type.split("/")[1];
  const safeExt = ["png", "jpg", "jpeg"].includes(ext) ? ext : "jpg";

  // delete old if exists (all possible types)
  const types = ["png", "jpg", "jpeg"];
  for (const t of types) {
    await deleteObject(ref(storage, `players/${id}.${t}`)).catch(() => {});
  }

  // upload new file
  const newRef = ref(storage, `players/${id}.${safeExt}`);
  await uploadBytes(newRef, file);

  // get new URL & update Firestore
  const url = await getDownloadURL(newRef);
  return await updateDoc(doc(db, "players", id), { imageUrl: url });
}

// 🗑 DELETE PLAYER (same)
export async function deletePlayer(id) {
  await deleteDoc(doc(db, "players", id));
  const exts = ["png", "jpg", "jpeg"];
  for (const ext of exts) {
    const imgRef = ref(storage, `players/${id}.${ext}`);
    await deleteObject(imgRef).catch(() => {});
  }
}
