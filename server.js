
// Firebase App နဲ့ Firestore အတွက် လိုအပ်တဲ့ functions တွေကို import လုပ်ပါ
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// သင့်ရဲ့ Firebase Config ကို ဒီမှာ အစားထိုးပါ (အဆင့် ၁ က ရခဲ့တဲ့ code)
const firebaseConfig = {
    apiKey: "AIzaSyBO39cNFvH_I0Iba2rZM66FpVa622XKYkA",
    authDomain: "miyako-receipt.firebaseapp.com",
    projectId: "miyako-receipt",
    storageBucket: "miyako-receipt.firebasestorage.app",
    messagingSenderId: "358232249553",
    appId: "1:358232249553:web:df906a40f4eaf25356a1f0",
    measurementId: "G-PJEPPLTQNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global window object ထဲထည့်ပေးထားမှ တခြား script ဖိုင်တွေက လှမ်းသုံးလို့ရပါမယ်
window.db = db;
window.addDoc = addDoc;
window.collection = collection;
window.getDocs = getDocs;
window.query = query;
window.orderBy = orderBy;
window.serverTimestamp = serverTimestamp;
window.doc = doc;
window.getDoc = getDoc;
