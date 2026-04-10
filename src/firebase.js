import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Thêm dòng này

const firebaseConfig = {
  apiKey: "MÃ_CỦA_ÔNG",
  authDomain: "hatrix-app.firebaseapp.com",
  projectId: "hatrix-app",
  storageBucket: "hatrix-app.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Database (Firestore)
const db = getFirestore(app);

// Export để dùng ở file App.js
export { db };