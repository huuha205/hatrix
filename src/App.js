/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp,getApp, getApps } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, onSnapshot, query, orderBy,deleteDoc, doc,updateDoc,where } from "firebase/firestore";

// --- TỰ ĐỊNH NGHĨA ICON (Hà giữ nguyên phần này) ---
const createIcon = (paths) => {
  return function Icon({ size = 24, className = "", strokeWidth = 2, fill = "none", stroke = "currentColor", ...props }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {paths}
      </svg>
    );
  }
};

// Lấy auth và các service khác trực tiếp từ app đã khởi tạo bên firebase.js
const auth = getAuth(getApp());
const googleProvider = new GoogleAuthProvider();
const analytics = typeof window !== "undefined" ? getAnalytics(getApp()) : null;

// Ép lưu phiên đăng nhập (như Hà đã làm)
setPersistence(auth, browserLocalPersistence).catch(console.error);
googleProvider.setCustomParameters({ prompt: 'select_account' });


// --- KHỞI TẠO FIREBASE DUY NHẤT 1 LẦN ---


// --- ĐỊNH NGHĨA CÁC ICON (Hà copy cụm này để thay cho lucide) ---
const Play = createIcon(<polygon points="5 3 19 12 5 21 5 3" />);
const Volume2 = createIcon(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>);
const Check = createIcon(<polyline points="20 6 9 17 4 12" />);
const X = createIcon(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
const Trophy = createIcon(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>);
const Flame = createIcon(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />);
const BookOpen = createIcon(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>);
const Clock = createIcon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>);
const Activity = createIcon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />);
const BarChart2 = createIcon(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>);
const Plus = createIcon(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);
const ArrowRight = createIcon(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
const RotateCcw = createIcon(<><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>);
const Home = createIcon(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>);
const LayoutGrid = createIcon(<><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></>);
const Book = createIcon(<><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></>);
const PlayCircle = createIcon(<><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></>);
const Medal = createIcon(<><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12l5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><polyline points="12 18 10.5 16.5 12.5 16 13.5 17.5 12 18"/></>);
const Search = createIcon(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>);
const Filter = createIcon(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />);
const List = createIcon(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>);
const CheckSquare = createIcon(<><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>);
const Grid = createIcon(<><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></>);
const Type = createIcon(<><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></>);
const Headphones = createIcon(<><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>);
const Zap = createIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />);
const Settings = createIcon(<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>);
const Sun = createIcon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>);
const Moon = createIcon(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
const Share2 = createIcon(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>);
const Download = createIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>);
const Pencil = createIcon(<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></>);
const Trash2 = createIcon(<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>);
const Save = createIcon(<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>);
const Minus = createIcon(<line x1="5" y1="12" x2="19" y2="12" />);
const ChevronDown = createIcon(<polyline points="6 9 12 15 18 9" />);
const Layers = createIcon(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></>);
const FileUp = createIcon(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M12 18v-6" /><path d="m9 15 3-3 3 3" /></>);
const HelpCircle = createIcon(<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>);
const RotateCw = createIcon(<><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><polyline points="21 3 21 8 16 8" /></>);
const ChevronLeft = createIcon(<polyline points="15 18 9 12 15 6" />);
const ChevronRight = createIcon(<polyline points="9 18 15 12 9 6" />);
const Pause = createIcon(<><rect width="4" height="16" x="6" y="4" /><rect width="4" height="16" x="14" y="4" /></>);
const Heart = createIcon(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
const Calendar = createIcon(<><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>);
const PieChart = createIcon(<><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>);
const LogOut = createIcon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>);
const Loader2 = createIcon(<path d="M21 12a9 9 0 1 1-6.219-8.56" />);

// ... Phía dưới là INITIAL_VOCAB của Hà (giữ nguyên)




// --- 1. DỮ LIỆU KHỞI TẠO & CẤU HÌNH ---
const LEVEL_INTERVALS = {
  1: 10 * 60 * 1000,
  2: 24 * 60 * 60 * 1000,
  3: 3 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000,
  5: 30 * 24 * 60 * 60 * 1000
};

const PRACTICE_WORDS_COUNT = 5;

const INITIAL_VOCAB = [];

const INITIAL_SETS = [];

const CATEGORIES = ['Tất cả'];

const INITIAL_LIBRARIES = [];

// --- 2. HÀM TIỆN ÍCH ---

function EditWordModal({ word, onClose, onSave, isDarkMode }) {
  // Lấy dữ liệu của từ hiện tại đổ vào form
  const [formData, setFormData] = useState({ 
    id: word.id,
    word: word.word || '', 
    phonetic: word.phonetic || '', 
    meaning: word.meaning || '', 
    type: word.type || '', 
    example: word.example || '', 
    note: word.note || '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) return; // Bắt buộc nhập Từ và Nghĩa
    onSave(formData);
    onClose();
  };

  const inputClass = `w-full ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white focus:border-[#00a8ff]' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'} border rounded-xl px-4 py-3 outline-none transition-all text-sm`;
  const labelClass = `block text-xs sm:text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[700] p-4 backdrop-blur-sm text-left">
      <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-200'} p-6 sm:p-8 rounded-[24px] w-full max-w-[500px] border shadow-2xl relative flex flex-col animate-in zoom-in-95`}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chỉnh sửa từ vựng</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Từ vựng <span className="text-red-500">*</span></label>
            <input autoFocus name="word" value={formData.word} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Nghĩa <span className="text-red-500">*</span></label>
            <input name="meaning" value={formData.meaning} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phiên âm</label>
              <input name="phonetic" value={formData.phonetic} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Loại từ</label>
              <input name="type" value={formData.type} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Ví dụ</label>
            <textarea name="example" value={formData.example} onChange={handleChange} className={`${inputClass} resize-none h-20 custom-scrollbar`} />
          </div>

          <div>
            <label className={labelClass}>Ghi chú mở rộng</label>
            <textarea name="note" value={formData.note} onChange={handleChange} className={`${inputClass} resize-none h-20 custom-scrollbar`} />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className={`font-bold px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Hủy</button>
            <button type="submit" disabled={!formData.word.trim() || !formData.meaning.trim()} className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm">Cập nhật</button>
          </div>
        </form>

      </div>
    </div>
  );
}

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function playAudio(text) {
  if (typeof text !== 'string' || !text.trim()) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}

function playFeedbackSound(isCorrect) {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
   if (isCorrect) {
      // Tiếng "Ting" cao và trong (giống Duolingo)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, context.currentTime); // Nốt C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, context.currentTime + 0.1); // Lên C6
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
    } else {
      // Tiếng "Buzz" trầm và ngắn (giống Gameshow)
      oscillator.type = 'triangle'; 
      oscillator.frequency.setValueAtTime(150, context.currentTime);
      oscillator.frequency.linearRampToValueAtTime(50, context.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    }
    
    oscillator.start(); 
    oscillator.stop(context.currentTime + 0.3);
  } catch (e) {}
}

function getDueWords(vocab) {
  const now = Date.now();
  return vocab.filter(w => (w.nextReview || 0) <= now).sort((a, b) => (a.level || 1) - (b.level || 1));
}

function formatTimeLeft(nextReview) {
  const now = Date.now();
  if (!nextReview || nextReview === 0) return "Chưa học";
  if (nextReview <= now) return "Đến hạn ôn";
  
  const diff = nextReview - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${mins} phút`;
  return `${mins} phút`;
}

function formatHistoryDate(timestamp) {
  const d = new Date(timestamp);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} • ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

const GAME_INFO = {
  'srs': { name: 'Ôn tập ngắt quãng', icon: List, color: 'bg-pink-100 text-pink-500' },
  'typing': { name: 'Gõ từ vựng', icon: Type, color: 'bg-green-100 text-green-500' },
  'matching': { name: 'Nối từ với nghĩa', icon: Grid, color: 'bg-blue-100 text-blue-500' },
  'quiz': { name: 'Trắc nghiệm', icon: CheckSquare, color: 'bg-orange-100 text-orange-500' },
  'listening': { name: 'Nghe viết', icon: Headphones, color: 'bg-cyan-100 text-cyan-500' },
  'mixed': { name: 'Tổng hợp', icon: Zap, color: 'bg-purple-100 text-purple-500' },
  'flashcard': { name: 'Flashcard', icon: Layers, color: 'bg-indigo-100 text-indigo-500' }
};

// --- 3. CÁC COMPONENT GIAO DIỆN TĨNH ---

function TopBar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, streak, onLogout, user }) {
  return (
    <div className={`w-full px-8 py-4 flex items-center justify-between z-10 relative border-b ${isDarkMode ? 'border-white/5 bg-[#1e1f29]' : 'border-gray-200 bg-white'} transition-colors duration-300`}>
      
      {/* Cụm Logo & Điều hướng */}
      <div className="flex items-center gap-10">
        <div onClick={() => setActiveTab('home')} className="cursor-pointer flex items-center group hover:scale-105 transition-transform active:scale-95" title="HaTrix">
          <h1 className={`text-3xl font-black tracking-tighter uppercase transition-colors duration-300 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 group-hover:from-indigo-400 group-hover:to-purple-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 group-hover:from-purple-600 group-hover:to-indigo-700'}`}>
            HaTrix
          </h1>
          <div className="w-2.5 h-2.5 rounded-full bg-[#64bc04] shadow-[0_0_10px_#64bc04] animate-pulse ml-1 mb-4"></div>
        </div>

        <nav className="flex items-center gap-2 bg-transparent">
          {[
            { id: 'home', i: Home, l: 'Trang chủ' },
            { id: 'sets', i: LayoutGrid, l: 'Bộ từ vựng' },
            { id: 'vocab', i: Book, l: 'Từ vựng' },
            { id: 'games', i: PlayCircle, l: 'Luyện tập' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-300 font-black uppercase text-xs tracking-widest ${activeTab === item.id ? (isDarkMode ? 'bg-indigo-500/10 text-indigo-400 shadow-inner' : 'bg-indigo-50 text-indigo-600 shadow-sm') : (isDarkMode ? 'text-gray-500 hover:bg-[#252733] hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700')}`}
            >
              <item.i size={18} />
              <span className="opacity-90">{item.l}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Cụm Công cụ: Chế độ sáng tối, Chuỗi ngày, Tài khoản */}
      <div className="flex items-center gap-4">
        
        {/* Nút Chế độ sáng/tối */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
          title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Chuỗi ngày học */}
        <div className={`${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-100 border-orange-200 text-orange-600'} border px-5 py-3 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm`}>
          <Flame size={16} className="fill-orange-500 animate-bounce" /> {streak}
        </div>

        {/* Nút Tài khoản & Avatar */}
        <div className="relative group">
          <div className="cursor-pointer hover:scale-105 transition-transform">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-green-400 to-blue-500 p-[2px] shadow-md">
              <div className={`w-full h-full ${isDarkMode ? 'bg-[#1e1f29]' : 'bg-white'} rounded-[10px] flex items-center justify-center border-2 ${isDarkMode ? 'border-[#1e1f29]' : 'border-white'} overflow-hidden`}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-2.5 h-2.5 bg-[#64bc04] rounded-full shadow-[0_0_12px_#64bc04] animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Tooltip & Nút Đăng xuất */}
          <div className="absolute right-0 top-11 pt-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
            <div className={`px-3 py-2 rounded-xl text-xs font-black flex flex-col gap-2 ${isDarkMode ? 'bg-[#252733] text-white border border-white/10 shadow-2xl' : 'bg-white text-gray-800 border border-gray-100 shadow-xl'}`}>
              <div className="whitespace-nowrap px-2 py-1 text-center">
                <div className="text-sm">{user?.displayName || 'Người dùng'}</div>
                <div className="text-[10px] font-medium text-gray-400 mt-0.5">{user?.email || 'Đang đồng bộ...'}</div>
              </div>
              <div className={`w-full h-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}></div>
              <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-2 py-1.5 rounded-lg transition-colors w-full text-left whitespace-nowrap cursor-pointer">
                <LogOut size={14} /> Đăng xuất
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

  

// --- 4. CÁC TAB CHỨC NĂNG ---

function HomeTab({ vocab, onNavigate, isDarkMode, streak, onSimulateNextDay }) {
  const dueCount = useMemo(() => getDueWords(vocab).length, [vocab]);
  const masteredCount = useMemo(() => vocab.filter(w => w.level === 5).length, [vocab]);

  const last7Days = useMemo(() => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const result = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      result.push({
        date: d.getDate(),
        dayName: days[d.getDay()],
        isToday: i === 0
      });
    }
    return result;
  }, []);

  const stats = [
    { l: 'Tổng từ', v: vocab.length, c: isDarkMode ? 'text-green-500' : 'text-green-600' },
    { l: 'Đã thuộc', v: masteredCount, c: isDarkMode ? 'text-orange-400' : 'text-orange-600' },
    { l: 'Tiến độ', v: vocab.length > 0 ? `${Math.round((masteredCount / vocab.length) * 100)}%` : '0%', c: isDarkMode ? 'text-blue-400' : 'text-blue-600' },
    { l: 'Cần ôn', v: dueCount, c: isDarkMode ? 'text-purple-400' : 'text-purple-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 space-y-8 animate-in fade-in duration-700 px-4">
      {/* Ô 1: Ảnh (Banner) */}
      <div className={`w-full h-[200px] sm:h-[280px] rounded-[40px] overflow-hidden ${isDarkMode ? 'bg-[#252733] border-[#2a2c38]' : 'bg-white border-gray-200'} border shadow-lg relative group transition-colors`}>
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Cartoon Banner" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"/>
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#13151b]' : 'from-gray-200'} via-transparent to-transparent opacity-60`}></div>
      </div>
      
      {/* Ô 2: Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {stats.map((s, i) => (
          <div key={i} className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-100 shadow-sm'} rounded-[32px] flex flex-col items-center justify-center p-6 border hover:border-indigo-400 transition-all text-center`}>
            <div className={`text-4xl sm:text-5xl font-black ${s.c} tracking-tighter`}>{s.v}</div>
            <div className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-widest mt-2">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Ô 3: Chuỗi ngày */}
      <div className="w-full bg-gradient-to-br from-orange-500 to-orange-400 rounded-[40px] p-8 sm:p-10 text-white flex flex-col md:flex-row justify-between md:items-center shadow-2xl relative overflow-hidden group gap-8">
        <Flame size={160} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-20 flex-1">
          <div className="flex items-center gap-2 font-black uppercase text-xs mb-2 text-orange-100 tracking-widest">
            <Flame size={16} className="fill-current"/> Chuỗi ngày học
            {/* NÚT GIẢ LẬP ĐỂ TEST */}
            <button onClick={onSimulateNextDay} className="ml-4 bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-lg text-[10px] transition-colors border border-white/30 cursor-pointer shadow-sm active:scale-95">Giả lập qua ngày</button>
          </div>
          <div className="text-6xl sm:text-7xl font-black flex items-baseline gap-3 tracking-tighter">{streak} <span className="text-lg sm:text-xl font-bold text-orange-100/80">ngày</span></div>
        </div>
        <div className="flex justify-between md:justify-end items-end gap-2 sm:gap-4 relative z-20 w-full md:w-auto">
          {last7Days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-[10px] sm:text-xs font-black text-orange-100/90 uppercase text-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${d.isToday ? 'bg-white text-orange-500 shadow-xl scale-110 font-black' : 'bg-orange-600/30'}`}>
                {d.isToday ? <Flame size={18} className="fill-current"/> : d.date}
              </div>
              <span>{d.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 pb-12">
        <h2 className={`text-center text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-10 tracking-widest uppercase opacity-60`}>Truy cập nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            { id: 'vocab', icon: Plus, title: 'Thêm từ', desc: 'Tạo từ vựng cá nhân', color: isDarkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-100' },
            { id: 'games', icon: Zap, title: 'Luyện tập', desc: 'Flashcard & Games', color: isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100' }
          ].map((btn, i) => (
            <div key={i} onClick={() => onNavigate(btn.id)} className={`${isDarkMode ? 'bg-[#1e1f29] border-white/5 shadow-lg' : 'bg-white border-gray-100 shadow-md'} border rounded-[32px] p-6 flex items-center justify-between cursor-pointer hover:scale-[1.05] transition-all group`}>
               <div className="flex items-center gap-5">
                 <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${btn.color} shadow-inner`}>
                   <btn.icon size={28} />
                 </div>
                 <div>
                   <div className={`font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg group-hover:text-indigo-400 transition-colors`}>{btn.title}</div>
                   <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 opacity-70">{btn.desc}</div>
                 </div>
               </div>
               <ArrowRight size={20} className={`${isDarkMode ? 'text-gray-700 group-hover:text-white' : 'text-gray-300 group-hover:text-indigo-600'} transition-colors`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT: CÔNG CỤ NHẬP SÁCH NHANH ---
function CreateLibraryModal({ onClose, onSave, isDarkMode }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sách IELTS');
  const [difficulty, setDifficulty] = useState(3);
  const [rawText, setRawText] = useState('');

  const parsedData = useMemo(() => {
    const lines = rawText.split('\n');
    const result = [];
    let currentChap = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('#') || /^unit\b/i.test(trimmed) || /^bài\b/i.test(trimmed) || /^chapter\b/i.test(trimmed)) {
        let chapTitle = trimmed;
        if (chapTitle.startsWith('#')) chapTitle = chapTitle.substring(1).trim();
        
        currentChap = { 
          id: `chap-${Date.now()}-${Math.random()}`, 
          title: chapTitle, 
          words: [] 
        };
        result.push(currentChap);
      } 
      else if (trimmed.includes('|')) {
        if (!currentChap) {
          currentChap = { id: `chap-${Date.now()}-default`, title: 'Unit 1', words: [] };
          result.push(currentChap);
        }
        const parts = trimmed.split('|').map(p => p.trim());
        currentChap.words.push({
          id: Math.random().toString(36).substr(2, 9),
          word: parts[0] || '',
          phonetic: parts[1] || '',
          type: parts[2] || '',
          meaning: parts[3] || '',
          example: parts[4] || '',
          note: parts[5] || '',
          isMastered: false
        });
      }
    });
    return result.filter(c => c.words.length > 0 || c.title !== 'Unit 1');
  }, [rawText]);

  const handleSave = () => {
    if (!title.trim() || parsedData.length === 0) return;
    const newLib = {
      id: `lib-${Date.now()}`,
      title: title.trim(),
      category,
      difficulty: Number(difficulty),
      chapters: parsedData
    };
    onSave(newLib);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500] p-4 backdrop-blur-sm text-left">
      <div className={`${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200'} w-full max-w-[1000px] h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#64bc04] rounded-xl flex items-center justify-center text-white shadow-lg">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Nhập Lộ Trình Sách Mới</h2>
              <p className="text-gray-400 text-xs font-bold mt-0.5 tracking-widest uppercase">Công cụ phân tách tự động (Auto Split)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500/10"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-gray-50 border-gray-200'} p-6 rounded-2xl border space-y-5`}>
            <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>1. Thông tin Sách</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tên sách / Lộ trình <span className="text-red-500">*</span></label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Vocabulary In Use Elementary..." className={`w-full ${isDarkMode ? 'bg-[#13151b] border-[#3e414d] text-white focus:border-[#64bc04]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#64bc04]'} border-2 rounded-xl px-4 py-3 font-bold outline-none transition-colors`} />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Danh mục</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full ${isDarkMode ? 'bg-[#13151b] border-[#3e414d] text-white' : 'bg-white border-gray-300 text-gray-900'} border-2 rounded-xl px-4 py-3 font-bold outline-none cursor-pointer`}>
                  {CATEGORIES.filter(c => c !== 'Tất cả').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Độ khó (1-5)</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`w-full ${isDarkMode ? 'bg-[#13151b] border-[#3e414d] text-white' : 'bg-white border-gray-300 text-gray-900'} border-2 rounded-xl px-4 py-3 font-bold outline-none cursor-pointer`}>
                  {[1,2,3,4,5].map(d => <option key={d} value={d}>Mức độ {d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>2. Nhập dữ liệu hàng loạt (Tự động chia Unit)</h3>
            </div>
            
            <div className={`${isDarkMode ? 'bg-[#252733] border-[#3e414d]' : 'bg-white border-gray-200'} p-5 rounded-2xl border shadow-sm relative flex flex-col md:flex-row gap-6`}>
              <div className="flex-1 space-y-4">
                <div className={`text-[12px] font-mono p-4 rounded-xl ${isDarkMode ? 'bg-[#13151b] text-gray-400 border border-white/5' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                  <p className="mb-2 opacity-80 text-[11px] uppercase tracking-widest font-black">Cú pháp phân chia Unit:</p>
                  <span className="text-blue-400 font-bold"># Unit 1: The family</span><br/>
                  family | /ˈfæm.əl.i/ | n | gia đình | I love my family<br/>
                  parent | /ˈpær.ənt/ | n | cha mẹ | My parents are kind<br/>
                  <br/>
                  <span className="text-blue-400 font-bold">Unit 2: Birth, marriage and death</span><br/>
                  birth | /bɜːθ/ | n | sự ra đời | The birth of a child<br/>
                  <br/>
                  <span className="text-orange-400 opacity-80 italic text-[10px]">* Mẹo: Hệ thống tự nhận diện các dòng có chữ "Unit", "Bài", "Chapter" hoặc dấu "#" ở đầu để tạo Unit mới. Các dòng có dấu "|" là từ vựng.</span>
                </div>
                <textarea 
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder={`Dán toàn bộ lộ trình sách của bạn vào đây...\nVí dụ:\n\n# Unit 1: The family\nfamily | /ˈfæm.əl.i/ | n | gia đình | I love my family\n\n# Unit 2: Parts of the body\nhead | /hed/ | n | cái đầu | Nod your head`}
                  className={`w-full h-[300px] ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-gray-300 placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800'} border rounded-xl p-5 outline-none focus:border-[#64bc04] transition-all font-mono text-[13px] resize-none custom-scrollbar leading-relaxed`}
                />
              </div>

              <div className={`w-full md:w-64 shrink-0 flex flex-col ${isDarkMode ? 'bg-[#13151b] border-white/5' : 'bg-gray-50 border-gray-100'} border rounded-xl p-4 overflow-hidden`}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-3 pb-3 border-b ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'}`}>Xem trước lộ trình</h4>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                  {parsedData.length === 0 ? (
                    <div className="text-[11px] text-gray-500 font-medium italic text-center mt-10">Chưa nhận diện được dữ liệu nào.</div>
                  ) : (
                    parsedData.map((chap, i) => (
                      <div key={i} className={`${isDarkMode ? 'bg-[#252733] border-white/5' : 'bg-white border-gray-200'} p-3 rounded-lg border shadow-sm`}>
                        <div className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1.5 truncate`} title={chap.title}>{chap.title}</div>
                        <div className="text-[10px] font-black text-[#64bc04] uppercase tracking-widest">{chap.words.length} từ</div>
                      </div>
                    ))
                  )}
                </div>
                <div className={`pt-3 mt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-gray-500 uppercase tracking-widest">Tổng kết:</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-400">{parsedData.length} Unit</span>
                    <span className="text-green-500">{parsedData.reduce((acc, curr) => acc + curr.words.length, 0)} Từ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#2a2c38] bg-[#181a20]' : 'border-gray-100 bg-gray-50'} flex justify-end gap-4 shrink-0`}>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold px-6 py-3 transition-colors text-sm uppercase tracking-widest">Hủy</button>
          <button 
            onClick={handleSave}
            disabled={!title.trim() || parsedData.length === 0}
            className={`px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${title.trim() && parsedData.length > 0 ? 'bg-[#64bc04] hover:bg-[#74d404] text-white shadow-[0_4px_15px_rgba(100,188,4,0.3)] active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            Lưu Lộ Trình
          </button>
        </div>
      </div>
    </div>
  );
}

// --- GIAO DIỆN LỘ TRÌNH HỌC TỔNG HỢP ---
function ThematicVocabView({ libraries, setLibraries, onClose, onStartCustomGame, isDarkMode }) {
  const [isCreating, setIsCreating] = useState(false);
  const [deletingLibId, setDeletingLibId] = useState(null);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null); 
  const [selectedChapterId, setSelectedChapterId] = useState(null); 

  // Các state cho phần tuỳ chỉnh trong Unit
  const [unitSearch, setUnitSearch] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState('all');
  const [unitLimit, setUnitLimit] = useState('all');
  const [unitOrder, setUnitOrder] = useState('random');

  const getDiffColor = (diff) => {
    if (diff <= 1) return 'bg-[#64bc04]'; 
    if (diff === 2) return 'bg-[#a3e635]'; 
    if (diff === 3) return 'bg-[#fbbf24]'; 
    if (diff === 4) return 'bg-[#f97316]'; 
    return 'bg-[#ef4444]'; 
  };

  const handleSaveNewLibrary = async (newLib) => {
    try {
      // 1. Thêm thông tin chủ nhân cuốn sách
      const libWithUser = {
        ...newLib,
        userId: auth.currentUser.uid, // <-- Chữ auth.currentUser.uid mới là chân ái ở đây!
        createdAt: Date.now()
      };
      
      // 2. Đẩy lên mây (bảng libraries)
      const docRef = await addDoc(collection(db, "libraries"), libWithUser);
      
      // 3. Cập nhật giao diện với ID thật từ mây trả về
      setLibraries([{ ...libWithUser, id: docRef.id }, ...libraries]);
      setIsCreating(false);
      console.log("Đã lưu lộ trình sách lên mây!");
    } catch (e) {
      console.error("Lỗi lưu sách:", e);
      alert("Lỗi khi lưu sách! Hà mở F12 xem chi tiết nhé.");
    }
  };

  const handleDeleteLibrary = (e, id) => {
    e.stopPropagation();
    setDeletingLibId(id);
  };

  const selectedLibrary = libraries.find(l => l.id === selectedLibraryId);
  const selectedChapter = selectedLibrary?.chapters.find(c => c.id === selectedChapterId);

  const handleToggleChapterWord = async (wordId) => {
    // 1. Tìm sách và chương hiện tại để lấy dữ liệu chuẩn
    const targetLib = libraries.find(l => l.id === selectedLibraryId);
    if (!targetLib) return;

    // 2. Tạo mảng chapters mới với từ đã được đổi trạng thái
    const updatedChapters = targetLib.chapters.map(chap => {
      if (chap.id !== selectedChapterId) return chap;
      return {
        ...chap,
        words: chap.words.map(w =>
          w.id === wordId ? { ...w, isMastered: !w.isMastered, level: w.isMastered ? 1 : 5 } : w
        )
      };
    });

    // 3. Cập nhật giao diện ngay lập tức cho mượt
    setLibraries(prev => prev.map(lib =>
      lib.id === selectedLibraryId ? { ...lib, chapters: updatedChapters } : lib
    ));

    // 4. BẮT BUỘC: Đẩy lên Firebase để lưu vĩnh viễn
    try {
      await updateDoc(doc(db, "libraries", selectedLibraryId), {
        chapters: updatedChapters
      });
      console.log("Đã lưu trạng thái Tick Thuộc vào Sách trên mây!");
    } catch (error) {
      console.error("Lỗi khi lưu tick Thuộc: ", error);
      alert("Lỗi mạng, chưa lưu được trạng thái!");
    }
  };

  // GIAO DIỆN 3: CHI TIẾT UNIT (CHƯƠNG)
  if (selectedChapter) {
    const totalWords = selectedChapter.words.length;
    const masteredWords = selectedChapter.words.filter(w => w.isMastered).length;
    const progress = totalWords === 0 ? 0 : Math.round((masteredWords / totalWords) * 100);

    let filteredWords = selectedChapter.words.filter(w => {
      const matchesSearch = w.word.toLowerCase().includes(unitSearch.toLowerCase()) || w.meaning.toLowerCase().includes(unitSearch.toLowerCase());
      const matchesStatus = unitStatusFilter === 'all' ? true : unitStatusFilter === 'mastered' ? w.isMastered : !w.isMastered;
      return matchesSearch && matchesStatus;
    });

    if (unitOrder === 'random') {
      filteredWords = [...filteredWords].sort(() => Math.random() - 0.5);
    }
    if (unitLimit !== 'all') {
      filteredWords = filteredWords.slice(0, parseInt(unitLimit));
    }

    const gameModes = [
      { id: 'flashcard', name: 'Flashcard', desc: 'Lật thẻ để học từ vựng', icon: List, color: 'bg-gradient-to-br from-[#7b5cff] to-[#6942df]' },
      { id: 'quiz', name: 'Quiz', desc: 'Trắc nghiệm chọn đáp án (30s)', icon: CheckSquare, color: 'bg-gradient-to-br from-[#ff9c2a] to-[#fd7a00]' },
      { id: 'listening', name: 'Listening', desc: 'Nghe từ và gõ lại (30s)', icon: Headphones, color: 'bg-gradient-to-br from-[#14b8e3] to-[#049bc2]' },
      { id: 'typing', name: 'Typing', desc: 'Xem nghĩa, gõ từ tiếng Anh (30s)', icon: Type, color: 'bg-gradient-to-br from-[#82d616] to-[#6bb505]' },
      { id: 'matching', name: 'Ghép cặp', desc: 'Nối từ với nghĩa', icon: Grid, color: 'bg-gradient-to-br from-[#2ebcfb] to-[#129bd4]' },
      { id: 'mixed', name: 'Tổng hợp', desc: 'Kết hợp nhiều chế độ', icon: Zap, color: 'bg-gradient-to-br from-[#ff88b6] to-[#ff5294] border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]' },
    ];

    return (
      <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 pb-12 mt-4 max-w-[1200px] mx-auto px-4">
        {/* Header Unit */}
        <div className={`p-6 rounded-[24px] mb-6 border relative flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden ${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-md'}`}>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => setSelectedChapterId(null)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#252733] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <ChevronLeft size={18} />
            </button>
            <h2 className={`text-xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedChapter.title}</h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-[#252733] text-gray-300 border-white/5' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{totalWords} từ vựng</span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">{masteredWords}/{totalWords} đã học ({progress}%)</span>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-[#2a2c38]' : 'bg-gray-200'}`}>
            <div className="h-full bg-[#64bc04] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Tùy chỉnh */}
        <div className={`p-6 rounded-[24px] mb-6 border flex flex-col gap-4 ${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-md'}`}>
          <div className="flex justify-between items-center">
            <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Settings size={18} /> Tùy chỉnh
            </div>
            <span className="bg-teal-500/20 text-teal-400 font-bold px-4 py-1.5 rounded-full text-xs">{filteredWords.length}/{totalWords} từ</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Trạng thái</label>
              <div className="relative">
                <select value={unitStatusFilter} onChange={(e) => setUnitStatusFilter(e.target.value)} className={`w-full p-3 rounded-xl text-sm font-bold border outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'}`}>
                  <option value="all">📖 Chưa thuộc</option>
                  <option value="mastered">📖 Đã thuộc</option>
                  <option value="all_view">📖 Tất cả</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Số lượng</label>
              <div className="relative">
                <select value={unitLimit} onChange={(e) => setUnitLimit(e.target.value)} className={`w-full p-3 rounded-xl text-sm font-bold border outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'}`}>
                  <option value="20">🔢 20 từ</option>
                  <option value="10">🔢 10 từ</option>
                  <option value="30">🔢 30 từ</option>
                  <option value="all">🔢 Tất cả</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Thứ tự</label>
              <div className="relative">
                <select value={unitOrder} onChange={(e) => setUnitOrder(e.target.value)} className={`w-full p-3 rounded-xl text-sm font-bold border outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'}`}>
                  <option value="random">🔀 Ngẫu nhiên</option>
                  <option value="seq">⬇️ Theo danh sách</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Chọn chế độ học */}
        <div className={`p-6 rounded-[24px] mb-6 border ${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-md'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chọn chế độ học</h3>
            <Settings size={18} className="text-gray-500 cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameModes.map(game => (
              <div 
  key={game.id} 
  onClick={() => filteredWords.length > 0 && onStartCustomGame(game.id, filteredWords, { type: 'library', libraryId: selectedLibraryId, chapterId: selectedChapterId })}
  className={`${game.color} rounded-2xl p-5 flex flex-col items-center justify-center text-white cursor-pointer hover:-translate-y-1 transition-all shadow-lg relative ${filteredWords.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                  <game.icon size={20} />
                </div>
                <div className="font-black text-sm mb-1">{game.name}</div>
                <div className="text-[9px] font-medium text-center opacity-90 line-clamp-1 mb-2">{game.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách từ vựng */}
        <div className={`rounded-[24px] border overflow-hidden ${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-md'}`}>
          <div className="p-6 border-b border-inherit flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Danh sách từ vựng</h3>
            <span className="text-xs text-gray-500 font-bold">{totalWords} từ</span>
          </div>
          <div className={`p-4 border-b border-inherit flex gap-3 ${isDarkMode ? 'bg-[#181a20]' : 'bg-white'}`}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Tìm kiếm từ vựng..." 
                value={unitSearch}
                onChange={e => setUnitSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm font-bold border outline-none transition-colors ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'}`}
              />
            </div>
            <div className="relative">
              <select className={`px-4 py-2.5 rounded-full text-sm font-bold border outline-none cursor-pointer appearance-none pr-8 ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                <option>Tất cả</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-gray-50 border-gray-100'} border-b`}>
                <tr>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[25%]">TỪ VỰNG</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[20%]">NGHĨA</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-[15%]">LOẠI TỪ</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[30%]">VÍ DỤ</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-[10%]">THUỘC</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2c38]' : 'divide-gray-50'}`}>
                {filteredWords.length === 0 ? (
                  <tr><td colSpan="5" className="py-12 text-center text-gray-500">Không có từ vựng phù hợp.</td></tr>
                ) : (
                  filteredWords.map(item => (
                    <tr key={item.id} className={`${isDarkMode ? 'hover:bg-[#252733]/40' : 'hover:bg-gray-50'} transition-colors`}>
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <button onClick={() => playAudio(item.word)} className="mt-0.5 text-gray-500 hover:text-indigo-500 transition-colors"><Volume2 size={16}/></button>
                          <div>
                            <div className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.word}</div>
                            <div className="text-[11px] text-gray-500 font-medium italic mt-0.5">{item.phonetic}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.meaning}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase border ${isDarkMode ? 'bg-[#252733] text-gray-300 border-white/5' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{item.type}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{item.example}</div>
                      </td>
                      <td className="py-4 px-6 flex justify-center">
                        <div 
                          onClick={() => handleToggleChapterWord(item.id)}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors mt-1 border ${item.isMastered ? 'bg-[#64bc04] border-[#64bc04]' : (isDarkMode ? 'bg-[#13151b] border-[#3e414d]' : 'bg-gray-200 border-gray-300')}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-transform ${item.isMastered ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // GIAO DIỆN 2: CHI TIẾT SÁCH (HIỂN THỊ CÁC UNIT)
  if (selectedLibrary) {
    const totalWords = selectedLibrary.chapters.reduce((sum, chap) => sum + chap.words.length, 0);
    
    return (
      <div className="w-full animate-in fade-in zoom-in-95 duration-500 pb-12 mt-4 max-w-6xl mx-auto px-4">
        
        {/* HEADER CHI TIẾT SÁCH */}
        <div className={`p-6 sm:p-8 rounded-[32px] mb-8 border relative overflow-hidden ${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setSelectedLibraryId(null)} 
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-[#252733] text-gray-400 hover:text-white hover:bg-[#3e414d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📚</span>
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedLibrary.title}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-[#252733] text-gray-300 border-white/5' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {selectedLibrary.chapters.length} bộ từ
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    {totalWords} từ vựng
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    0% hoàn thành
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors shadow-sm ${isDarkMode ? 'bg-[#252733] border-white/5 text-gray-300 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                📌 Ghim
              </button>
              <button className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors shadow-sm ${isDarkMode ? 'bg-[#252733] border-white/5 text-gray-300 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                🏆 BXH
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
              <span>Tiến độ: 0/{totalWords} từ</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#252733]' : 'bg-gray-100'} shadow-inner`}>
              <div className="h-full bg-[#64bc04] w-[0%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* DANH SÁCH CÁC UNIT */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Các bộ từ ({selectedLibrary.chapters.length})</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {selectedLibrary.chapters.map((chap, i) => (
            <div key={chap.id} onClick={() => setSelectedChapterId(chap.id)} className={`group ${isDarkMode ? 'bg-[#252733] border-[#3e414d] hover:border-indigo-500/50' : 'bg-white border-gray-200 shadow-md hover:border-indigo-400'} border rounded-[24px] p-5 flex flex-col transition-all duration-300 cursor-pointer relative overflow-hidden`}>
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-lg shadow-inner ${isDarkMode ? 'bg-[#3e414d] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 mt-1">
                  <h4 className={`font-black text-base leading-tight truncate ${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'} transition-colors mb-1.5`}>
                    {chap.title}
                  </h4>
                  <div className="text-xs font-bold text-gray-500">{chap.words.length} từ</div>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                    <span>Tiến độ</span>
                    <span className="text-[#64bc04]">0%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#181a20]' : 'bg-gray-100'}`}>
                    <div className="h-full bg-[#64bc04] rounded-full w-[0%]"></div>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-[#181a20] group-hover:bg-indigo-500 text-gray-500 group-hover:text-white' : 'bg-gray-100 group-hover:bg-indigo-600 text-gray-400 group-hover:text-white'}`}>
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }

  // GIAO DIỆN 1: TỔNG QUAN DANH SÁCH CÁC SÁCH
  return (
    <div className="w-full animate-in slide-in-from-right-8 duration-500 pb-12 mt-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-2 px-6">
        <button onClick={onClose} className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}>
          <ChevronLeft size={20} /> Trở về
        </button>
      </div>
      <h2 className={`text-center text-2xl font-black mb-8 uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BỘ SÁCH</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-6">
        <div onClick={() => setIsCreating(true)} className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-[#64bc04] bg-[#1e1f29]' : 'border-gray-300 hover:border-[#64bc04] bg-gray-50'} rounded-[24px] p-5 flex flex-col items-center justify-center min-h-[160px] cursor-pointer group transition-all`}>
          <div className={`w-14 h-14 rounded-full ${isDarkMode ? 'bg-[#2a2c38] text-gray-400 group-hover:bg-[#64bc04] group-hover:text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-[#64bc04] group-hover:text-white'} flex items-center justify-center mb-3 transition-colors shadow-lg`}>
            <Plus size={28} strokeWidth={3} />
          </div>
          <span className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-gray-400 group-hover:text-[#64bc04]' : 'text-gray-500 group-hover:text-[#64bc04]'} transition-colors`}>Nhập Sách Mới</span>
        </div>

        {libraries.map((lib) => {
          const totalWords = lib.chapters.reduce((sum, chap) => sum + chap.words.length, 0);
          return (
            <div key={lib.id} onClick={() => setSelectedLibraryId(lib.id)} className={`${isDarkMode ? 'bg-[#252733] border-[#3e414d]' : 'bg-white border-gray-200 shadow-lg'} border rounded-[24px] p-5 flex flex-col hover:-translate-y-1 hover:border-indigo-400 transition-all cursor-pointer group relative`}>
              <button onClick={(e) => handleDeleteLibrary(e, lib.id)} className={`absolute top-4 right-4 text-gray-500 hover:text-red-500 ${isDarkMode ? 'bg-[#181a20]' : 'bg-gray-100'} hover:bg-red-500/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm`} title="Xóa lộ trình sách này">
                <Trash2 size={16} />
              </button>
              <h3 className={`font-black text-lg mb-3 leading-snug pr-8 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-indigo-400 transition-colors line-clamp-2`}>
                {lib.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isDarkMode ? 'bg-[#181a20] text-gray-300 border-white/5' : 'bg-indigo-50 text-indigo-700 border-indigo-100'} px-2.5 py-1 rounded-md border`}>
                  <Layers size={12} className={isDarkMode ? "text-indigo-400" : ""}/> 
                  {lib.chapters.length} bộ từ
                </span>
                <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isDarkMode ? 'bg-[#181a20] text-gray-300 border-white/5' : 'bg-green-50 text-green-700 border-green-100'} px-2.5 py-1 rounded-md border`}>
                  <Book size={12} className={isDarkMode ? "text-green-400" : ""}/> 
                  {totalWords} từ
                </span>
              </div>
              <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Độ khó</span>
                  <span className={`text-[12px] font-black ${getDiffColor(lib.difficulty).replace('bg-', 'text-')}`}>{lib.difficulty}/5</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#181a20]' : 'bg-gray-200'}`}>
                  <div className={`h-full rounded-full ${getDiffColor(lib.difficulty)} transition-all duration-1000`} style={{ width: `${(lib.difficulty / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCreating && (
        <CreateLibraryModal onClose={() => setIsCreating(false)} onSave={handleSaveNewLibrary} isDarkMode={isDarkMode} />
      )}

      {deletingLibId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[600] p-4 backdrop-blur-sm">
          <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-200'} p-6 rounded-3xl w-full max-w-[400px] border shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95`}>
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <Trash2 size={40} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>Xóa Lộ Trình?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 px-4">Toàn bộ chương và từ vựng bên trong lộ trình này sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
            <div className="flex items-center gap-4 w-full">
              <button onClick={() => setDeletingLibId(null)} className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors ${isDarkMode ? 'bg-[#252733] text-gray-300 hover:bg-[#3e414d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Hủy Bỏ</button>
              <button onClick={() => { setLibraries(prev => prev.filter(l => l.id !== deletingLibId)); setDeletingLibId(null); }} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95">Xóa Ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// BƯỚC 1: THÊM onUpdateWord VÀO DANH SÁCH PROPS Ở DÒNG ĐẦU TIÊN
function VocabTab({ vocab, onToggleMastered, onBulkAction, onOpenAddMultiple, isDarkMode, onUpdateWord }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingWord, setEditingWord] = useState(null);

  const totalCount = vocab.length;
  const masteredCount = vocab.filter(w => w.level === 5).length;
  const unmasteredCount = totalCount - masteredCount;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((masteredCount / totalCount) * 100);

  const filteredVocab = useMemo(() => {
    return vocab.filter(v => {
      const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' ? true : filterStatus === 'mastered' ? v.level === 5 : v.level < 5;
      return matchesSearch && matchesFilter;
    });
  }, [vocab, searchQuery, filterStatus]);
  
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleSelectAll = () => selectedIds.length === filteredVocab.length ? setSelectedIds([]) : setSelectedIds(filteredVocab.map(v => v.id));

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">
      
      {/* 1. THẺ THỐNG KÊ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
        {[
          { label: 'Tổng', value: totalCount, icon: Book, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
          { label: 'Thuộc', value: masteredCount, icon: Check, color: 'bg-[#64bc04]', shadow: 'shadow-green-500/20' },
          { label: 'Chưa', value: unmasteredCount, icon: Clock, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' },
          { label: '%', value: `${progressPercentage}%`, icon: null, color: 'bg-purple-500', shadow: 'shadow-purple-500/20' }
        ].map((stat, idx) => (
          <div key={idx} className={`border ${isDarkMode ? 'border-white/20 bg-transparent' : 'border-gray-100 bg-white shadow-sm'} rounded-2xl p-5 flex items-center gap-5 hover:border-indigo-400 transition-colors`}>
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center shadow-lg ${stat.shadow}`}>
              {stat.icon ? <stat.icon size={24} className="text-white"/> : <span className="text-white font-black text-xl">%</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</span>
              <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. THANH TÌM KIẾM */}
      <div className={`border ${isDarkMode ? 'border-white/20' : 'border-gray-100 bg-white shadow-sm'} rounded-full py-2 px-3 flex flex-col md:flex-row items-center gap-3 bg-transparent mb-8 mx-4`}>
        <div className="relative flex-1 w-full ml-2">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input 
            type="text" 
            placeholder="Tìm từ..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className={`bg-transparent border ${isDarkMode ? 'border-white/10' : 'border-gray-50'} rounded-full py-3 pl-12 pr-6 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} outline-none focus:border-indigo-500 font-bold w-full max-w-xs transition-colors`} 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className={`bg-transparent border ${isDarkMode ? 'border-white/10' : 'border-gray-100'} rounded-full py-3 px-5 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-bold outline-none cursor-pointer hover:border-gray-500 appearance-none min-w-[140px] pr-10`}
            >
              <option className={isDarkMode ? "bg-[#1e1f29]" : "bg-white"} value="all">Tất cả</option>
              <option className={isDarkMode ? "bg-[#1e1f29]" : "bg-white"} value="unmastered">Chưa thuộc</option>
              <option className={isDarkMode ? "bg-[#1e1f29]" : "bg-white"} value="mastered">Đã thuộc</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><ChevronDown size={16}/></div>
          </div>
          <button onClick={onOpenAddMultiple} className={`bg-indigo-600 text-white font-black py-3 px-6 rounded-full flex items-center justify-center gap-2 text-xs hover:brightness-110 transition-all whitespace-nowrap shadow-lg`}>
            <Layers size={16}/> Thêm nhiều
          </button>
        </div>
      </div>
      
      {/* 3. BẢNG TỪ VỰNG */}
      <div className={`mx-4 ${isDarkMode ? 'bg-[#1e1f29]/80 border-[#2a2c38]' : 'bg-white border-gray-100 shadow-xl'} border rounded-[32px] overflow-hidden relative transition-colors`}>
        {selectedIds.length > 0 && (
          <div className="bg-[#0b3d52] border-b border-white/10 p-6 flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center gap-8 ml-4">
              <div className="text-white font-black text-xl tracking-tighter uppercase">Đã chọn {selectedIds.length} từ</div>
              <button onClick={() => setSelectedIds([])} className="text-white/60 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"><X size={18}/> Bỏ chọn</button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { onBulkAction('mastered', selectedIds); setSelectedIds([]); }} className="bg-[#64bc04] text-white px-8 py-3 rounded-full font-black text-xs uppercase transition-all shadow-lg active:scale-95">Thuộc</button>
              <button onClick={() => { onBulkAction('delete', selectedIds); setSelectedIds([]); }} className="bg-red-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase transition-all shadow-lg active:scale-95">Xóa</button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className={`${isDarkMode ? 'bg-[#181a20]/80 border-[#2a2c38]' : 'bg-gray-50 border-gray-100'} border-b`}>
              <tr>
                <th className="py-6 px-8 w-[5%]"><button onClick={toggleSelectAll} className="flex items-center justify-center">{selectedIds.length > 0 ? <div className="w-6 h-6 rounded-xl bg-[#3b82f6] flex items-center justify-center text-white shadow-lg"><Minus size={14} strokeWidth={4}/></div> : <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-500'} transition-all`}></div>}</button></th>
                <th className="py-6 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest w-[20%]">TỪ VỰNG</th>
                <th className="py-6 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">NGHĨA</th>
                <th className="py-6 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-center w-[10%]">LOẠI TỪ</th>
                <th className="py-6 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest w-[30%]">VÍ DỤ</th>
                <th className="py-6 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right pr-10 w-[10%]">THUỘC</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2c38]' : 'divide-gray-50'}`}>
              {filteredVocab.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-gray-500 font-medium">Không tìm thấy từ vựng nào.</td></tr>
              ) : (
                filteredVocab.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setEditingWord(item)} 
                    className={`transition-all group cursor-pointer ${selectedIds.includes(item.id) ? (isDarkMode ? 'bg-[#0b3d52]/30' : 'bg-blue-50') : (isDarkMode ? 'hover:bg-[#252733]/40' : 'hover:bg-gray-50')}`}
                  >
                    <td className="py-6 px-8">
                      {/* BƯỚC 2: THÊM stopPropagation VÀO CÁC NÚT CON */}
                      <button onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }} className="flex items-center justify-center">
                        {selectedIds.includes(item.id) ? <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-xl shadow-blue-500/20"><Check size={12} strokeWidth={5}/></div> : <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-gray-600 hover:border-white' : 'border-gray-200 hover:border-indigo-400'} transition-colors`}></div>}
                      </button>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-start gap-4">
                        <button onClick={(e) => { e.stopPropagation(); playAudio(item.word); }} className="mt-1 text-gray-500 hover:text-indigo-500 transition-all hover:scale-110"><Volume2 size={18}/></button>
                        <div><div className={`font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} text-[16px] leading-tight group-hover:text-indigo-400 transition-colors`}>{item.word}</div><div className="text-[13px] text-gray-500 font-medium italic mt-0.5 opacity-80">{item.phonetic}</div></div>
                      </div>
                    </td>
                    <td className="py-6 px-4"><div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-bold text-[15px]`}>{item.meaning}</div></td>
                    <td className="py-6 px-4 text-center"><span className={`${isDarkMode ? 'bg-[#2a2c38] text-gray-300 border-white/5' : 'bg-gray-100 text-gray-600 border-gray-200'} text-[10px] font-black px-3 py-1.5 rounded-full uppercase border shadow-sm inline-block`}>{item.type}</span></td>
                    <td className="py-6 px-4"><div className="text-[14px]"><div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1 leading-relaxed opacity-90`}>{item.example}</div><div className="text-pink-400/80 italic flex items-center gap-2 text-[12px] font-medium">📝 {item.note || item.exampleTrans}</div></div></td>
                    <td className="py-6 px-4 text-right pr-10">
                      <button onClick={(e) => { e.stopPropagation(); onToggleMastered(item.id); }} className="inline-flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                        {item.level === 5 ? (
                          <div className="w-7 h-7 rounded-full bg-[#64bc04] flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <Check size={16} strokeWidth={4} />
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-full border-2 ${isDarkMode ? 'border-[#3e414d] hover:border-gray-400 text-transparent hover:text-gray-400' : 'border-gray-200 hover:border-indigo-400 text-transparent hover:text-indigo-400'} flex items-center justify-center transition-colors`}>
                            <Check size={16} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 4. MODAL CHỈNH SỬA TRONG VOCABTAB */}
      {editingWord && (
        <EditWordModal 
          word={editingWord} 
          isDarkMode={isDarkMode} 
          onClose={() => setEditingWord(null)} 
          onSave={(updatedWord) => {
            // THÊM DÒNG IF NÀY ĐỂ KHÔNG BỊ CRASH 
            if (typeof onUpdateWord === 'function') {
              onUpdateWord(updatedWord); 
            } else {
              console.error("Lỗi: Chưa nhận được hàm onUpdateWord từ App.js");
            }
            setEditingWord(null); 
          }} 
        />
      )}
    </div>
  );
}

function GamesTab({ vocab, sets, onStartCustomGame, onOpenSRS, history, isDarkMode }) {
  const [selectedSet, setSelectedSet] = useState('all');
  const [statusFilter, setStatusFilter] = useState('unmastered');
  const [orderMode, setOrderMode] = useState('random');
  const [wordCount, setWordCount] = useState('20');

  const availableWords = useMemo(() => {
      let list = [...vocab];
      if (selectedSet !== 'all') {
          const targetSet = sets.find(s => s.id === selectedSet);
          if (targetSet) {
              list = list.filter(w => targetSet.wordIds.includes(w.id));
          } else {
              list = [];
          }
      }
      if (statusFilter === 'unmastered') {
          list = list.filter(w => w.level < 5);
      } else if (statusFilter === 'mastered') {
          list = list.filter(w => w.level === 5);
      }
      return list;
  }, [vocab, sets, selectedSet, statusFilter]);

  const handlePlayGame = (gameId) => {
      if (availableWords.length === 0) return;
      let finalWords = [...availableWords];
      if (orderMode === 'random') {
          finalWords = shuffleArray(finalWords);
      }
      if (wordCount !== 'all') {
          finalWords = finalWords.slice(0, parseInt(wordCount));
      }
      onStartCustomGame(gameId, finalWords);
  };

  const games = [
    { id: 'flashcard', name: 'Flashcard', desc: 'Lật thẻ học từ vựng', icon: List, color: 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' },
    { id: 'quiz', name: 'Trắc nghiệm', desc: 'Chọn đáp án đúng', icon: CheckSquare, color: 'bg-gradient-to-r from-[#f97316] to-[#ea580c]' },
    { id: 'matching', name: 'Nối từ với nghĩa', desc: 'Ghép đôi từ vựng và nghĩa', icon: Grid, color: 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb]' },
    { id: 'typing', name: 'Gõ từ vựng', desc: 'Nhìn nghĩa và gõ từ...', icon: Type, color: 'bg-gradient-to-r from-[#22c55e] to-[#16a34a]' },
    { id: 'listening', name: 'Nghe viết', desc: 'Nghe phát âm và viết từ', icon: Headphones, color: 'bg-gradient-to-r from-[#06b6d4] to-[#0891b2]' },
    { id: 'mixed', name: 'Tổng hợp', desc: 'Hỗ hợp các loại câu hỏi', icon: Zap, color: 'bg-gradient-to-r from-[#ff6b9e] to-[#ff4b82]' },
  ];
  
  return (
    <div className="max-w-5xl mx-auto pt-6 space-y-10 pb-12 animate-in fade-in duration-500 px-4">
      
      {/* Banner SRS đưa lên đầu tiên */}
      <div className="w-full bg-gradient-to-r from-[#d946ef] to-[#a855f7] rounded-[40px] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden transition-all">
        <div className="text-center sm:text-left mb-6 sm:mb-0 relative z-10 flex-1">
          <h2 className="text-white text-3xl sm:text-4xl font-black mb-3 tracking-tighter uppercase">Ôn tập nhắc lại</h2>
          <p className="text-white/90 text-sm sm:text-base font-bold max-w-lg leading-relaxed">Hệ thống tự động nhắc lại các từ vựng bạn sắp quên. Giúp bạn nhớ lâu hơn gấp 10 lần!</p>
        </div>
        <button onClick={onOpenSRS} className="bg-white text-purple-600 font-black py-4 px-8 rounded-full flex items-center gap-3 hover:scale-105 shadow-xl relative z-10 text-lg uppercase tracking-[0.1em] transition-all whitespace-nowrap active:scale-95">
          <RotateCw size={22} strokeWidth={3} /> Tổng quan
        </button>
      </div>

      {/* Khu vực Chọn Game xếp dọc */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
          <h3 className={`text-xl font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chế độ luyện tập</h3>
          <span className="bg-indigo-500/20 text-indigo-400 font-bold px-3 py-1.5 rounded-full text-xs self-start sm:self-auto border border-indigo-500/20">
            Sẵn sàng {availableWords.length} từ
          </span>
        </div>
        
        {/* Bộ lọc ngang với thẻ <select> thực tế */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Bộ từ vựng */}
          <div className="flex flex-col gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bộ từ vựng</span>
            <div className="relative">
              <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)} className={`w-full appearance-none ${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38] text-gray-300 focus:border-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:border-indigo-400'} border rounded-[16px] px-4 py-3 cursor-pointer outline-none transition-all font-bold text-sm shadow-sm pr-10`}>
                <option value="all">Tất cả bộ từ</option>
                {sets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-col gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bộ lọc</span>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`w-full appearance-none ${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38] text-gray-300 focus:border-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:border-indigo-400'} border rounded-[16px] px-4 py-3 cursor-pointer outline-none transition-all font-bold text-sm shadow-sm pr-10`}>
                <option value="all">Tất cả</option>
                <option value="unmastered">Chưa thuộc</option>
                <option value="mastered">Đã thuộc</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Thứ tự */}
          <div className="flex flex-col gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Thứ tự</span>
            <div className="relative">
              <select value={orderMode} onChange={(e) => setOrderMode(e.target.value)} className={`w-full appearance-none ${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38] text-gray-300 focus:border-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:border-indigo-400'} border rounded-[16px] px-4 py-3 cursor-pointer outline-none transition-all font-bold text-sm shadow-sm pr-10`}>
                <option value="random">Ngẫu nhiên</option>
                <option value="seq">Theo danh sách</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Số lượng */}
          <div className="flex flex-col gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Số lượng</span>
            <div className="relative">
              <select value={wordCount} onChange={(e) => setWordCount(e.target.value)} className={`w-full appearance-none ${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38] text-gray-300 focus:border-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:border-indigo-400'} border rounded-[16px] px-4 py-3 cursor-pointer outline-none transition-all font-bold text-sm shadow-sm pr-10`}>
                <option value="10">10 từ</option>
                <option value="20">20 từ</option>
                <option value="30">30 từ</option>
                <option value="50">50 từ</option>
                <option value="all">Tất cả</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Danh sách thẻ Game dạng Card ngang, rải theo dạng lưới chảy xuống dọc */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {games.map(game => (
            <div key={game.id} onClick={() => handlePlayGame(game.id)} className={`${game.color} rounded-[24px] p-5 flex items-center gap-5 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all shadow-md group ${availableWords.length === 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
              <div className="w-14 h-14 rounded-2xl border border-white/20 bg-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                <game.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left text-white">
                <h3 className="font-black text-base uppercase tracking-widest mb-1 leading-tight">{game.name}</h3>
                <p className="text-white/80 text-[11px] font-bold leading-tight">{game.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LỊCH SỬ ĐẤU --- */}
      <div className={`border-2 ${isDarkMode ? 'border-purple-500/40 bg-[#181a20]/40' : 'border-purple-200 bg-white shadow-xl'} rounded-[32px] p-6 shadow-[0_0_30px_rgba(168,85,247,0.05)] mt-8`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-400/20 p-2.5 rounded-full text-purple-400">
              <Calendar size={20} strokeWidth={2.5}/>
            </div>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-xl tracking-tight`}>Lịch sử đấu</h3>
          </div>
          <button className="text-gray-400 hover:text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
            <PieChart size={16}/> Xem thống kê
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8 font-medium">Chưa có lịch sử. Bắt đầu luyện tập ngay nhé!</div>
          ) : (
            history.map(item => {
              const info = GAME_INFO[item.gameId] || GAME_INFO['quiz'];
              return (
                <div key={item.id} className={`${isDarkMode ? 'bg-[#1e1f29] border-white/10' : 'bg-gray-50 border-gray-100 shadow-sm'} border rounded-full p-3 pr-8 flex items-center justify-between hover:border-purple-500/50 transition-all group`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${info.color} shadow-inner`}>
                      <info.icon size={20} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-base tracking-tight group-hover:text-purple-400 transition-colors`}>{info.name}</span>
                      <span className="text-gray-500 text-[11px] font-medium tracking-widest mt-0.5">{formatHistoryDate(item.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Độ chính xác</span>
                    <span className={`text-xl font-black tracking-tighter leading-none ${item.accuracy >= 50 ? 'text-green-500' : 'text-red-500'}`}>{item.accuracy}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

// --- COMPONENT TỔNG QUAN SRS ---
function SRSOverviewModal({ vocab, sets, onClose, onStartReview, isDarkMode }) {
  const [search, setSearch] = useState('');
  const [filterSet, setFilterSet] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [reviewCount, setReviewCount] = useState(20);
  const [reviewSet, setReviewSet] = useState('all');

  const levelCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  vocab.forEach(w => {
    if (!w.nextReview || w.nextReview === 0) levelCounts[0]++;
    else levelCounts[w.level || 1]++;
  });
  const maxCount = Math.max(...Object.values(levelCounts), 1);

  const learningWords = vocab.filter(w => w.nextReview && w.nextReview > 0);
  const filteredList = learningWords.filter(w => {
    const mSearch = w.word.toLowerCase().includes(search.toLowerCase());
    const mLevel = filterLevel === 'all' || (w.level || 1).toString() === filterLevel;
    let mSet = true;
    if (filterSet !== 'all') {
      const targetSet = sets.find(s => s.id === filterSet);
      mSet = targetSet ? targetSet.wordIds.includes(w.id) : false;
    }
    return mSearch && mLevel && mSet;
  });

  const dueWordsAll = getDueWords(vocab);
  const dueWordsFiltered = reviewSet === 'all' 
    ? dueWordsAll 
    : dueWordsAll.filter(w => sets.find(s => s.id === reviewSet)?.wordIds.includes(w.id));
  
  const wordsToReview = Math.min(reviewCount, dueWordsFiltered.length);
  const hasDue = wordsToReview > 0;

  const barColors = {
    0: 'bg-gray-400', 1: 'bg-orange-500', 2: 'bg-yellow-400', 
    3: 'bg-blue-400', 4: 'bg-purple-500', 5: 'bg-green-500'
  };

  return (
    <div className="fixed inset-0 bg-[#0f111a]/95 flex items-center justify-center z-[300] p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-2xl'} w-full max-w-[1000px] h-[85vh] rounded-[32px] border flex flex-col overflow-hidden animate-in zoom-in-95`}>
        
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight">
            <RotateCw size={24} className="text-pink-500"/> <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Tổng quan SRS</span>
          </div>
          <div className="flex items-center gap-4">
            <Settings size={22} className="text-gray-400 cursor-pointer hover:text-indigo-500 transition-colors"/>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={28}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className={`${isDarkMode ? 'border-white/10 bg-[#181a20]/50' : 'border-gray-100 bg-gray-50'} border rounded-3xl p-6 shadow-inner relative`}>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Phân bố từ vựng theo cấp độ</div>
            <div className="flex items-end justify-around h-40 px-4">
              {[0, 1, 2, 3, 4, 5].map(lvl => (
                <div key={lvl} className="flex flex-col items-center gap-3 w-16 group">
                  <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>{levelCounts[lvl]}</span>
                  <div className={`w-10 ${isDarkMode ? 'bg-[#2a2c38]' : 'bg-gray-200'} rounded-t-xl relative flex items-end justify-center h-full`}>
                    <div className={`w-10 rounded-t-xl transition-all duration-1000 ${barColors[lvl]}`} style={{ height: `${(levelCounts[lvl] / maxCount) * 100}%`, minHeight: levelCounts[lvl] > 0 ? '10%' : '0' }}></div>
                  </div>
                  <span className={`text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-gray-500'} uppercase tracking-widest`}>Lvl {lvl}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-lg tracking-tight`}>Danh sách từ đang học ({learningWords.length})</h3>
              <div className="flex flex-wrap items-center gap-3">
                <input type="text" placeholder="Tìm..." value={search} onChange={e => setSearch(e.target.value)} className={`bg-transparent border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500 w-32`} />
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className={`bg-transparent border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-full px-4 py-2 text-sm text-gray-500 outline-none`}>
                  <option value="all">Tất cả Level</option>
                  {[1,2,3,4,5].map(l => <option key={l} value={l}>Lvl {l}</option>)}
                </select>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-[#181a20]/30 border-white/5' : 'bg-white border-gray-100 shadow-sm'} border rounded-2xl overflow-hidden`}>
              <table className="w-full text-left">
                <thead className={`border-b ${isDarkMode ? 'border-white/5 bg-[#181a20]/50' : 'border-gray-100 bg-gray-50'}`}>
                  <tr>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[25%]">Từ vựng</th>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nghĩa</th>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-[15%]">Mức độ</th>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-[20%]">Ôn tập</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                  {filteredList.slice(0, 50).map(w => (
                    <tr key={w.id} className={`${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                      <td className={`py-3 px-6 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{w.word}</td>
                      <td className={`py-3 px-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>{w.meaning}</td>
                      <td className="py-3 px-6 text-center">
                        <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-md border border-yellow-500/30">Lv{w.level || 1}</span>
                      </td>
                      <td className="py-3 px-6 text-right text-sm font-medium text-cyan-400">{formatTimeLeft(w.nextReview)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#2a2c38] bg-[#181a20]' : 'border-gray-100 bg-gray-50'} flex flex-col gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>Số từ ôn:</span>
              <input type="number" value={reviewCount} onChange={e => setReviewCount(Number(e.target.value))} className={`${isDarkMode ? 'bg-[#2a2c38] border-white/10' : 'bg-white border-gray-200 shadow-sm'} border rounded-xl px-4 py-2.5 text-sm outline-none w-20 text-center font-bold`} min="1" max="100"/>
            </div>
            <button 
              onClick={() => hasDue && onStartReview(dueWordsFiltered.slice(0, reviewCount))} 
              disabled={!hasDue}
              className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${hasDue ? 'bg-[#64bc04] hover:bg-[#74d404] text-white active:scale-95' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
            >
              <Play size={18} fill="currentColor"/> Bắt đầu ôn ({wordsToReview})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 5. LOGIC GAME (TRẮC NGHIỆM, NỐI TỪ) ---

function SummaryScreen({ results, onFinish, onRetry, onNext, onSaveResults, isDarkMode }) {
  const [isSaved, setIsSaved] = useState(false);
  const correct = results.filter(r => r.isCorrect);
  const wrong = results.filter(r => !r.isCorrect);
  const percentage = Math.round((correct.length / Math.max(1, results.length)) * 100);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center p-4 sm:p-10 overflow-y-auto w-full animate-in fade-in duration-500">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Cột Đúng */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 px-2">
               <div className="w-8 h-8 bg-[#64bc04] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg"><Check size={20} strokeWidth={4}/></div>
               <div className="text-left">
                 <h3 className={`text-[#64bc04] font-black text-lg tracking-tight`}>Trả lời đúng ({correct.length})</h3>
                 <p className="text-gray-400 text-xs">Đã đánh dấu thuộc</p>
               </div>
            </div>
            <div className={`border-2 border-[#64bc04]/60 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1f29]' : 'bg-white shadow-xl'} min-h-[300px] flex flex-col shadow-lg`}>
              <div className="flex justify-between bg-[#2d5a27] text-white px-6 py-3 font-black text-sm uppercase tracking-widest border-b border-[#64bc04]/30">
                <span>Từ vựng</span>
                <span>Nghĩa</span>
              </div>
              <div className={`flex-1 flex flex-col divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'} overflow-y-auto`}>
                {correct.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-black/5 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-base`}>{res.word.word}</div>
                    </div>
                    <div className="text-gray-400 text-sm text-right pr-2">{res.word.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột Sai */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 px-2">
               <div className="w-8 h-8 bg-[#ef4444] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg"><X size={20} strokeWidth={4}/></div>
               <div className="text-left">
                 <h3 className="text-[#ef4444] font-black text-lg tracking-tight">Trả lời sai ({wrong.length})</h3>
                 <p className="text-gray-400 text-xs">Cần ôn lại thêm</p>
               </div>
            </div>
            <div className={`border-2 border-[#f472b6]/60 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1f29]' : 'bg-white shadow-xl'} min-h-[300px] flex flex-col shadow-lg`}>
              <div className="flex justify-between bg-[#7f1d1d] text-white px-6 py-3 font-black text-sm uppercase tracking-widest border-b border-[#f472b6]/30">
                <span>Từ vựng</span>
                <span>Nghĩa</span>
              </div>
              <div className={`flex-1 flex flex-col divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'} overflow-y-auto`}>
                {wrong.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-black/5 transition-colors">
                    <div className="text-[#f472b6] font-bold text-base">{res.word.word}</div>
                    <div className="text-gray-400 text-sm text-right pr-2">{res.word.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-6">
          {!isSaved ? (
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
              {/* NÚT KHÔNG LƯU */}
              <button 
                onClick={() => {
                  setIsSaved(true);
                  // Chỉ đổi trạng thái để hiện nút chuyển bài, KHÔNG gọi onSaveResults
                }} 
                className={`${isDarkMode ? 'bg-[#2a2c38] hover:bg-[#3e414d]' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} text-white font-black py-4 px-8 rounded-full text-lg shadow-xl active:scale-95 transition-all flex items-center gap-3`}
              >
                <X size={24} /> Không lưu
              </button>

              {/* NÚT LƯU KẾT QUẢ */}
              <button 
                onClick={() => {
                  setIsSaved(true);
                  if (onSaveResults) onSaveResults(results);
                }} 
                className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black py-4 px-10 rounded-full text-lg shadow-xl active:scale-95 transition-all flex items-center gap-3 animate-pulse"
              >
                <Check size={24} /> 💾 Lưu kết quả
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-4 animate-in slide-in-from-bottom-4">
               {wrong.length > 0 && (
                 <button onClick={onRetry} className="bg-[#ef4444] hover:bg-red-500 text-white font-black py-3 px-8 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                   <RotateCcw size={20} /> Làm lại câu sai
                 </button>
               )}
               <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                 <RotateCw size={20} /> Chơi tiếp
               </button>
               <button onClick={onFinish} className={`${isDarkMode ? 'bg-[#2a2c38] hover:bg-[#3e414d]' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} text-white font-black py-3 px-8 rounded-full flex items-center gap-2 shadow-lg transition-all`}>
                 <LayoutGrid size={20} /> Game khác
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingView({ word, onAnswer, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    setInputValue('');
    setHintsUsed(0);
    setShowExample(false);
  }, [word]);

  const handleCheck = () => {
    if (disabled || !inputValue.trim()) return;
    onAnswer(inputValue.trim().toLowerCase() === word.word.toLowerCase());
  };

  const handleHint = () => {
    if (hintsUsed >= 3 || disabled) return;
    setHintsUsed(prev => prev + 1);
  };

  const getHintText = () => {
    if (hintsUsed === 0) return "Chưa có gợi ý";
    const target = word.word;
    const revealCount = Math.max(1, Math.floor(target.length * (hintsUsed / 3)));
    let hintStr = "";
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ') hintStr += ' ';
      else if (i < revealCount) hintStr += target[i];
      else hintStr += '_';
    }
    return hintStr.split('').join(' ');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === 'Enter') {
        handleCheck();
      } else if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        handleHint();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowExample(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, hintsUsed, disabled, word]);

  if (!word) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1e1f29]/80 border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight text-center">
        {word.meaning}
      </h2>
      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={() => playAudio(word.word)} className="text-gray-400 hover:text-white transition-all hover:scale-110">
          <Volume2 size={20}/>
        </button>
        <span className="bg-[#3e414d] text-gray-300 text-[11px] font-black px-4 py-1.5 rounded-full uppercase shadow-sm tracking-widest">
          {word.type}
        </span>
      </div>
      {showExample && (
        <div className="w-full bg-[#13151b]/50 border border-white/10 rounded-2xl p-4 mb-4 text-center animate-in fade-in slide-in-from-top-2">
          <p className="text-gray-300 italic">"{word.example.replace(new RegExp(word.word, 'gi'), '____')}"</p>
        </div>
      )}
      <div className="h-8 flex items-center justify-center mb-6">
        <span className={`text-[15px] font-medium tracking-[0.2em] uppercase ${hintsUsed > 0 ? 'text-blue-400 font-bold' : 'text-gray-500 italic'}`}>
          {getHintText()}
        </span>
      </div>
      <div className="w-full mb-8 relative">
        <input 
          autoFocus
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          placeholder="Gõ từ tiếng Anh..." 
          className="w-full bg-[#13151b] border-2 border-transparent focus:border-[#00a8ff] focus:shadow-[0_0_20px_rgba(0,168,255,0.2)] rounded-full py-4 sm:py-5 px-8 text-center text-lg sm:text-xl text-white font-bold outline-none transition-all placeholder:font-medium placeholder:text-gray-600 disabled:opacity-50" 
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => setShowExample(!showExample)} disabled={disabled} className="px-5 py-3.5 rounded-full border border-white/10 hover:bg-white/5 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
            <Pencil size={18} /> Xem ví dụ
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Ctrl + E</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={handleHint} disabled={hintsUsed >= 3 || disabled} className="px-5 py-3.5 rounded-full border border-white/10 hover:bg-white/5 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
            <Zap size={18} /> Gợi ý ({3 - hintsUsed})
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Ctrl + Space</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={handleCheck} disabled={disabled} className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black px-10 py-3.5 rounded-full text-sm transition-all shadow-[0_4px_15px_rgba(100,188,4,0.3)] active:scale-95 disabled:opacity-50">
            Kiểm tra
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Enter</span>
        </div>
      </div>
    </div>
  );
}

function ListeningView({ word, onAnswer, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [listenCount, setListenCount] = useState(0);

  const handlePlayAudio = () => {
    playAudio(word.word);
    setListenCount(prev => prev + 1);
  };

  useEffect(() => {
    setInputValue('');
    setHintsUsed(0);
    setShowExample(false);
    setListenCount(0);
    const timer = setTimeout(() => { handlePlayAudio(); }, 500);
    return () => clearTimeout(timer);
  }, [word]);

  const handleCheck = () => {
    if (disabled || !inputValue.trim()) return;
    onAnswer(inputValue.trim().toLowerCase() === word.word.toLowerCase());
  };

  const handleHint = () => {
    if (hintsUsed >= 3 || disabled) return;
    setHintsUsed(prev => prev + 1);
  };

  const getHintText = () => {
    if (hintsUsed === 0) return "Chưa có gợi ý";
    const target = word.word;
    const revealCount = Math.max(1, Math.floor(target.length * (hintsUsed / 3)));
    let hintStr = "";
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ') hintStr += ' ';
      else if (i < revealCount) hintStr += target[i];
      else hintStr += '_';
    }
    return hintStr.split('').join(' ');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === 'Enter') {
        handleCheck();
      } else if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        handleHint();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowExample(prev => !prev);
      } else if (e.ctrlKey && (e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        handlePlayAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, hintsUsed, disabled, word]);

  if (!word) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1e1f29]/80 border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center relative">
      <div className="absolute top-8 right-8 text-xs font-medium text-gray-500 tracking-widest">
        Nghe: {listenCount}x | Ctrl+H
      </div>
      <div className="mt-4 mb-6 relative">
        <button onClick={handlePlayAudio} className="w-24 h-24 bg-[#64bc04] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(100,188,4,0.3)] hover:scale-105 active:scale-95 transition-all">
          <Headphones size={40} strokeWidth={2.5} />
        </button>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#2f5c66] border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white whitespace-nowrap shadow-md tracking-widest">
          CTRL + X
        </div>
      </div>
      <h2 className="text-xl font-black text-gray-500 mb-3 tracking-tight text-center">
        Nghe và gõ từ tiếng Anh
      </h2>
      <span className="bg-[#3e414d] text-gray-300 text-[11px] font-black px-4 py-1.5 rounded-full uppercase shadow-sm tracking-widest mb-6">
        {word.type}
      </span>
      {showExample && (
        <div className="w-full bg-[#13151b]/50 border border-white/10 rounded-2xl p-4 mb-4 text-center animate-in fade-in slide-in-from-top-2">
          <p className="text-gray-300 italic">"{word.example.replace(new RegExp(word.word, 'gi'), '____')}"</p>
        </div>
      )}
      <div className="h-8 flex items-center justify-center mb-6">
        <span className={`text-[15px] font-medium tracking-[0.2em] uppercase ${hintsUsed > 0 ? 'text-blue-400 font-bold' : 'text-gray-500 italic'}`}>
          {getHintText()}
        </span>
      </div>
      <div className="w-full mb-8 relative">
        <input 
          autoFocus
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          placeholder="Gõ từ bạn nghe được..." 
          className="w-full bg-[#13151b] border-2 border-transparent focus:border-[#00a8ff] focus:shadow-[0_0_20px_rgba(0,168,255,0.2)] rounded-full py-4 sm:py-5 px-8 text-center text-lg sm:text-xl text-white font-bold outline-none transition-all placeholder:font-medium placeholder:text-gray-600 disabled:opacity-50" 
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => setShowExample(!showExample)} disabled={disabled} className="px-5 py-3.5 rounded-full border border-white/10 hover:bg-white/5 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
            <Pencil size={18} /> Xem ví dụ
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Ctrl + E</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={handleHint} disabled={hintsUsed >= 3 || disabled} className="px-5 py-3.5 rounded-full border border-white/10 hover:bg-white/5 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
            <Zap size={18} /> Gợi ý ({3 - hintsUsed})
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Ctrl + Space</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button onClick={handleCheck} disabled={disabled} className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black px-10 py-3.5 rounded-full text-sm transition-all shadow-[0_4px_15px_rgba(100,188,4,0.3)] active:scale-95 disabled:opacity-50">
            Kiểm tra
          </button>
          <span className="text-[11px] text-gray-500 font-medium">Enter</span>
        </div>
      </div>
    </div>
  );
}

function QuizContent({ word, allVocab, subMode, onAnswer, disabled }) {
  const options = useMemo(() => {
    if (!word) return [];
    const distractors = shuffleArray(allVocab.filter(w => w.id !== word.id)).slice(0, 3);
    const combined = shuffleArray([word, ...distractors]);
    return combined.map(item => ({ id: item.id, item }));
  }, [word, allVocab]);

  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    if (selectedId || disabled) return;
    setSelectedId(id);
    onAnswer(id === word?.id);
  };

  useEffect(() => {
    const handleKeys = (e) => {
      if (selectedId || disabled) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (options[idx]) handleSelect(options[idx].id);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [options, selectedId, disabled]);

  const getQuestionContent = () => {
    if (!word) return "";
    if (subMode === 'context') {
      const regex = new RegExp(word.word, 'gi');
      return `"${word.example.replace(regex, '____')}"`;
    }
    return subMode === 'en-vn' ? word.word : word.meaning;
  };

  if (!word) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pb-24 text-center">
      <div className="w-full flex flex-col items-center mb-12">
        <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">{getQuestionContent()}</h2>
        <div className="flex items-center justify-center gap-4 text-gray-500">
           <button onClick={() => playAudio(word.word)} className="p-2 hover:text-white transition-all hover:scale-125"><Volume2 size={24}/></button>
           <span className="bg-[#2a2c38] text-gray-300 text-[12px] font-black px-4 py-1.5 rounded-xl uppercase border border-white/5 shadow-md tracking-widest">{word.type}</span>
           <span className="text-lg italic opacity-60 font-medium">{word.phonetic}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full px-2">
        {options.map((opt, idx) => {
          const isCorrect = opt.id === word.id; 
          const isSelected = selectedId === opt.id;
          let btnStyle = "bg-[#1e1f29] border-white/5 text-gray-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:scale-[1.02]";
          if (selectedId && isCorrect) btnStyle = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.05]";
          if (isSelected && !isCorrect) btnStyle = "bg-red-500/20 border-red-500 text-red-400 scale-[1.05]";
          if (selectedId && !isSelected && !isCorrect) btnStyle = "bg-[#181a20] border-white/5 text-gray-700 opacity-40";
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={!!selectedId || disabled} className={`p-8 flex items-center gap-5 border-2 rounded-[32px] transition-all duration-300 group relative min-h-[160px] shadow-lg text-left ${btnStyle}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border-2 transition-all ${isSelected ? 'bg-white text-gray-900 border-white' : 'border-gray-700 text-gray-500'}`}>{idx + 1}</div>
              <div className="text-xl font-black leading-tight tracking-tight">{subMode === 'en-vn' ? opt.item.meaning : opt.item.word}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-12 text-[11px] font-black text-gray-700 uppercase tracking-[0.25em] opacity-80 tracking-widest">Sử dụng phím số 1-4 để chọn nhanh đáp án</div>
    </div>
  );
}

function MatchingView({ sessionWords, onAnswer, lives }) {
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [selectedVietnamese, setSelectedVietnamese] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  
  const englishList = useMemo(() => shuffleArray(sessionWords.map(w => ({ id: w.id, text: w.word }))), [sessionWords]);
  const vietnameseList = useMemo(() => shuffleArray(sessionWords.map(w => ({ id: w.id, text: w.meaning }))), [sessionWords]);
  
  useEffect(() => { 
    if (selectedEnglish && selectedVietnamese) { 
      const isCorrect = selectedEnglish === selectedVietnamese; 
      if (isCorrect) { 
        setMatchedIds(prev => [...prev, selectedEnglish]); 
        onAnswer(true, sessionWords.find(w => w.id === selectedEnglish)); 
      } else { 
        onAnswer(false); 
      } 
      setSelectedEnglish(null); 
      setSelectedVietnamese(null); 
    } 
  }, [selectedEnglish, selectedVietnamese, onAnswer, sessionWords]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full bg-white rounded-[24px] p-6 flex items-center justify-between mb-8 shadow-xl border border-white/5">
        <div className="flex items-center gap-1.5 ml-2">{[...Array(5)].map((_, i) => (<Heart key={i} size={28} className={`transition-all duration-500 ${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-200 fill-gray-200'}`} />))}</div>
        <div className="bg-green-100 text-green-600 px-6 py-2 rounded-full flex items-center gap-3 font-black text-xl tracking-widest shadow-sm uppercase"><Clock size={22} strokeWidth={3}/> 30S</div>
      </div>
      <div className="grid grid-cols-2 gap-12 w-full">
        <div className="flex flex-col gap-4"><h3 className="text-white font-black text-xl mb-2 text-center uppercase tracking-widest opacity-80">Tiếng Anh</h3>
          {englishList.map(item => { const isMatched = matchedIds.includes(item.id); const isSelected = selectedEnglish === item.id; return (<button key={item.id} onClick={() => !isMatched && setSelectedEnglish(item.id)} disabled={isMatched} className={`py-4 px-6 rounded-[20px] font-black text-lg border-2 transition-all duration-300 shadow-lg text-center tracking-tight ${isMatched ? 'opacity-0 pointer-events-none' : isSelected ? 'bg-white text-[#13151b] border-white scale-105 shadow-xl' : 'bg-[#1e1f29] border-white/10 text-gray-300 hover:border-indigo-500'}`}>{item.text}</button>); })}
        </div>
        <div className="flex flex-col gap-4"><h3 className="text-white font-black text-xl mb-2 text-center uppercase tracking-widest opacity-80">Tiếng Việt</h3>
          {vietnameseList.map(item => { const isMatched = matchedIds.includes(item.id); const isSelected = selectedVietnamese === item.id; return (<button key={item.id} onClick={() => !isMatched && setSelectedVietnamese(item.id)} disabled={isMatched} className={`py-4 px-6 rounded-[20px] font-black text-lg border-2 transition-all duration-300 shadow-lg text-center tracking-tight ${isMatched ? 'opacity-0 pointer-events-none' : isSelected ? 'bg-white text-[#13151b] border-white scale-105 shadow-xl' : 'bg-[#1e1f29] border-white/10 text-gray-300 hover:border-green-500'}`}>{item.text}</button>); })}
        </div>
      </div>
      <div className="mt-12 text-white font-black text-lg tracking-widest opacity-60 uppercase">Đã ghép: {matchedIds.length} / {sessionWords.length}</div>
    </div>
  );
}

function PracticeSession({ sessionWords: initialSessionWords, allVocab, gameType, subMode, onFinish, onQuit, onUpdateMastered, isDarkMode }) {
  const [currentSessionWords, setCurrentSessionWords] = useState(initialSessionWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(30);
  const [lives, setLives] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isCorrectResponse, setIsCorrectResponse] = useState(false);
  const [feedbackTimer, setFeedbackTimer] = useState(4);
  const [feedbackWord, setFeedbackWord] = useState(null);
  const [mixedTypes, setMixedTypes] = useState([]);

  useEffect(() => {
     setCurrentSessionWords(initialSessionWords);
     if (gameType === 'mixed' || gameType === 'srs') {
         const types = ['quiz', 'typing', 'listening'];
         setMixedTypes(initialSessionWords.map(() => types[Math.floor(Math.random() * types.length)]));
     }
  }, [initialSessionWords, gameType]);

  const activeGameType = (gameType === 'mixed' || gameType === 'srs') ? (mixedTypes[currentIndex] || 'quiz') : gameType;

  useEffect(() => { 
    if (showFeedback || showSummary) return; 
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000); 
    return () => clearInterval(interval); 
  }, [currentIndex, showFeedback, showSummary]);

  useEffect(() => {
    let timerId;
    if (showFeedback && feedbackTimer > 0) {
      timerId = setTimeout(() => setFeedbackTimer(t => t - 1), 1000);
    } else if (showFeedback && feedbackTimer === 0) {
      handleAdvance();
    }
    return () => clearTimeout(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeedback, feedbackTimer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFeedback && e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    if (showFeedback) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeedback, currentIndex, results, activeGameType, currentSessionWords.length]);

  const handleAnswer = (isCorrect, wordInfo = null) => {
    playFeedbackSound(isCorrect);
    const targetWord = wordInfo || currentSessionWords[currentIndex];
    
    if (isCorrect) {
      if (!results.find(r => r.word.id === targetWord.id)) {
        setResults(prev => [...prev, { word: targetWord, isCorrect: true }]);
      }
      setIsCorrectResponse(true); 
      setFeedbackWord(targetWord); 
      setShowFeedback(true); 
      setFeedbackTimer(4); 
      playAudio(targetWord.word);
    } else {
      if (activeGameType === 'quiz' || activeGameType === 'typing' || activeGameType === 'listening') { 
        if (!results.find(r => r.word.id === targetWord.id)) {
          setResults(prev => [...prev, { word: targetWord, isCorrect: false }]); 
        }
        setIsCorrectResponse(false); 
        setFeedbackWord(targetWord); 
        setShowFeedback(true); 
        setFeedbackTimer(4); 
      } else {
        setLives(l => Math.max(0, l - 1));
        if (lives <= 1) setShowSummary(true);
      }
    }
  };

  const handleAdvance = () => {
    setShowFeedback(false);
    if (results.filter(r => r.isCorrect).length >= currentSessionWords.length) { 
      setShowSummary(true); 
      return; 
    }
    if (activeGameType === 'quiz' || activeGameType === 'typing' || activeGameType === 'listening') { 
      if (currentIndex < currentSessionWords.length - 1) { 
        setCurrentIndex(p => p + 1); 
        setTimer(30); 
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleRetryWrong = () => {
    const wrongWords = results.filter(r => !r.isCorrect).map(r => r.word);
    if (wrongWords.length > 0) {
      setCurrentSessionWords(wrongWords);
      if (gameType === 'mixed' || gameType === 'srs') {
          const types = ['quiz', 'typing', 'listening'];
          setMixedTypes(wrongWords.map(() => types[Math.floor(Math.random() * types.length)]));
      }
      setCurrentIndex(0);
      setResults([]);
      setTimer(30);
      setLives(5);
      setShowSummary(false);
      setShowFeedback(false);
    }
  };

  const handlePlayNext = () => {
    const nextWordsCandidates = allVocab.filter(w => w.level < 5 || (w.nextReview && w.nextReview <= Date.now()));
    const nextWords = shuffleArray(nextWordsCandidates).slice(0, initialSessionWords.length || 5);
    if (nextWords.length === 0) { onFinish(); return; }
    setCurrentSessionWords(nextWords);
    if (gameType === 'mixed' || gameType === 'srs') {
        const types = ['quiz', 'typing', 'listening'];
        setMixedTypes(nextWords.map(() => types[Math.floor(Math.random() * types.length)]));
    }
    setCurrentIndex(0);
    setResults([]);
    setTimer(30);
    setLives(5);
    setShowSummary(false);
    setShowFeedback(false);
  };

  if (showSummary) {
    return (
      <SummaryScreen 
        results={results} 
        onFinish={onFinish} 
        onRetry={handleRetryWrong}
        onNext={handlePlayNext}
        onSaveResults={onUpdateMastered}
        isDarkMode={isDarkMode}
      />
    );
  }

  const getHighlightedExample = (ex, w) => { 
    if (!ex) return "Không có ví dụ"; 
    const parts = ex.split(new RegExp(`(${w})`, 'gi')); 
    return parts.map((p, i) => p.toLowerCase() === w.toLowerCase() ? <span key={i} className="underline font-black text-[#13151b]">{p}</span> : p); 
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center p-4 sm:p-10 relative overflow-x-hidden w-full">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className={`${isDarkMode ? 'bg-[#1e1f29] border-white/5' : 'bg-white border-gray-100 shadow-xl'} rounded-[32px] p-6 border shadow-2xl flex flex-col gap-5 transition-colors`}>
          <div className="flex items-center justify-between">
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-xl tracking-tight`}>
              {activeGameType === 'matching' ? `Đã ghép ${results.filter(r=>r.isCorrect).length} / ${currentSessionWords.length}` : `Câu ${currentIndex + 1} / ${currentSessionWords.length}`}
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`flex items-center ${isDarkMode ? 'bg-[#13151b]' : 'bg-gray-100'} rounded-full p-1 border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} cursor-pointer`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-600'} px-3 py-1`}>VN→EN</span>
                <div className="w-9 h-5 rounded-full bg-indigo-600 relative flex items-center p-0.5">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm"></div>
                </div>
              </div>
              <button onClick={handleRetryWrong} className="text-gray-400 hover:text-indigo-500 flex items-center gap-1.5 font-bold text-sm transition-colors"><RotateCw size={16}/> Chơi lại</button>
              <button onClick={() => onQuit()} className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black text-sm tracking-widest hover:opacity-70 transition-opacity`}>Thoát</button>
            </div>
          </div>
          <div className={`w-full ${isDarkMode ? 'bg-[#13151b]' : 'bg-gray-100'} h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} shadow-inner`}>
            <div className="h-full bg-[#64bc04] transition-all duration-700 shadow-xl" style={{ width: `${((activeGameType === 'matching' ? results.filter(r=>r.isCorrect).length : currentIndex + 1) / currentSessionWords.length) * 100}%` }}></div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`font-black text-sm min-w-[30px] tabular-nums shrink-0 ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>{timer}s</div>
            <div className={`flex-1 ${isDarkMode ? 'bg-[#13151b]' : 'bg-gray-100'} h-2 rounded-full overflow-hidden border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} shadow-inner`}>
              <div className={`h-full transition-all duration-1000 linear ${timer < 10 ? 'bg-red-500' : 'bg-[#64bc04]'}`} style={{ width: `${(timer / 30) * 100}%` }}></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {activeGameType === 'quiz' && <QuizContent key={currentSessionWords[currentIndex]?.id} word={currentSessionWords[currentIndex]} allVocab={allVocab} subMode={subMode} onAnswer={(c) => handleAnswer(c)} disabled={showFeedback} />}
          {activeGameType === 'matching' && <MatchingView sessionWords={currentSessionWords} onAnswer={(c, w) => handleAnswer(c, w)} lives={lives} />}
          {activeGameType === 'typing' && <TypingView key={currentSessionWords[currentIndex]?.id} word={currentSessionWords[currentIndex]} onAnswer={(c) => handleAnswer(c)} disabled={showFeedback} />}
          {activeGameType === 'listening' && <ListeningView key={currentSessionWords[currentIndex]?.id} word={currentSessionWords[currentIndex]} onAnswer={(c) => handleAnswer(c)} disabled={showFeedback} />}
        </div>
      </div>
      {showFeedback && feedbackWord && (
        <div className={`fixed bottom-0 left-0 right-0 p-10 text-[#13151b] z-50 shadow-[0_-20px_100px_rgba(0,0,0,0.4)] border-t-4 border-white/20 transition-colors ${isCorrectResponse ? 'bg-[#64bc04]' : 'bg-[#ef4444]'}`}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-3 flex-1"><div className="flex items-center gap-4"><button onClick={() => playAudio(feedbackWord.word)} className="p-2 hover:scale-125 transition-transform"><Volume2 size={28} strokeWidth={3}/></button><div className="text-3xl font-black tracking-tight">Từ: {feedbackWord.word} <span className="text-lg font-bold opacity-70 uppercase tracking-widest">({feedbackWord.type.toLowerCase()})</span></div></div>
              <div className="font-bold text-base opacity-80 pl-14 tracking-tighter">// {feedbackWord.phonetic} //</div><div className="text-2xl font-black mt-3 pl-14 tracking-tight">Nghĩa: {feedbackWord.meaning}</div>
              <div className="flex items-start gap-3 mt-3 pl-14 text-[#13151b]"><Volume2 size={20} className="mt-1.5 shrink-0 opacity-60"/><div className="text-xl font-bold leading-tight opacity-95">Ví dụ: {getHighlightedExample(feedbackWord.example, feedbackWord.word)}</div></div>
              <div className="text-base font-bold mt-2 pl-14 opacity-80 tracking-widest uppercase">Ghi chú: 📝 {feedbackWord.exampleTrans || "Thường dùng"}</div>
            </div>
            <div className="flex items-center gap-6 shrink-0"><button className="w-16 h-16 rounded-full border-4 border-[#13151b]/20 flex items-center justify-center hover:bg-[#13151b]/10 transition-colors shadow-sm"><Pause size={32} strokeWidth={4}/></button><button onClick={handleAdvance} className="bg-white text-[#13151b] font-black py-5 px-12 rounded-[24px] text-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center gap-4 uppercase tracking-widest shadow-xl">Tiếp tục ({feedbackTimer}s) <span className="text-sm font-bold opacity-60 ml-1">↵ Enter</span></button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlashcardGame({ sessionWords, onFinish, onQuit, isDarkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState('EN-VN');
  const [results, setResults] = useState([]); 
  const [showSummary, setShowSummary] = useState(false);
  
  const currentWord = sessionWords[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  // Hàm này xử lý khi Hà bấm Thuộc hoặc Quên
  const handleAnswer = (isCorrect) => {
    playFeedbackSound(isCorrect);
    
    // Lưu kết quả của từ hiện tại vào mảng results
    const newResults = [...results, { word: currentWord, isCorrect }];
    setResults(newResults);

    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Hết từ rồi thì hiện bảng tổng kết Đúng/Sai
      setShowSummary(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else setShowSummary(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // Phím tắt: Space (Lật), S (Nghe), 1 (Quên), 2 (Thuộc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSummary) return; // Nếu đang hiện bảng tổng kết thì dừng phím tắt game
      
      const key = e.key.toLowerCase();
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (key === 's') {
        e.preventDefault();
        playAudio(isFlipped ? currentWord.example : currentWord.word);
      } else if (isFlipped) {
        if (key === '1' || key === 'x') handleAnswer(false);
        else if (key === '2' || key === 'c') handleAnswer(true);
      } else if (!isFlipped) {
        if (e.key === 'ArrowRight') handleNext();
        else if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, currentWord, results, showSummary]);

  // --- MÀN HÌNH TỔNG KẾT (Y hệt mục Trắc nghiệm) ---
  if (showSummary) {
    return (
      <SummaryScreen 
        results={results} 
        isDarkMode={isDarkMode}
        // Khi bấm Lưu & Hoàn thành, gọi hàm onFinish để lưu vào database
        onFinish={() => onFinish(results)} 
        onRetry={() => {
          // Chức năng làm lại các câu sai
          const wrongWords = results.filter(r => !r.isCorrect).map(r => r.word);
          if (wrongWords.length > 0) {
            setResults([]);
            setCurrentIndex(0);
            setIsFlipped(false);
            setShowSummary(false);
            // Ghi chú: Ở đây nếu muốn làm lại chính xác những từ sai, Hà cần update sessionWords
          } else {
            onFinish(results);
          }
        }}
        onNext={onQuit}
        onSaveResults={(res) => onFinish(res)}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 sm:p-8 w-full animate-in fade-in duration-500">
      <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
        
        {/* HEADER */}
        <div className="w-full flex items-center justify-between px-2">
          <button onClick={onQuit} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white'}`}>
            <X size={18} strokeWidth={3}/> Thoát
          </button>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-black text-lg tracking-tighter`}>
            {currentIndex + 1} / {sessionWords.length}
          </div>
          <button onClick={() => setMode(mode === 'EN-VN' ? 'VN-EN' : 'EN-VN')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-[#1e1f29] border-white/5 text-gray-400' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}>
            Mặt trước: {mode === 'EN-VN' ? 'EN' : 'VN'}
          </button>
        </div>

        {/* THẺ FLASHCARD INDIGO */}
        <div onClick={handleFlip} className="group h-[520px] w-full rounded-[48px] bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] cursor-pointer shadow-[0_30px_70px_rgba(99,102,241,0.35)] relative flex flex-col items-center justify-between p-10 text-white transition-all duration-500 hover:scale-[1.01]">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">
            {isFlipped ? (mode === 'EN-VN' ? 'NGHĨA TIẾNG VIỆT' : 'TỪ TIẾNG ANH') : (mode === 'EN-VN' ? 'TỪ TIẾNG ANH' : 'NGHĨA TIẾNG VIỆT')}
          </div>

          <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
            <div className="text-6xl sm:text-7xl font-black tracking-tighter leading-tight drop-shadow-md mb-6">
              {isFlipped ? (mode === 'EN-VN' ? currentWord.meaning : currentWord.word) : (mode === 'EN-VN' ? currentWord.word : currentWord.meaning)}
            </div>

            {((!isFlipped && mode === 'EN-VN') || (isFlipped && mode === 'VN-EN')) && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="text-xl font-bold opacity-80 lowercase mb-1">{currentWord.type}</div>
                <div className="text-2xl font-medium opacity-60 italic tracking-wide">{currentWord.phonetic}</div>
                <button onClick={(e) => { e.stopPropagation(); playAudio(currentWord.word); }} className="mt-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all mx-auto"><Volume2 size={20} /></button>
              </div>
            )}

            {isFlipped && (
              <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-6 w-full animate-in zoom-in-95 relative">
                <div className="flex items-start gap-4 text-left">
                  <button onClick={(e) => { e.stopPropagation(); playAudio(currentWord.example); }} className="mt-1 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg hover:scale-110 transition-all"><Volume2 size={18} strokeWidth={3}/></button>
                  <div className="flex-1">
                    <p className="text-lg italic font-medium leading-snug">"{currentWord.example}"</p>
                    <p className="text-sm font-black mt-3 opacity-80 border-t border-white/10 pt-3 uppercase tracking-wider">{currentWord.exampleTrans || currentWord.note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-white/50 tracking-wide">
            {isFlipped ? "👇 Đánh giá từ này bên dưới" : "👇 Click hoặc Space để lật thẻ"}
          </div>
        </div>

        {/* NÚT THUỘC / QUÊN */}
        <div className="w-full max-w-2xl">
          {isFlipped ? (
            <div className="flex items-center gap-4 w-full animate-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => handleAnswer(false)} className="flex-1 bg-white border-2 border-red-500 text-red-500 font-black py-4 rounded-[24px] flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-95 shadow-xl shadow-red-500/10 uppercase tracking-widest text-sm">
                <X size={20} strokeWidth={4}/> Quên (1)
              </button>
              <button onClick={() => handleAnswer(true)} className="flex-1 bg-[#64bc04] text-white font-black py-4 rounded-[24px] flex items-center justify-center gap-3 hover:bg-[#74d404] transition-all active:scale-95 shadow-xl shadow-green-500/20 uppercase tracking-widest text-sm">
                <Check size={20} strokeWidth={4}/> Thuộc (2)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-6 w-full px-2">
              <button onClick={handlePrev} disabled={currentIndex === 0} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-[#1e1f29] border-white/5 text-gray-500 hover:text-white' : 'bg-white shadow-lg text-gray-400 hover:text-indigo-600'} border disabled:opacity-20`}><ChevronLeft size={28} strokeWidth={3} /></button>
              <div className="flex-1 h-2 rounded-full bg-indigo-900/20 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" style={{ width: `${((currentIndex + 1) / sessionWords.length) * 100}%` }} />
              </div>
              <button onClick={handleNext} className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl hover:bg-indigo-500 transition-all"><ChevronRight size={28} strokeWidth={3} /></button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


function SetDetailModal({ set, vocab, onClose, onSave, isDarkMode, onUpdateWord }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWords, setEditedWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  
  useEffect(() => { 
    const setWords = set.wordIds.map(id => vocab.find(v => v.id === id)).filter(Boolean); 
    setEditedWords(JSON.parse(JSON.stringify(setWords))); 
  }, [set, vocab]);
  
  const handleWordChange = (index, field, value) => { 
    const newWords = [...editedWords]; 
    newWords[index][field] = value; 
    setEditedWords(newWords); 
  };

  const handleRemoveWord = (index) => {
    const newWords = editedWords.filter((_, i) => i !== index);
    setEditedWords(newWords);
  };
  
  const inputBaseClass = `w-full ${isDarkMode ? 'bg-[#2a2c38] border-[#3e414d] text-white focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-indigo-400'} border rounded-lg p-2 text-sm outline-none transition-all shadow-sm`;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-4 backdrop-blur-md text-left">
      <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-200 shadow-2xl'} w-full max-w-7xl h-[90vh] rounded-3xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-300`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#2a2c38] bg-[#181a20]' : 'border-gray-100 bg-gray-50'} flex items-center justify-between shrink-0`}>
          <div>
            <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight uppercase`}>{set.name}</h2>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">{editedWords.length} từ vựng</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-sm transition-all shadow-lg uppercase tracking-widest ${isEditing ? 'bg-red-500/20 text-red-500 border border-red-500/30' : (isDarkMode ? 'bg-white text-[#13151b]' : 'bg-indigo-600 text-white')}`}>
              {isEditing ? <><X size={18} strokeWidth={3}/> Hủy bỏ</> : <><Pencil size={18} strokeWidth={3}/> Sửa nhanh</>}
            </button>
            <button onClick={onClose} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ${isDarkMode ? 'bg-[#252733] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}><X size={24}/></button>
          </div>
        </div>

        {/* Bảng chỉnh sửa hàng loạt */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar shadow-inner">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className={`${isDarkMode ? 'bg-[#181a20]' : 'bg-gray-50'} sticky top-0 z-10`}>
              <tr>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[3%]">#</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[20%]">TỪ VỰNG</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[18%]">NGHĨA</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[10%] text-center">LOẠI TỪ</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[35%]">VÍ DỤ & GHI CHÚ</th>
                <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-[5%]">{isEditing ? 'XÓA' : ''}</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {editedWords.map((word, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => { if (!isEditing) setEditingWord(word); }}
                  className={`${isDarkMode ? 'hover:bg-[#252733]/40' : 'hover:bg-gray-50'} transition-all ${!isEditing ? 'cursor-pointer' : ''}`}
                >
                  <td className="py-4 px-4 font-black text-gray-600 text-lg align-top pt-6">{idx + 1}</td>
                  
                  {/* CỘT TỪ VỰNG */}
                  <td className="py-4 px-2 align-top">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input value={word.word} onChange={e => handleWordChange(idx, 'word', e.target.value)} className={`${inputBaseClass} font-bold`} placeholder="Từ vựng" />
                        <input value={word.phonetic} onChange={e => handleWordChange(idx, 'phonetic', e.target.value)} className={inputBaseClass} placeholder="Phiên âm" />
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 pt-2">
                        <button onClick={(e) => { e.stopPropagation(); playAudio(word.word); }} className="mt-1 text-gray-500 hover:text-indigo-500 transition-colors"><Volume2 size={16}/></button>
                        <div>
                          <div className={`font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} text-[16px] leading-tight`}>{word.word}</div>
                          <div className="text-sm text-gray-500 italic mt-0.5">{word.phonetic}</div>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* CỘT NGHĨA */}
                  <td className="py-4 px-2 align-top">
                    {isEditing ? (
                      <input value={word.meaning} onChange={e => handleWordChange(idx, 'meaning', e.target.value)} className={`${inputBaseClass} pt-2`} placeholder="Nghĩa của từ" />
                    ) : (
                      <div className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} tracking-tight pt-2`}>{word.meaning}</div>
                    )}
                  </td>

                  {/* CỘT LOẠI TỪ */}
                  <td className="py-4 px-2 align-top text-center">
                    {isEditing ? (
                      <input value={word.type} onChange={e => handleWordChange(idx, 'type', e.target.value)} className={`${inputBaseClass} text-center uppercase font-black text-[10px] w-20 mx-auto pt-2`} placeholder="adj/v/n" />
                    ) : (
                      <div className="pt-2">
                        <span className={`${isDarkMode ? 'bg-[#2a2c38] text-gray-300' : 'bg-gray-100 text-gray-600'} text-[10px] font-black px-3 py-1.5 rounded-full uppercase`}>{word.type}</span>
                      </div>
                    )}
                  </td>

                  {/* CỘT VÍ DỤ & GHI CHÚ */}
                  <td className="py-4 px-2 align-top">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={word.example} onChange={e => handleWordChange(idx, 'example', e.target.value)} className={`${inputBaseClass} h-16 resize-none custom-scrollbar`} placeholder="Ví dụ tiếng Anh" />
                        <textarea value={word.note} onChange={e => handleWordChange(idx, 'note', e.target.value)} className={`${inputBaseClass} h-16 resize-none custom-scrollbar text-pink-400 italic`} placeholder="Ghi chú / Nghĩa ví dụ" />
                      </div>
                    ) : (
                      <div className="text-[14px] pt-2">
                        <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1 leading-relaxed`}>{word.example}</div>
                        <div className="text-pink-400 italic text-[13px]">📝 {word.note || word.exampleTrans}</div>
                      </div>
                    )}
                  </td>

                  {/* CỘT XÓA */}
                  <td className="py-4 px-2 align-top text-center">
                    {isEditing ? (
                      <button onClick={() => handleRemoveWord(idx)} className="mt-2 text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all">
                        <Trash2 size={20} />
                      </button>
                    ) : (
                      <div className="w-full flex justify-center pt-2">
                         <button onClick={(e) => { e.stopPropagation(); setEditingWord(word); }} className="text-gray-500 hover:text-indigo-500 p-2 rounded-lg hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100">
                          <Pencil size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer hiển thị khi đang sửa */}
        {isEditing && (
          <div className={`p-6 ${isDarkMode ? 'bg-[#181a20]' : 'bg-gray-50'} border-t ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'} flex justify-end items-center gap-6 shadow-2xl`}>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mr-auto ml-2">Đang ở chế độ chỉnh sửa hàng loạt</span>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 font-black px-6 py-3 transition-colors hover:text-red-500 uppercase text-xs tracking-widest">Hủy thay đổi</button>
            <button onClick={() => { onSave(set.id, editedWords); setIsEditing(false); }} className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black px-12 py-3 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95 uppercase text-sm tracking-widest">Lưu tất cả</button>
          </div>
        )}
      </div>

      {/* Modal sửa chi tiết 1 từ (vẫn giữ để dùng khi không ở chế độ sửa nhanh) */}
      {editingWord && (
        <EditWordModal 
          word={editingWord} 
          isDarkMode={isDarkMode} 
          onClose={() => setEditingWord(null)} 
          onSave={(updatedWord) => {
            if (onUpdateWord) onUpdateWord(updatedWord); 
            setEditedWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
            setEditingWord(null); 
          }} 
        />
      )}
    </div>
  );
}


function CreateSetModal({ onClose, onCreate, isDarkMode }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[600] p-4 backdrop-blur-sm">
      <div className={`${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200'} p-6 sm:p-8 rounded-[24px] sm:rounded-3xl w-full max-w-[500px] border shadow-2xl relative flex flex-col`}>
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tạo bộ từ mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(name.trim()) onCreate({ id: Date.now().toString(), name, desc: 'Bộ từ cá nhân', icon: '📚', wordIds: [] }); onClose(); }} className="space-y-4 sm:space-y-6">
          <div><label className={`block text-xs sm:text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tên bộ từ vựng <span className="text-red-500">*</span></label><input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="VD: IELTS Vocabulary..." className={`w-full ${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38] text-white focus:border-[#00a8ff]' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'} border rounded-xl px-4 py-3 outline-none transition-all text-sm`} /></div>
          <div className="flex justify-end gap-3 sm:gap-4 pt-4 border-t border-white/5"><button type="button" onClick={onClose} className="text-gray-400 font-bold px-4 py-2 text-sm">Hủy</button><button type="submit" disabled={!name.trim()} className="bg-[#64bc04] hover:bg-[#74d404] text-white font-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm">Tạo bộ từ</button></div>
        </form>
      </div>
    </div>
  );
}

// --- MODAL THÊM NHIỀU TỪ VỰNG (BẢNG LƯỚI & PASTE) ---
function AddMultipleWordsModal({ sets, onClose, onSave, isDarkMode,onCreateSet }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'paste'
  const [selectedSetId, setSelectedSetId] = useState(sets[0]?.id || '');
  const [rows, setRows] = useState([{ id: Date.now(), word: '', phonetic: '', meaning: '', type: '', example: '', note: '' }]);
  const [pasteText, setPasteText] = useState('');
  const [isCreatingSet, setIsCreatingSet] = useState(false);

  const addRow = () => setRows([...rows, { id: Date.now() + Math.random(), word: '', phonetic: '', meaning: '', type: '', example: '', note: '' }]);
  const removeRow = (id) => rows.length > 1 && setRows(rows.filter(r => r.id !== id));
  const updateRow = (id, field, value) => setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));

  const validGridRows = rows.filter(r => r.word.trim() && r.meaning.trim());

  const validPasteLines = useMemo(() => {
    return pasteText.split('\n').filter(line => line.trim() && line.includes('|')).length;
  }, [pasteText]);

  const handlePreviewPaste = () => {
    const lines = pasteText.split('\n').filter(line => line.trim() && line.includes('|'));
    const newRows = lines.map(line => {
      const parts = line.split('|').map(p => p.trim());
      return {
        id: Date.now() + Math.random(),
        word: parts[0] || '',
        phonetic: parts[1] || '',
        type: parts[2] || '',
        meaning: parts[3] || '',
        example: parts[4] || '',
        note: parts[5] || ''
      };
    });
    if (newRows.length > 0) {
      const currentValid = rows.filter(r => r.word.trim() || r.meaning.trim());
      setRows([...currentValid, ...newRows]);
      setPasteText('');
      setViewMode('grid');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500] p-4 backdrop-blur-sm text-left">
      <div className={`${isDarkMode ? 'bg-[#181a20] border-[#2a2c38]' : 'bg-white border-gray-200'} w-full max-w-[1200px] h-[85vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden`}>
        {viewMode === 'grid' ? (
          <>
            <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thêm vào bộ từ:</h2>
                <select value={selectedSetId} onChange={(e) => setSelectedSetId(e.target.value)} className={`bg-[#252733] text-white border border-[#2a2c38] rounded-lg py-1.5 px-3 outline-none text-sm cursor-pointer hover:border-indigo-500`}>
                  {sets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button onClick={() => setIsCreatingSet(true)} className="flex items-center gap-1 sm:gap-2 border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-white/5 transition-colors text-white whitespace-nowrap"><Plus size={14} sm={16}/> Tạo mới</button>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className={`p-4 flex items-center gap-3 border-b ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'} bg-[#1e1f29]`}>
                <button className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors`}><FileUp size={16}/> Nhập file <ChevronDown size={14}/></button>
                <button className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors`}><HelpCircle size={16}/> Hướng dẫn</button>
                <button onClick={() => setViewMode('paste')} className="flex items-center gap-2 bg-white text-[#13151b] px-4 py-2 rounded-full text-sm font-black hover:bg-gray-200 transition-colors shadow-sm"><Zap size={16}/> Thêm nhanh</button>
              </div>
              
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead className={`${isDarkMode ? 'bg-[#252733]' : 'bg-gray-50'} sticky top-0 z-10 border-b ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'}`}>
                    <tr>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-[40px] border-r border-[#2a2c38]">#</th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">TỪ VỰNG <span className="text-red-500">*</span></th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">PHIÊN ÂM</th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">NGHĨA <span className="text-red-500">*</span></th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">LOẠI TỪ</th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">VÍ DỤ</th>
                      <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-[#2a2c38]">GHI CHÚ</th>
                      <th className="py-3 px-4 w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2c38]' : 'divide-gray-100'}`}>
                    {rows.map((row, index) => (
                      <tr key={row.id} className={`${isDarkMode ? 'bg-[#181a20] hover:bg-[#252733]/40' : 'hover:bg-gray-50'}`}>
                        <td className="py-2 px-4 text-xs font-bold text-white text-center border-r border-[#2a2c38]">{index + 1}</td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.word} onChange={e => updateRow(row.id, 'word', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-white rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500`} placeholder="Hello" /></td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.phonetic} onChange={e => updateRow(row.id, 'phonetic', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-gray-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500`} placeholder="/hə'ləʊ/" /></td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.meaning} onChange={e => updateRow(row.id, 'meaning', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-white rounded-lg py-2 px-3 text-sm outline-none focus:border-green-500`} placeholder="Xin chào" /></td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.type} onChange={e => updateRow(row.id, 'type', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-gray-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500`} placeholder="noun" /></td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.example} onChange={e => updateRow(row.id, 'example', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-gray-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500`} placeholder="Hello world" /></td>
                        <td className="py-2 px-2 border-r border-[#2a2c38]"><input value={row.note} onChange={e => updateRow(row.id, 'note', e.target.value)} className={`w-full bg-[#252733] border border-transparent text-gray-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500`} placeholder="Đồng/trái nghĩa..." /></td>
                        <td className="py-2 px-4 text-center"><button onClick={() => removeRow(row.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-t border-[#2a2c38] border-dashed bg-[#181a20]">
                  <button onClick={addRow} className={`w-full py-2.5 flex items-center justify-center gap-2 text-white bg-transparent border border-[#2a2c38] rounded-xl hover:bg-[#252733] transition-colors font-bold text-sm`}><Plus size={16}/> Thêm dòng</button>
                </div>
              </div>
              
              <div className={`p-4 border-t ${isDarkMode ? 'border-[#2a2c38] bg-[#1e1f29]' : 'border-gray-100'} flex justify-end gap-4`}>
                <button onClick={onClose} className="text-gray-400 hover:text-white font-bold px-6 py-2 transition-colors text-sm">Hủy</button>
                <button onClick={() => { if(validGridRows.length > 0) { onSave(selectedSetId, validGridRows); onClose(); } }} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${validGridRows.length > 0 ? 'bg-[#64bc04] hover:bg-[#74d404] text-white shadow-lg active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>Lưu {validGridRows.length} từ</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-[#2a2c38]' : 'border-gray-100'} flex items-center justify-between`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <Zap size={20} className={isDarkMode ? "text-white" : "text-gray-900"} />
                <h2 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thêm nhanh từ vựng (Paste)</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20} sm={24}/></button>
            </div>

            <div className={`flex-1 flex flex-col overflow-hidden p-4 sm:p-6 ${isDarkMode ? 'bg-[#181a20]' : 'bg-white'}`}>
              <div className="bg-[#7e22ce] border border-[#9333ea] rounded-xl p-2.5 sm:p-3 flex items-center justify-between mb-3 sm:mb-4 cursor-pointer shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-yellow-400 text-sm sm:text-base">💡</span>
                  <span className="text-white font-bold text-xs sm:text-sm">Hãy điền như form bên dưới</span>
                </div>
                <ChevronDown className="text-white" size={16} sm={20} />
              </div>
              
              <div className="mb-3 sm:mb-4">
                <div className={`text-xs sm:text-sm font-bold flex flex-wrap items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Định dạng: mỗi dòng 1 từ, cột cách bằng <span className="bg-[#334155] text-white px-1.5 py-0.5 sm:px-2 rounded-md font-mono text-[10px] sm:text-xs border border-[#475569]">|</span>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 font-mono overflow-x-auto whitespace-nowrap hide-scrollbar pb-1">
                  từ vựng | /phiên âm/ | loại từ | nghĩa | ví dụ | ghi chú
                </div>
              </div>
              
              <div className="flex-1 pb-2 sm:pb-4">
                <textarea 
                    autoFocus
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder={`abandon | /ə'bæn.dən/ | verb | từ bỏ | She abandoned her car | thường dùng trong văn viết\nability | /ə'bɪl.ə.ti/ | noun | khả năng | He has great ability | `}
                    className={`w-full h-full ${isDarkMode ? 'bg-[#13151b] border-[#2a2c38] text-gray-300 placeholder-[#334155]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border rounded-xl p-3 sm:p-4 outline-none focus:border-indigo-500 transition-all font-mono text-xs sm:text-sm resize-none custom-scrollbar`}
                />
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-[#2a2c38] bg-[#1e1f29]' : 'border-gray-100 bg-gray-50'} flex justify-end gap-3 sm:gap-4`}>
              <button onClick={() => setViewMode('grid')} className={`${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} font-bold px-4 sm:px-6 py-2 transition-colors text-xs sm:text-sm`}>Hủy</button>
              <button 
                onClick={handlePreviewPaste}
                disabled={validPasteLines === 0}
                className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${validPasteLines > 0 ? 'bg-[#3e8620] hover:bg-[#4ea82a] text-white shadow-lg active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                Xem trước ({validPasteLines} dòng)
              </button>
            </div>
          </>
        )}

        {/* NẾU BẤM TẠO MỚI -> HIỂN THỊ BẢNG TẠO BỘ TỪ (NẰM TRÊN CÙNG NHỜ Z-[600] Ở TRONG COMPONENT ĐÓ) */}
      
        {isCreatingSet && (
          <CreateSetModal 
            isDarkMode={isDarkMode} 
            onClose={() => setIsCreatingSet(false)} 
            // SỬA LẠI ĐOẠN onCreate NÀY:
            onCreate={async (newSet) => {
              if (onCreateSet) {
                const realId = await onCreateSet(newSet); // Đợi Firebase cấp ID thật
                if (realId) setSelectedSetId(realId); // Cập nhật ô chọn bằng ID thật
              }
            }} 
          />
        )}
     
      </div>
    </div>

    
  );
}

// --- COMPONENT: MÀN HÌNH ĐĂNG NHẬP ---
function LoginScreen({ onLogin, isDarkMode, setIsDarkMode }) {
  const [isLoading, setIsLoading] = useState(null);

 
  const handleLogin = async (provider) => {
    if (!auth) {
      alert("Lỗi: Firebase chưa kết nối!");
      return;
    }
    
    // Nếu đang xoay loading rồi thì không cho bấm nữa (chống kẹt nút)
    if (isLoading) return; 

    setIsLoading(provider);
    try {
      if (provider === 'google') {
        const freshGoogleProvider = new GoogleAuthProvider();
        freshGoogleProvider.setCustomParameters({ prompt: 'select_account' });
        
        await signInWithPopup(auth, freshGoogleProvider);
        // Không cần window.location.reload() ở đây nữa nhé!
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Bắt lỗi nếu trình duyệt cố tình chặn Popup
      if (error.code === 'auth/popup-blocked') {
        alert("Trình duyệt đang chặn Popup đăng nhập. Vui lòng cấp quyền mở Popup cho trang web này!");
      } else if (error.code !== 'auth/popup-closed-by-user') {
        // Nếu người dùng không tự tắt cửa sổ thì mới báo lỗi
        alert("Lỗi không thể đăng nhập: " + error.message);
      }
    } finally {
      setIsLoading(null);
    }
  };
  

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${isDarkMode ? 'bg-[#13151b]' : 'bg-gray-50'} p-4 transition-colors duration-500 relative overflow-hidden font-sans`}>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className={`relative w-full max-w-[420px] p-8 sm:p-12 rounded-[40px] shadow-2xl border flex flex-col items-center animate-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-[#1e1f29]/80 border-white/5 backdrop-blur-xl' : 'bg-white border-gray-200 backdrop-blur-xl'}`}>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-[#2a2c38] text-yellow-500' : 'bg-gray-100 text-gray-600'}`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-2 mb-2 mt-4">
          <h1 className={`text-4xl font-black tracking-tighter uppercase transition-colors duration-300 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600'}`}>
            HaTrix
          </h1>
          <div className="w-3 h-3 rounded-full bg-[#64bc04] shadow-[0_0_12px_#64bc04] animate-pulse mt-3"></div>
        </div>
        
        <p className={`text-sm font-bold tracking-widest uppercase mb-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Đăng nhập để đồng bộ
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => handleLogin('google')}
            disabled={isLoading !== null}
            className={`w-full py-4 px-6 rounded-2xl flex items-center gap-4 font-black text-sm uppercase tracking-widest transition-all border ${isDarkMode ? 'bg-[#252733] border-white/5 text-white hover:bg-[#2a2c38]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'} ${isLoading === 'google' ? 'opacity-70' : 'active:scale-95'}`}
          >
            {isLoading === 'google' ? (
              <Loader2 size={24} className="animate-spin text-gray-400 mx-auto w-full" />
            ) : (
              <>
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="flex-1 text-center pr-6">Bằng Google</span>
              </>
            )}
          </button>

          
        </div>

        <div className="mt-8 w-full text-center">
          <button 
            onClick={() => handleLogin('guest')}
            disabled={isLoading !== null}
            className={`text-[11px] font-bold uppercase tracking-widest transition-colors border-b ${isDarkMode ? 'text-gray-500 border-gray-500 hover:text-white hover:border-white' : 'text-gray-400 border-gray-400 hover:text-indigo-600 hover:border-indigo-600'} pb-1`}
          >
         
          </button>
        </div>
      </div>
    </div>
  );
}

function SetsTab({ sets, vocab, onCreateSet, onDeleteSet, onOpenSet, libraries, setLibraries, onStartCustomGame, isDarkMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [deletingSetId, setDeletingSetId] = useState(null);

  if (showLibrary) {
    return <ThematicVocabView libraries={libraries} setLibraries={setLibraries} onClose={() => setShowLibrary(false)} onStartCustomGame={onStartCustomGame} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6 sm:space-y-10 pb-12">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 px-4">
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-[#64bc04] hover:bg-[#74d404] text-white font-black py-3.5 sm:py-4 px-6 sm:px-10 rounded-[16px] sm:rounded-[20px] flex items-center justify-center gap-2 sm:gap-3 shadow-xl uppercase tracking-widest text-xs sm:text-sm transition-all"><Plus size={20} sm={24} strokeWidth={4} /> TẠO BỘ TỪ MỚI</button>
        <button onClick={() => setShowLibrary(true)} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-black py-3.5 sm:py-4 px-6 sm:px-10 rounded-[16px] sm:rounded-[20px] flex items-center justify-center gap-2 sm:gap-3 shadow-xl uppercase tracking-widest text-xs sm:text-sm transition-all"><BookOpen size={20} sm={24} /> TỪ VỰNG CHỦ ĐỀ</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
        {sets.map(set => {
          const setWords = set.wordIds.map(id => vocab.find(v => v.id === id)).filter(Boolean);
          const totalCount = setWords.length;
          const masteredCount = setWords.filter(w => w.level === 5).length;
          const progress = totalCount === 0 ? 0 : (masteredCount / totalCount) * 100;

          return (
            <div key={set.id} className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-100 shadow-md'} border rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 hover:border-indigo-500/50 transition-all group flex flex-col relative`}>
              <div className="flex items-center gap-3 mb-2 sm:mb-3 pr-4">
                <div className={`${isDarkMode ? 'bg-[#fef3c7]' : 'bg-orange-100'} w-10 h-10 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-sm`}>
                  {set.icon}
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base sm:text-lg truncate group-hover:text-indigo-400 transition-colors`}>
                  {set.name}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-1">{set.desc || "Không có mô tả"}</p>

              <div className="flex items-center gap-2 text-gray-400 font-medium text-xs sm:text-sm mb-3">
                <List size={14} sm={16} /> {totalCount} từ
              </div>

              <div className={`w-full ${isDarkMode ? 'bg-[#2a2c38]' : 'bg-gray-100'} h-1.5 sm:h-2.5 rounded-full overflow-hidden mb-1.5 sm:mb-2`}>
                <div className="bg-[#64bc04] h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-[10px] sm:text-sm text-gray-400 mb-4 sm:mb-6">
                {masteredCount}/{totalCount} đã thuộc
              </div>

              <div className={`flex items-center gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                <button 
                  onClick={() => onOpenSet(set)} 
                  className="bg-[#5c67f2] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold shadow-[0_4px_0_#4338ca] hover:brightness-110 active:shadow-[0_0px_0_#4338ca] active:translate-y-1 transition-all text-xs sm:text-sm"
                >
                  Xem
                </button>
                <button className="text-gray-500 hover:text-indigo-500 transition-colors"><Play size={18} fill="currentColor" className="opacity-80"/></button>
                <button className="text-gray-500 hover:text-indigo-500 transition-colors"><Pencil size={16}/></button>
                <button onClick={(e) => { e.stopPropagation(); setDeletingSetId(set.id); }} className="text-gray-500 hover:text-red-500 transition-colors ml-auto">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && <CreateSetModal isDarkMode={isDarkMode} onClose={() => setIsModalOpen(false)} onCreate={onCreateSet} />}
      
      {deletingSetId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[600] p-4 backdrop-blur-sm">
          <div className={`${isDarkMode ? 'bg-[#1e1f29] border-[#2a2c38]' : 'bg-white border-gray-200'} p-6 rounded-3xl w-full max-w-[400px] border shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 sm:mb-5 shadow-inner">
              <Trash2 size={32} sm={40} />
            </div>
            <h3 className={`text-xl sm:text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>Xóa Bộ Từ Này?</h3>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 px-2 sm:px-4">Bạn có chắc chắn muốn xóa bộ từ này không? Hành động này không thể hoàn tác.</p>
            <div className="flex items-center gap-3 sm:gap-4 w-full">
              <button onClick={() => setDeletingSetId(null)} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors ${isDarkMode ? 'bg-[#252733] text-gray-300 hover:bg-[#3e414d]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Hủy Bỏ</button>
              <button onClick={() => { onDeleteSet(deletingSetId); setDeletingSetId(null); }} className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95">Xóa Ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. COMPONENT GỐC (APP) ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [vocab, setVocab] = useState(INITIAL_VOCAB);
  const handleUpdateWord = (updatedWord) => {
    setVocab(prevVocab => prevVocab.map(w => w.id === updatedWord.id ? updatedWord : w));
  };

  
 
  const handleSaveSet = (setId, updatedWords) => {
    // 1. Lấy danh sách ID của bộ từ này trước khi sửa
    const originalSet = sets.find(s => s.id === setId);
    const originalWordIds = originalSet ? originalSet.wordIds : [];

    // 2. Danh sách ID mới sau khi Hà đã bấm thùng rác xóa bớt
    const updatedWordIds = updatedWords.map(w => w.id);

    // 3. Tìm ra những ID nào đã bị Hà "khai tử" (có trong cũ nhưng không có trong mới)
    const removedIds = originalWordIds.filter(id => !updatedWordIds.includes(id));

    // 4. Cập nhật kho tổng (Vocab)
    setVocab(prevVocab => {
      // Lọc bỏ hẳn những từ có ID nằm trong danh sách removedIds
      let newVocab = prevVocab.filter(v => !removedIds.includes(v.id));

      // Cập nhật nội dung (nếu có sửa chữ) cho những từ còn lại
      updatedWords.forEach(uw => {
        const idx = newVocab.findIndex(v => v.id === uw.id);
        if (idx !== -1) newVocab[idx] = uw;
      });
      return newVocab;
    });

    // 5. Cập nhật lại danh sách ID trong Bộ từ
    setSets(prevSets => prevSets.map(s => {
      if (s.id === setId) {
        return { ...s, wordIds: updatedWordIds };
      }
      return s;
    }));

    setCurrentSet(null); // Đóng bảng
  };


  
  const [sets, setSets] = useState(INITIAL_SETS);
  const [libraries, setLibraries] = useState(INITIAL_LIBRARIES); // State quản lý Lộ trình Sách
  const [currentUser, setCurrentUser] = useState(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // 2. DÁN NGUYÊN KHỐI NÀY VÀO ĐÂY:

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);

          try {
            // --- PHẦN 1: LẤY TỪ VỰNG ---
            const qVocab = query(
              collection(db, "vocabularies"),
              where("userId", "==", user.uid)
            );
            const vocabSnapshot = await getDocs(qVocab);
            const vocabData = vocabSnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));
            
            if (vocabData.length > 0) {
              setVocab(vocabData);
            }

            // --- PHẦN 2: LẤY BỘ TỪ ---
            const qSets = query(
              collection(db, "sets"),
              where("userId", "==", user.uid)
            );
            const setsSnapshot = await getDocs(qSets);
            const setsData = setsSnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));

            if (setsData.length > 0) {
              setSets(setsData);
            }

            // --- PHẦN 3: LẤY LỊCH SỬ GAME (Để F5 không bị mất) ---
            // --- PHẦN 3: LẤY LỊCH SỬ GAME (Sửa lỗi mất dữ liệu khi F5) ---
            const qHistory = query(
              collection(db, "history"),
              where("userId", "==", user.uid) // <-- Đã bỏ lệnh orderBy ở đây
            );
            const historySnapshot = await getDocs(qHistory);
            
            // Kéo dữ liệu về rồi mới dùng Javascript để sắp xếp
            const historyData = historySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }))
            .sort((a, b) => b.date - a.date) // <-- Sắp xếp ngày mới nhất lên đầu
            .slice(0, 10); // Chỉ lấy 15 trận

            if (historyData.length > 0) {
              setGameHistory(historyData);
            }

            // Tìm đoạn useEffect có onAuthStateChanged và thêm vào dưới Phần 3:
// --- PHẦN 4: LẤY LỘ TRÌNH SÁCH (LIBRARIES) ---
const qLibraries = query(
  collection(db, "libraries"),
  where("userId", "==", user.uid)
);
const libSnapshot = await getDocs(qLibraries);
const libData = libSnapshot.docs.map(doc => ({
  ...doc.data(),
  id: doc.id
}));

if (libData.length > 0) {
  setLibraries(libData);
}

            console.log("Đã tải xong TỪ VỰNG, BỘ TỪ và LỊCH SỬ từ mây cho Hà!");
          } catch (error) {
            console.error("Lỗi lấy dữ liệu: ", error);
          }

          setIsCheckingAuth(false);
        } else {
          // --- KHI ĐĂNG XUẤT: Dọn dẹp data cũ ---
          setCurrentUser(null);
          setIsLoggedIn(false);
          setVocab(INITIAL_VOCAB);
          setSets(INITIAL_SETS); 
          setGameHistory([]); // <-- Nhớ thêm dòng này để xóa lịch sử cũ
          setIsCheckingAuth(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // <-- THÊM HÀM ĐĂNG XUẤT NÀY VÀO -->
  const handleLogout = () => {
    if (auth) signOut(auth);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };
  
  // LOGIC CHUỖI NGÀY HỌC (STREAK)
  const [streak, setStreak] = useState(1);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  const updateStreak = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (!lastStudyDate) {
      setStreak(1);
      setLastStudyDate(today);
      return;
    }

    const lastDate = new Date(lastStudyDate).getTime();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      setStreak(prev => prev + 1);
      setLastStudyDate(today);
    } else if (diffDays > 1) {
      setStreak(1);
      setLastStudyDate(today);
    }
  };

  const handleSimulateNextDay = () => {
    setLastStudyDate(prev => {
      const d = new Date(prev || Date.now());
      d.setDate(d.getDate() - 1);
      return d.getTime();
    });
    console.log("Đã lùi ngày học về hôm qua!");
  };

  const [gameHistory, setGameHistory] = useState([]);

  const [currentGame, setCurrentGame] = useState(null);
  const [currentSet, setCurrentSet] = useState(null);
  const [isAddMultipleOpen, setIsAddMultipleOpen] = useState(false);
  const [isSRSModalOpen, setIsSRSModalOpen] = useState(false);
  const [customSessionWords, setCustomSessionWords] = useState(null);
    const [gameSource, setGameSource] = useState(null);


  const handleToggleMastered = async (id) => {
    // 1. Tìm từ vựng đang được click
    const wordToUpdate = vocab.find(w => w.id === id);
    if (!wordToUpdate) return;

    // 2. Xác định trạng thái mới
    const isCurrentlyMastered = wordToUpdate.level === 5;
    const newLevel = isCurrentlyMastered ? 1 : 5;
    const newNextReview = isCurrentlyMastered ? 0 : Date.now() + LEVEL_INTERVALS[5];

    // 3. Cập nhật UI ngay lập tức để không bị giật lag
    setVocab(prev => prev.map(w => 
      w.id === id ? { ...w, level: newLevel, nextReview: newNextReview } : w
    ));

    // 4. Lặng lẽ lưu thay đổi lên đám mây (Firebase)
    try {
      await updateDoc(doc(db, "vocabularies", id), {
        level: newLevel,
        nextReview: newNextReview
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái Thuộc: ", error);
    }
  };

  const handleSaveGameResults = async (sessionResults) => {
    try {
      // 1. LƯU LỊCH SỬ GAME (Chung cho cả 2 loại game)
      const correctCount = sessionResults.filter(r => r.isCorrect).length;
      const accuracy = Math.round((correctCount / Math.max(1, sessionResults.length)) * 100);
      
      const newHistoryRecord = {
        userId: currentUser.uid,
        gameId: currentGame === 'srs' ? 'srs' : currentGame,
        date: Date.now(),
        accuracy: accuracy
      };

      const docRef = await addDoc(collection(db, "history"), newHistoryRecord);
      setGameHistory(prev => [{ ...newHistoryRecord, id: docRef.id }, ...prev].slice(0, 15));

      // 2. XỬ LÝ LƯU ĐIỂM TỪ VỰNG (Rẽ nhánh)
      if (gameSource?.type === 'library') {
        // --- TRƯỜNG HỢP: GAME TRONG SÁCH (LỘ TRÌNH HỌC) ---
        const { libraryId, chapterId } = gameSource;

        setLibraries(prevLibs => {
          const targetLib = prevLibs.find(l => l.id === libraryId);
          if (!targetLib) return prevLibs; // Đề phòng lỗi rỗng

          // 1. Quét qua các câu trả lời đúng và đổi trạng thái thành isMastered
          const chaptersToSave = targetLib.chapters.map(chap => {
            if (chap.id === chapterId) {
              const updatedWords = chap.words.map(w => {
                const res = sessionResults.find(r => r.word.id === w.id);
                if (res && res.isCorrect) {
                  return { ...w, isMastered: true, level: 5 };
                }
                return w;
              });
              return { ...chap, words: updatedWords };
            }
            return chap;
          });

          // 2. Lưu trực tiếp mảng mới này lên Firebase
          updateDoc(doc(db, "libraries", libraryId), { chapters: chaptersToSave })
            .then(() => console.log("Đã lưu kết quả Game vào Sách trên mây!"))
            .catch(error => console.error("Lỗi lưu Game Sách: ", error));

          // 3. Cập nhật lại giao diện
          return prevLibs.map(l =>
            l.id === libraryId ? { ...l, chapters: chaptersToSave } : l
          );
        });
      }

  
      
      else {
        // --- TRƯỜNG HỢP: GAME TỪ VỰNG CHUNG (Dưới local của Hà) ---
        const updatePromises = sessionResults.map(res => {
          const word = vocab.find(w => w.id === res.word.id);
          if (word) {
            let newLevel = res.isCorrect ? 5 : Math.max(1, (word.level || 1) - 1);
            const interval = LEVEL_INTERVALS[newLevel] || LEVEL_INTERVALS[1];
            return updateDoc(doc(db, "vocabularies", word.id), {
              level: newLevel,
              nextReview: Date.now() + interval,
              correctCount: res.isCorrect ? (word.correctCount || 0) + 1 : (word.correctCount || 0),
              wrongCount: !res.isCorrect ? (word.wrongCount || 0) + 1 : (word.wrongCount || 0)
            });
          }
          return null;
        }).filter(p => p !== null);

        await Promise.all(updatePromises);

        setVocab(prevVocab => {
          const updatedVocab = [...prevVocab];
          sessionResults.forEach(res => {
            const index = updatedVocab.findIndex(w => w.id === res.word.id);
            if (index !== -1) {
              const word = updatedVocab[index];
              let newLevel = res.isCorrect ? 5 : Math.max(1, (word.level || 1) - 1);
              const interval = LEVEL_INTERVALS[newLevel] || LEVEL_INTERVALS[1];
              updatedVocab[index] = { ...word, level: newLevel, nextReview: Date.now() + interval };
            }
          });
          return updatedVocab;
        });
      }

      console.log("Đã đồng bộ kết quả lên Firebase thành công!");
    } catch (e) {
      console.error("Lỗi đồng bộ lên mây: ", e);
      alert("Chưa lưu được lên đám mây, hãy kiểm tra mạng hoặc quyền truy cập!");
    }
  };

  // --- HÀM XỬ LÝ DỮ LIỆU TRÊN CLOUD (THAY THẾ CỤM CŨ CỦA HÀ) ---
  const handleBulkAction = async (action, wordIds) => {
    if (action === 'mastered') {
      try {
        // Cập nhật level 5 lên mây
        const updatePromises = wordIds.map(wordId => 
          updateDoc(doc(db, "vocabularies", wordId), { level: 5 })
        );
        await Promise.all(updatePromises);
        setVocab(prev => prev.map(w => wordIds.includes(w.id) ? { ...w, level: 5 } : w));
        console.log("Đã lưu trạng thái thuộc bài lên mây!");
      } catch (e) { console.error("Lỗi cập nhật:", e); }
    } 
    else if (action === 'delete') {
      try {
        // Xóa vĩnh viễn trên mây
        const deletePromises = wordIds.map(wordId => 
          deleteDoc(doc(db, "vocabularies", wordId))
        );
        await Promise.all(deletePromises);
        setVocab(prev => prev.filter(w => !wordIds.includes(w.id)));
        console.log("Đã xóa vĩnh viễn khỏi mây!");
      } catch (e) { console.error("Lỗi xóa từ:", e); }
    }
  };

  const handleCreateSet = async (newSet) => {
    try {
      delete newSet.id; // <--- Xóa cái ID giả do giao diện đẻ ra đi

      const setWithUser = {
        ...newSet,
        userId: currentUser.uid,
        wordIds: [],
        createdAt: new Date().getTime()
      };

      const docRef = await addDoc(collection(db, "sets"), setWithUser);
      setSets(prev => [...prev, { ...setWithUser, id: docRef.id }]);
      
      console.log("Đã tạo bộ từ thành công trên Firebase!");
      return docRef.id; // <--- QUAN TRỌNG: Trả về ID thật do Firebase cấp
    } catch (e) {
      console.error("Lỗi tạo bộ từ:", e);
    }
  };

  const handleDeleteSet = async (setId) => {
    try {
      // Xóa bộ từ trên mây
      await deleteDoc(doc(db, "sets", setId));
      setSets(prevSets => prevSets.filter(s => s.id !== setId));
      console.log("Đã xóa bộ từ trên mây!");
    } catch (e) { console.error("Lỗi xóa bộ từ:", e); }
  };


  const handleSaveMultiple = async (setId, newWords) => {
    try {
      // 1. Chuẩn bị dữ liệu từ vựng (Gắn dấu ấn của Hà vào)
      const formattedWords = newWords.map(w => ({
        ...w,
        userId: currentUser.uid, // <--- Bắt buộc phải có để Rules cho phép lưu
        level: 1,
        correctCount: 0,
        wrongCount: 0,
        createdAt: new Date().getTime()
      }));

      // 2. Lưu từng từ lên mây (bảng vocabularies)
      const savePromises = formattedWords.map(word => 
        addDoc(collection(db, "vocabularies"), word)
      );
      
      // Chờ Firebase lưu xong và lấy về các ID thật do Firebase cấp
      const docRefs = await Promise.all(savePromises);
      const newWordIds = docRefs.map(ref => ref.id); // Trích xuất mảng ID: ["AQz1...", "7jHk..."]

      // 3. BƯỚC QUAN TRỌNG: CẬP NHẬT ID VÀO BỘ TỪ (bảng sets)
      // Tìm bộ từ hiện tại để lấy các từ cũ (nếu có), tránh bị ghi đè mất
      const targetSet = sets.find(s => s.id === setId);
      const currentWordIds = targetSet?.wordIds || []; 
      
      // Gộp ID từ cũ và ID từ mới lại với nhau
      const updatedWordIds = [...currentWordIds, ...newWordIds];

      // Gửi lệnh cập nhật mảng wordIds lên bảng "sets"
      const setRef = doc(db, "sets", setId);
      await updateDoc(setRef, { 
        wordIds: updatedWordIds 
      });

      console.log("Đã lưu từ vựng và đưa vào bộ từ thành công!");
      window.location.reload(); // Ép load lại trang để hiển thị kết quả mới nhất
    } catch (error) {
      console.error("Lỗi khi lưu nhiều từ: ", error);
      alert("Có lỗi xảy ra khi lưu lên mây, Hà kiểm tra lại Console (F12) nhé!");
    }
  };

  const handleStartGame = (gameId) => {
    updateStreak();
    setCurrentGame(gameId);
  };

  const handleStartCustomGame = (gameId, words, source = null) => { 
    updateStreak();
    setCustomSessionWords(words);
    setCurrentGame(gameId);
    setGameSource(source);
  };

  if (isCheckingAuth) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-[#13151b]' : 'bg-gray-50'}`}>
         <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }

  // 1. TÁCH RIÊNG HÀM HIỂN THỊ GAME
  const renderGameContent = () => {
    if (!currentGame) return null;
    let gameSessionWords = customSessionWords || shuffleArray(vocab.filter(w => w.level < 5 || (w.nextReview && w.nextReview <= Date.now()))).slice(0, 5);
    
    if (gameSessionWords.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white space-y-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><Check size={48} strokeWidth={4}/></div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-widest`}>Tuyệt vời!</h2>
          <p className="text-gray-400 font-medium text-lg">Bạn đã học hết từ hiện có.</p>
          <button onClick={() => { setCurrentGame(null); setCustomSessionWords(null); setGameSource(null); }} className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl mt-4">Quay lại</button>
        </div>
      );
    }

    if (currentGame === 'flashcard') {
      return <FlashcardGame sessionWords={gameSessionWords} onFinish={(results) => { if (results && results.length > 0) handleSaveGameResults(results); setCurrentGame(null); setCustomSessionWords(null); setGameSource(null); }} onQuit={() => { setCurrentGame(null); setCustomSessionWords(null); setGameSource(null); }} isDarkMode={isDarkMode} />;
    }
    
    return <PracticeSession sessionWords={gameSessionWords} allVocab={vocab} gameType={currentGame === 'srs' ? 'mixed' : currentGame} subMode="en-vn" onFinish={() => {setCurrentGame(null); setCustomSessionWords(null); setGameSource(null);}} onQuit={() => {setCurrentGame(null); setCustomSessionWords(null); setGameSource(null);}} onUpdateMastered={handleSaveGameResults} isDarkMode={isDarkMode} />;
  };

  // 2. CẬP NHẬT RETURN CHÍNH (Sử dụng tuyệt chiêu "Ẩn" thay vì "Xóa")
  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#13151b] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden font-sans transition-colors duration-300`}>
      {!currentGame && <TopBar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} streak={streak} onLogout={handleLogout} user={currentUser}/>}
      <div className="flex-1 relative overflow-y-auto">
        
        {/* Chỉ hiện Game khi đang chơi */}
        {renderGameContent()}

        {/* ẨN CÁC TAB ĐI NẾU CÓ GAME (Giúp các tab không bị mất trí nhớ) */}
        <div className={currentGame ? "hidden" : "block"}>
          {activeTab === 'home' && <HomeTab vocab={vocab} onNavigate={setActiveTab} isDarkMode={isDarkMode} streak={streak} onSimulateNextDay={handleSimulateNextDay} />}
          {activeTab === 'sets' && <SetsTab sets={sets} vocab={vocab} onCreateSet={handleCreateSet} onDeleteSet={handleDeleteSet} onOpenSet={setCurrentSet} libraries={libraries} setLibraries={setLibraries} onStartCustomGame={handleStartCustomGame} isDarkMode={isDarkMode} />}
          {activeTab === 'vocab' && <VocabTab vocab={vocab} onToggleMastered={handleToggleMastered} onBulkAction={handleBulkAction} onOpenAddMultiple={() => setIsAddMultipleOpen(true)} isDarkMode={isDarkMode} onUpdateWord={handleUpdateWord} />}
          {activeTab === 'games' && <GamesTab vocab={vocab} sets={sets} onStartCustomGame={handleStartCustomGame} onOpenSRS={() => { updateStreak(); setIsSRSModalOpen(true); }} history={gameHistory} isDarkMode={isDarkMode} />}
        </div>

      </div>

      {isAddMultipleOpen && <AddMultipleWordsModal isDarkMode={isDarkMode} sets={sets} onClose={() => setIsAddMultipleOpen(false)} onSave={handleSaveMultiple} onCreateSet={handleCreateSet} />}
      {currentSet && <SetDetailModal isDarkMode={isDarkMode} set={currentSet} vocab={vocab} onClose={() => setCurrentSet(null)} onSave={handleSaveSet} onUpdateWord={handleUpdateWord} />}
      {isSRSModalOpen && <SRSOverviewModal isDarkMode={isDarkMode} vocab={vocab} sets={sets} onClose={() => setIsSRSModalOpen(false)} onStartReview={(words) => { setCustomSessionWords(words); setCurrentGame('srs'); setIsSRSModalOpen(false); }} />}
    </div>
  );
}