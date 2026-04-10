import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7JlffNvMZLi38W5SVOeA6_nEbLsBRqVU",
  authDomain: "hatrix-15679.firebaseapp.com",
  projectId: "hatrix-15679",
  storageBucket: "hatrix-15679.firebasestorage.app",
  messagingSenderId: "568768974431",
  appId: "1:568768974431:web:a667ae3dd02d6129c415ea",
  measurementId: "G-SGRKH5P0NF"
};

// Khởi tạo an toàn (tránh khởi tạo đè nhiều lần gây lỗi)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Database (Firestore)
const db = getFirestore(app);

// Export để dùng ở file App.js
export { db };