// localStorageService.js

// Fungsi untuk menyimpan data ke LocalStorage
export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Fungsi untuk mengambil data dari LocalStorage
export const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menghapus data dari LocalStorage
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
