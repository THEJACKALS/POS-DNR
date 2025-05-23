import React, { useState, useEffect, useRef } from 'react';
import './Style.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from './localStorageService';
import { downloadJSON } from './downloadUtils';
import { uploadJSONFile } from './uploadUtils';


// Localization strings
const locales = {
  en: {
    tabProducts: "Products",
    tabCart: "Cart",
    tabTransactions: "Transactions",
    tabReports: "Reports",
    tabNotes: "Notes",
    headerProducts: "Product & Inventory Management",
    headerAddEditProduct: "Add / Edit Product",
    labelSKU: "SKU / Code",
    labelName: "Name",
    labelPrice: "Price",
    labelStockQty: "Stock Quantity",
    buttonSaveProduct: "Save Product",
    buttonCancel: "Cancel",
    headerInventory: "Product Inventory",
    headerSKU: "SKU",
    headerName: "Name",
    headerPrice: "Price",
    headerStock: "Stock",
    headerActions: "Actions",
    headerCart: "Transaction & Cart",
    headerCartItems: "Cart Items",
    headerQuantity: "Quantity",
    headerSubtotal: "Subtotal",
    buttonClearCart: "Clear Cart",
    headerAddProductToCart: "Add Product to Cart",
    labelChooseProduct: "Choose Product",
    labelQuantity: "Quantity",
    buttonAddToCart: "Add to Cart",
    textTotal: "Total:",
    labelPayAmount: "Pay Amount",
    buttonPayPrint: "Pay & Print Receipt",
    changeLabel: "Change:",
    headerTransactions: "Transaction History",
    headerID: "ID",
    headerDateTime: "Date & Time",
    headerTotalItems: "Total Items",
    headerTotalAmount: "Total Amount",
    headerNote: "Note",
    buttonClearTransactions: "Clear Transaction History",
    headerReports: "Sales Reports",
    headerSummary: "Summary",
    textTotalSalesAmount: "Total Sales Amount:",
    textTotalTransactions: "Total Transactions:",
    textTotalProductsSold: "Total Products Sold:",
    headerTopSellingProducts: "Top Selling Products",
    headerQuantitySold: "Quantity Sold",
    headerTotalRevenue: "Total Revenue",
    headerNotesManager: "Notes Manager",
    headerAddNote: "Add Note",
    labelNote: "Note",
    buttonSaveNote: "Save Note",
    headerSavedNotes: "Saved Notes",
    remove: "Remove",
    delete: "Delete",
    updateProduct: "Update Product",
    productNotFound: "Product not found",
    selectProductFirst: "Please select a product",
    quantityAtLeastOne: "Quantity must be at least 1",
    quantityExceedsStock: "Quantity exceeds available stock",
    totalQuantityExceedsStock: "Total quantity in cart exceeds available stock",
    cartEmpty: "Cart is empty.",
    insufficientPayment: "Insufficient payment amount.",
    popupBlocked: "Popup blocked. Please allow popups for this site to print receipt.",
    confirmDeleteProduct: "Delete this product? This cannot be undone.",
    confirmClearCart: "Are you sure you want to clear the cart?",
    confirmClearTransactions: "Are you sure you want to clear all transaction history?",
    confirmDeleteNote: "Delete this note?",
    noProductsFound: "No products found",
    noTransactions: "No transactions yet",
    noSales: "No sales yet",
    noNotesSaved: "No notes saved",
    cartAlreadyEmpty: "Cart is already empty.",
    noteCannotBeEmpty: "Note cannot be empty.",
    thankYouPurchase: "Thank you for your purchase!",
  },
  id: {
    tabProducts: "Produk",
    tabCart: "Keranjang",
    tabTransactions: "Transaksi",
    tabReports: "Laporan",
    tabNotes: "Catatan",
    headerProducts: "Manajemen Produk & Inventori",
    headerAddEditProduct: "Tambah / Edit Produk",
    labelSKU: "SKU / Kode",
    labelName: "Nama",
    labelPrice: "Harga",
    labelStockQty: "Jumlah Stok",
    buttonSaveProduct: "Simpan Produk",
    buttonCancel: "Batal",
    headerInventory: "Inventori Produk",
    headerSKU: "SKU",
    headerName: "Nama",
    headerPrice: "Harga",
    headerStock: "Stok",
    headerActions: "Aksi",
    headerCart: "Transaksi & Keranjang",
    headerCartItems: "Item Keranjang",
    headerQuantity: "Kuantitas",
    headerSubtotal: "Sub Total",
    buttonClearCart: "Kosongkan Keranjang",
    headerAddProductToCart: "Tambah Produk ke Keranjang",
    labelChooseProduct: "Pilih Produk",
    labelQuantity: "Jumlah",
    buttonAddToCart: "Tambah ke Keranjang",
    textTotal: "Total:",
    labelPayAmount: "Jumlah Bayar",
    buttonPayPrint: "Bayar & Cetak Struk",
    changeLabel: "Kembalian:",
    headerTransactions: "Riwayat Transaksi",
    headerID: "ID",
    headerDateTime: "Tanggal & Waktu",
    headerTotalItems: "Total Item",
    headerTotalAmount: "Total Bayar",
    headerNote: "Catatan",
    buttonClearTransactions: "Hapus Riwayat Transaksi",
    headerReports: "Laporan Penjualan",
    headerSummary: "Ringkasan",
    textTotalSalesAmount: "Jumlah Total Penjualan:",
    textTotalTransactions: "Total Transaksi:",
    textTotalProductsSold: "Total Produk Terjual:",
    headerTopSellingProducts: "Produk Terlaris",
    headerQuantitySold: "Kuantitas Terjual",
    headerTotalRevenue: "Total Pendapatan",
    headerNotesManager: "Manajer Catatan",
    headerAddNote: "Tambah Catatan",
    labelNote: "Catatan",
    buttonSaveNote: "Simpan Catatan",
    headerSavedNotes: "Catatan Disimpan",
    remove: "Hapus",
    delete: "Hapus",
    updateProduct: "Perbarui Produk",
    productNotFound: "Produk tidak ditemukan",
    selectProductFirst: "Pilih produk terlebih dahulu",
    quantityAtLeastOne: "Jumlah harus minimal 1",
    quantityExceedsStock: "Jumlah melebihi stok tersedia",
    totalQuantityExceedsStock: "Jumlah total dalam keranjang melebihi stok tersedia",
    cartEmpty: "Keranjang kosong.",
    insufficientPayment: "Jumlah bayar tidak cukup.",
    popupBlocked: "Popup diblokir. Izinkan popup untuk mencetak struk.",
    confirmDeleteProduct: "Hapus produk ini? Tindakan ini tidak bisa dibatalkan.",
    confirmClearCart: "Apakah Anda yakin ingin mengosongkan keranjang?",
    confirmClearTransactions: "Apakah Anda yakin ingin menghapus semua riwayat transaksi?",
    confirmDeleteNote: "Hapus catatan ini?",
    noProductsFound: "Tidak ada produk ditemukan",
    noTransactions: "Tidak ada transaksi",
    noSales: "Belum ada penjualan",
    noNotesSaved: "Tidak ada catatan",
    cartAlreadyEmpty: "Keranjang sudah kosong.",
    noteCannotBeEmpty: "Catatan tidak boleh kosong.",
    thankYouPurchase: "Terima kasih atas pembelian Anda!",
  }
};

// Format currency for Indonesian Rupiah
function formatCurrency(num) {
  if (typeof num !== 'number') num = Number(num);
  if (isNaN(num)) num = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num).replace(/\D00$/, '');
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function formatDateTime(date, lang) {
  return new Date(date).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US');
}

const POS = () => {
  // State variables
  const [currentLang, setCurrentLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  // State variables
  const [products, setProducts] = useState(getFromLocalStorage('pos_products'));
  const [transactions, setTransactions] = useState(getFromLocalStorage('pos_transactions'));
  const [notes, setNotes] = useState(getFromLocalStorage('pos_notes'));
  const [cart, setCart] = useState([]);

  // Product form state
  const [productForm, setProductForm] = useState({
    id: '',
    sku: '',
    name: '',
    price: '',
    stock: ''
  });

  // Product search filter
  const [productSearch, setProductSearch] = useState('');

  // Cart product search input and dropdown
  const [cartProductSearch, setCartProductSearch] = useState('');
  const [cartProductDropdownVisible, setCartProductDropdownVisible] = useState(false);
  const [filteredCartProducts, setFilteredCartProducts] = useState([]);
  const [selectedCartProductId, setSelectedCartProductId] = useState(null);
  const [cartProductQty, setCartProductQty] = useState(1);

  // Pay amount input
  const [payAmount, setPayAmount] = useState('');

  // Settings menu visibility
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);

  // Note form text
  const [noteText, setNoteText] = useState('');

  // Refs for click outside detection
  const cartProductsDropdownRef = useRef(null);
  const cartProductSearchInputRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const settingsBtnRef = useRef(null);

  // Effect: Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('pos_products')) || [];
    const storedTransactions = JSON.parse(localStorage.getItem('pos_transactions')) || [];
    const storedNotes = JSON.parse(localStorage.getItem('pos_notes')) || [];
    const storedSettings = JSON.parse(localStorage.getItem('pos_settings')) || { lang: 'en', darkMode: false };

    setProducts(storedProducts);
    setTransactions(storedTransactions);
    setNotes(storedNotes);
    setCurrentLang(storedSettings.lang || 'en');
    setDarkMode(storedSettings.darkMode || false);

    if (storedSettings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Effect: Save data to localStorage when relevant state changes
  useEffect(() => {
    saveToLocalStorage('pos_products', products);
  }, [products]);
  useEffect(() => {
    saveToLocalStorage('pos_transactions', transactions);
  }, [transactions]);
  useEffect(() => {
    saveToLocalStorage('pos_notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('pos_settings', JSON.stringify({ lang: currentLang, darkMode }));
  }, [currentLang, darkMode]);

  // Effect: Update document attribute for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Effect: Filter cart products dropdown based on search input
  useEffect(() => {
    if (cartProductSearch.trim() === '') {
      setFilteredCartProducts([]);
      setCartProductDropdownVisible(false);
      setSelectedCartProductId(null);
      return;
    }
    const lowerFilter = cartProductSearch.toLowerCase();
    const filtered = products.filter(p => p.stock > 0 && (p.name.toLowerCase().includes(lowerFilter) || p.sku.toLowerCase().includes(lowerFilter)));
    setFilteredCartProducts(filtered);
    setCartProductDropdownVisible(filtered.length > 0);
  }, [cartProductSearch, products]);

  // Handlers

  // Language change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setCurrentLang(lang);
  };

  // Dark mode toggle
  const handleDarkModeToggle = (e) => {
    setDarkMode(e.target.checked);
  };

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear cart product selection when switching to cart tab
    if (tab === 'cart') {
      clearCartProductSelection();
      setCartProductSearch('');
      setCartProductQty(1);
    }
  };

  // Product form input change
  const handleProductFormChange = (e) => {
    const { id, value } = e.target;
    setProductForm(prev => ({ ...prev, [id.replace('product-', '')]: value }));
  };

  // Clear product form
  const clearProductForm = () => {
    setProductForm({ id: '', sku: '', name: '', price: '', stock: '' });
  };

  // Submit product form (add or edit)
  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    const { id, sku, name, price, stock } = productForm;
    if (!sku.trim() || !name.trim() || price === '' || stock === '') return;

    // Validate SKU uniqueness except for editing
    const skuExists = products.some(p => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== id);
    if (skuExists) {
      alert(currentLang === 'id' ? 'SKU harus unik.' : 'SKU must be unique.');
      return;
    }

    if (id) {
      // Edit existing product
      setProducts(prev => prev.map(p => p.id === id ? { id, sku, name, price: parseFloat(price), stock: parseInt(stock) } : p));
    } else {
      // Add new product
      const newId = generateId();
      setProducts(prev => [...prev, { id: newId, sku, name, price: parseFloat(price), stock: parseInt(stock) }]);
    }
    clearProductForm();
  };

  // Cancel product form
  const handleProductFormCancel = () => {
    clearProductForm();
  };

  // Edit product from list
  const handleEditProduct = (id) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      setProductForm({
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        price: prod.price,
        stock: prod.stock
      });
      // Scroll to form
      document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Delete product from list
  const handleDeleteProduct = (id) => {
    if (window.confirm(locales[currentLang].confirmDeleteProduct)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setCart(prev => prev.filter(item => item.productId !== id));
    }
  };

  // Product search input change
  const handleProductSearchChange = (e) => {
    setProductSearch(e.target.value);
  };

  // Filtered products for product list
  const filteredProducts = products.filter(p =>
    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Cart product search input change
  const handleCartProductSearchChange = (e) => {
    setCartProductSearch(e.target.value);
    setSelectedCartProductId(null);
  };

  // Select product from cart dropdown
  const selectCartProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCartProductSearch(`${product.sku} - ${product.name}`);
      setSelectedCartProductId(product.id);
      setCartProductDropdownVisible(false);
    }
  };

  // Clear cart product selection
  const clearCartProductSelection = () => {
    setCartProductSearch('');
    setSelectedCartProductId(null);
  };

  // Add to cart button click
  const handleAddToCart = () => {
    if (!selectedCartProductId) {
      alert(locales[currentLang].selectProductFirst);
      return;
    }
    const qty = parseInt(cartProductQty);
    if (isNaN(qty) || qty < 1) {
      alert(locales[currentLang].quantityAtLeastOne);
      return;
    }
    const product = products.find(p => p.id === selectedCartProductId);
    if (!product) {
      alert(locales[currentLang].productNotFound);
      return;
    }
    if (qty > product.stock) {
      alert(locales[currentLang].quantityExceedsStock);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.productId === selectedCartProductId);
      if (existing) {
        if (existing.quantity + qty > product.stock) {
          alert(locales[currentLang].totalQuantityExceedsStock);
          return prev;
        }
        return prev.map(item => item.productId === selectedCartProductId ? { ...item, quantity: item.quantity + qty } : item);
      } else {
        return [...prev, { productId: selectedCartProductId, quantity: qty }];
      }
    });
    clearCartProductSelection();
    setCartProductQty(1);
  };

  // Clear cart button click
  const handleClearCart = () => {
    if (cart.length === 0) {
      alert(locales[currentLang].cartAlreadyEmpty);
      return;
    }
    if (window.confirm(locales[currentLang].confirmClearCart)) {
      setCart([]);
      setPayAmount('');
    }
  };

  // Cart quantity change
  const handleCartQuantityChange = (productId, value) => {
    let val = parseInt(value);
    if (isNaN(val) || val < 1) val = 1;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (val > product.stock) val = product.stock;
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: val } : item));
  };

  // Remove cart item
  const handleRemoveCartItem = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Pay amount input change
  const handlePayAmountChange = (e) => {
    setPayAmount(e.target.value);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return acc;
    return acc + product.price * item.quantity;
  }, 0);

  // Calculate change
  const payAmountNum = parseFloat(payAmount);
  const change = !isNaN(payAmountNum) && payAmountNum >= cartTotal ? payAmountNum - cartTotal : 0;

  // Pay & Print Receipt
  const handlePayAndPrint = () => {
    if (cart.length === 0) {
      alert(locales[currentLang].cartEmpty);
      return;
    }
    if (isNaN(payAmountNum) || payAmountNum < cartTotal) {
      alert(locales[currentLang].insufficientPayment);
      return;
    }
    // Check stock availability
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;
      if (item.quantity > product.stock) {
        alert((currentLang === 'id' ? 'Stok tidak cukup untuk produk ' : 'Insufficient stock for product ') + `${product.sku} - ${product.name}.`);
        return;
      }
    }
    // Update stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    }));
    // Create transaction record
    const transaction = {
      id: generateId().toUpperCase(),
      date: new Date().toISOString(),
      items: cart.map(ci => ({ productId: ci.productId, quantity: ci.quantity })),
      totalItems: cart.reduce((acc, ci) => acc + ci.quantity, 0),
      totalAmount: cartTotal,
      note: ''
    };
    setTransactions(prev => [...prev, transaction]);
    // Clear cart and payment inputs
    setCart([]);
    setPayAmount('');
    // Print receipt
    printReceipt(transaction, payAmountNum);
  };

  // Print receipt function
  const printReceipt = (transaction, payAmount) => {
    const txDate = formatDateTime(transaction.date, currentLang);
    let itemsHtml = '';
    transaction.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      const subtotal = product.price * item.quantity;
      itemsHtml += `
        <tr>
          <td style="padding:4px;">${product.sku}</td>
          <td style="padding:4px;">${product.name}</td>
          <td style="padding:4px; text-align:right;">${item.quantity}</td>
          <td style="padding:4px; text-align:right;">${formatCurrency(product.price)}</td>
          <td style="padding:4px; text-align:right;">${formatCurrency(subtotal)}</td>
        </tr>
      `;
    });
    const changeAmount = payAmount - transaction.totalAmount;
    const html = `
      <!DOCTYPE html>
      <html lang="${currentLang}">
      <head>
        <title>Receipt - ${transaction.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 1em; color: #333; }
          h2, h4 { margin: 0.2em 0; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #444; padding: 6px 8px; }
          th { background: ${darkMode ? '#4db6ac' : '#2a9d8f'}; color: white; }
          .center { text-align: center; }
          .right { text-align: right; }
          .footer { margin-top: 2em; font-size: 0.85em; color: #666; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h2>${currentLang === 'id' ? 'Struk POS' : 'POS Receipt'}</h2>
        <div>${currentLang === 'id' ? 'ID Transaksi' : 'Transaction ID'}: <strong>${transaction.id}</strong></div>
        <div>${currentLang === 'id' ? 'Tanggal' : 'Date'}: <strong>${txDate}</strong></div>
        <hr />
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>${currentLang === 'id' ? 'Nama' : 'Name'}</th>
              <th class="right">${currentLang === 'id' ? 'Jumlah' : 'Qty'}</th>
              <th class="right">${currentLang === 'id' ? 'Harga' : 'Price'}</th>
              <th class="right">${currentLang === 'id' ? 'Subtotal' : 'Subtotal'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="right"><strong>${currentLang === 'id' ? 'Total' : 'Total'}</strong></td>
              <td class="right"><strong>${formatCurrency(transaction.totalAmount)}</strong></td>
            </tr>
            <tr>
              <td colspan="4" class="right">${currentLang === 'id' ? 'Bayar' : 'Paid'}</td>
              <td class="right">${formatCurrency(payAmount)}</td>
            </tr>
            <tr>
              <td colspan="4" class="right">${currentLang === 'id' ? 'Kembalian' : 'Change'}</td>
              <td class="right">${formatCurrency(changeAmount)}</td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <div class="footer center">
          ${locales[currentLang].thankYouPurchase}
        </div>
        <button onclick="window.print();">${currentLang === 'id' ? 'Cetak Struk' : 'Print Receipt'}</button>
      </body>
      </html>
    `;
    const printWindow = window.open('', 'PrintReceipt', 'width=400,height=600');
    if (!printWindow) {
      alert(locales[currentLang].popupBlocked);
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Clear transactions
  const handleClearTransactions = () => {
    if (window.confirm(locales[currentLang].confirmClearTransactions)) {
      setTransactions([]);
    }
  };

  // Note form submit
  const handleNoteFormSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      alert(locales[currentLang].noteCannotBeEmpty);
      return;
    }
    const newNote = {
      id: generateId(),
      text: noteText.trim(),
      date: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
    setNoteText('');
  };

  // Delete note
  const handleDeleteNote = (id) => {
    if (window.confirm(locales[currentLang].confirmDeleteNote)) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  // Click outside handlers for dropdowns and menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartProductsDropdownRef.current && !cartProductsDropdownRef.current.contains(event.target) &&
          cartProductSearchInputRef.current && event.target !== cartProductSearchInputRef.current) {
        setCartProductDropdownVisible(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target) &&
          settingsBtnRef.current && event.target !== settingsBtnRef.current) {
        setSettingsMenuVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Toggle settings menu
  const toggleSettingsMenu = () => {
    setSettingsMenuVisible(prev => !prev);
  };

  // Render functions for tabs content

  // Products tab content
  const renderProductsTab = () => {
    const handleDownloadProducts = () => {
      downloadJSON(products, 'products.json');
    };

    const handleUploadProducts = () => {
      uploadJSONFile((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          alert(currentLang === 'id' ? 'Produk berhasil diunggah.' : 'Products uploaded successfully.');
        } else {
          alert(currentLang === 'id' ? 'Format file tidak valid.' : 'Invalid file format.');
        }
      });
    };

    return (
      <>
        <h2>{locales[currentLang].headerProducts}</h2>
        <div className="flex-row" style={{ position: 'relative' }}>
          <div className="flex-1-3">
            <div className="section-box">
              <h3>{locales[currentLang].headerAddEditProduct}</h3>
              <form id="product-form" onSubmit={handleProductFormSubmit}>
                <input type="hidden" id="id" value={productForm.id} />
                <label htmlFor="sku">{locales[currentLang].labelSKU}</label>
                <input type="text" id="sku" value={productForm.sku} onChange={handleProductFormChange} placeholder={currentLang === 'id' ? 'Kode unik' : 'Unique code'} required />
                <label htmlFor="name">{locales[currentLang].labelName}</label>
                <input type="text" id="name" value={productForm.name} onChange={handleProductFormChange} placeholder={currentLang === 'id' ? 'Nama produk' : 'Product name'} required />
                <label htmlFor="price">{locales[currentLang].labelPrice}</label>
                <input type="number" id="price" min="0" step="0.01" value={productForm.price} onChange={handleProductFormChange} required />
                <label htmlFor="stock">{locales[currentLang].labelStockQty}</label>
                <input type="number" id="stock" min="0" step="1" value={productForm.stock} onChange={handleProductFormChange} required />
                <div style={{ marginTop: '1em', textAlign: 'right' }}>
                  <button type="submit">{productForm.id ? locales[currentLang].updateProduct : locales[currentLang].buttonSaveProduct}</button>
                  <button type="button" onClick={handleProductFormCancel} style={{ background: '#777', marginLeft: '0.5em' }}>{locales[currentLang].buttonCancel}</button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex-2-3" style={{ position: 'relative' }}>
            <div className="section-box" style={{ overflowX: 'auto', paddingBottom: '3em' }}>
              <h3>{locales[currentLang].headerInventory}</h3>
              <input type="search" id="product-search" placeholder={currentLang === 'id' ? 'Cari produk…' : 'Search products…'} aria-label="Search products" value={productSearch} onChange={handleProductSearchChange} />
              <table id="product-list-table" aria-label="Product inventory list" tabIndex="0">
                <thead>
                  <tr>
                    <th>{locales[currentLang].headerSKU}</th>
                    <th>{locales[currentLang].headerName}</th>
                    <th>{locales[currentLang].headerPrice}</th>
                    <th>{locales[currentLang].headerStock}</th>
                    <th>{locales[currentLang].headerActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>{locales[currentLang].noProductsFound}</td></tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.sku}</td>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button className="small-btn" onClick={() => handleEditProduct(product.id)}>{locales[currentLang].updateProduct}</button>
                          <button className="small-btn danger product-delete-btn" onClick={() => handleDeleteProduct(product.id)}>{locales[currentLang].delete}</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <button
                onClick={handleDownloadProducts}
                className="product-download-btn"
              >
                {currentLang === 'id' ? 'Unduh JSON' : 'Download JSON'}
              </button>
              <button
                onClick={handleUploadProducts}
                className="product-upload-btn"
              >
                {currentLang === 'id' ? 'Unggah JSON' : 'Upload JSON'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Cart tab content
  const renderCartTab = () => (
    <>
      <h2>{locales[currentLang].headerCart}</h2>
      <div className="flex-row">
        <div className="flex-2-3">
          <div className="section-box" style={{ overflowX: 'auto' }}>
            <h3>{locales[currentLang].headerCartItems}</h3>
            <table id="cart-table" aria-label="Cart items" tabIndex="0">
              <thead>
                <tr>
                  <th>{locales[currentLang].headerSKU}</th>
                  <th>{locales[currentLang].headerName}</th>
                  <th>{locales[currentLang].headerPrice}</th>
                  <th>{locales[currentLang].headerQuantity}</th>
                  <th>{locales[currentLang].headerSubtotal}</th>
                  <th>{locales[currentLang].headerActions}</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>{locales[currentLang].cartEmpty}</td></tr>
                ) : (
                  cart.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    const subtotal = product.price * item.quantity;
                    return (
                      <tr key={item.productId}>
                        <td>{product.sku}</td>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max={product.stock + item.quantity}
                            className="cart-item-qty-input"
                            value={item.quantity}
                            onChange={(e) => handleCartQuantityChange(item.productId, e.target.value)}
                          />
                        </td>
                        <td>{formatCurrency(subtotal)}</td>
                        <td>
                          <button className="small-btn danger" onClick={() => handleRemoveCartItem(item.productId)}>{locales[currentLang].remove}</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <button id="clear-cart-btn" style={{ marginTop: '0.8em', background: '#888' }} onClick={handleClearCart}>{locales[currentLang].buttonClearCart}</button>
        </div>
        <div className="flex-1-3">
          <div className="section-box">
            <h3>{locales[currentLang].headerAddProductToCart}</h3>
            <label htmlFor="cart-product-search-input">{locales[currentLang].labelChooseProduct}</label>
            <input
              type="text"
              id="cart-product-search-input"
              placeholder={currentLang === 'id' ? 'Cari atau pilih produk' : 'Search or select product'}
              autoComplete="off"
              aria-autocomplete="list"
              aria-label={currentLang === 'id' ? 'Cari atau pilih produk' : 'Select or search product'}
              value={cartProductSearch}
              onChange={handleCartProductSearchChange}
              onFocus={() => { if (filteredCartProducts.length > 0) setCartProductDropdownVisible(true); }}
              ref={cartProductSearchInputRef}
            />
            {cartProductDropdownVisible && (
              <div
                id="cart-products-dropdown"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  position: 'relative',
                  background: 'var(--color-bg-alt)',
                  display: 'block',
                  zIndex: 1000
                }}
                ref={cartProductsDropdownRef}
              >
                {filteredCartProducts.length === 0 ? (
                  <div style={{ padding: '6px 8px', color: '#777' }}>{currentLang === 'id' ? 'Tidak ada produk cocok' : 'No matching products'}</div>
                ) : (
                  filteredCartProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      tabIndex={0}
                      style={{
                        padding: '6px 8px',
                        cursor: 'pointer',
                        borderBottom: idx === filteredCartProducts.length - 1 ? 'none' : '1px solid #ccc'
                      }}
                      onClick={() => selectCartProduct(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectCartProduct(p.id);
                        }
                      }}
                    >
                      {`${p.sku} - ${p.name} | ${formatCurrency(p.price)} | Stock: ${p.stock}`}
                    </div>
                  ))
                )}
              </div>
            )}
            <label htmlFor="cart-product-qty">{locales[currentLang].labelQuantity}</label>
            <input
              type="number"
              id="cart-product-qty"
              min="1"
              value={cartProductQty}
              onChange={(e) => setCartProductQty(e.target.value)}
              required
            />
            <div style={{ marginTop: '1em' }}>
              <button type="button" id="add-to-cart-btn" disabled={!selectedCartProductId} onClick={handleAddToCart}>{locales[currentLang].buttonAddToCart}</button>
            </div>
            <hr />
            <div>
              <strong>{locales[currentLang].textTotal}</strong> <span id="cart-total">{formatCurrency(cartTotal)}</span>
            </div>
            <hr />
            <div>
              <label htmlFor="pay-amount">{locales[currentLang].labelPayAmount}</label>
              <input
                type="number"
                id="pay-amount"
                min="0"
                step="0.01"
                value={payAmount}
                onChange={handlePayAmountChange}
              />
            </div>
            <div style={{ marginTop: '0.5em', fontWeight: 600, color: 'var(--color-primary)' }} id="change-display">
              {locales[currentLang].changeLabel}: {formatCurrency(change)}
            </div>
            <div style={{ marginTop: '0.5em' }}>
              <button id="pay-btn" disabled={cart.length === 0 || isNaN(payAmountNum) || payAmountNum < cartTotal} onClick={handlePayAndPrint}>{locales[currentLang].buttonPayPrint}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Transactions tab content
  const renderTransactionsTab = () => (
    <>
      <h2>{locales[currentLang].headerTransactions}</h2>
      <div className="section-box" style={{ overflowX: 'auto' }}>
        <table id="transaction-list-table" aria-label="Transaction history" tabIndex="0">
          <thead>
            <tr>
              <th>{locales[currentLang].headerID}</th>
              <th>{locales[currentLang].headerDateTime}</th>
              <th>{locales[currentLang].headerTotalItems}</th>
              <th>{locales[currentLang].headerTotalAmount}</th>
              <th>{locales[currentLang].headerNote}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>{locales[currentLang].noTransactions}</td></tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{formatDateTime(tx.date, currentLang)}</td>
                  <td>{tx.totalItems}</td>
                  <td>{formatCurrency(tx.totalAmount)}</td>
                  <td>{tx.note || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1em' }}>
        <button id="clear-transactions-btn" style={{ background: '#e63946' }} onClick={handleClearTransactions}>{locales[currentLang].buttonClearTransactions}</button>
      </div>
    </>
  );

  // Reports tab content
  const renderReportsTab = () => {
    // Summary calculations
    let totalSalesAmount = 0;
    let totalProductsSold = 0;
    transactions.forEach(tx => {
      totalSalesAmount += tx.totalAmount;
      totalProductsSold += tx.totalItems;
    });

    // Top selling products calculations
    let productSalesMap = new Map();
    transactions.forEach(tx => {
      tx.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) return;
        const existing = productSalesMap.get(item.productId) || { product: prod, qtySold: 0, revenue: 0 };
        existing.qtySold += item.quantity;
        existing.revenue += item.quantity * prod.price;
        productSalesMap.set(item.productId, existing);
      });
    });

    const sortedProducts = Array.from(productSalesMap.values()).sort((a, b) => b.qtySold - a.qtySold);

    return (
      <>
        <h2>{locales[currentLang].headerReports}</h2>
        <div className="section-box">
          <h3>{locales[currentLang].headerSummary}</h3>
          <div><span>{locales[currentLang].textTotalSalesAmount}</span> <span id="report-total-sales">{formatCurrency(totalSalesAmount)}</span></div>
          <div><span>{locales[currentLang].textTotalTransactions}</span> <span id="report-total-transactions">{transactions.length}</span></div>
          <div><span>{locales[currentLang].textTotalProductsSold}</span> <span id="report-total-products-sold">{totalProductsSold}</span></div>
        </div>
        <div className="section-box" style={{ overflowX: 'auto', marginTop: '1em' }}>
          <h3>{locales[currentLang].headerTopSellingProducts}</h3>
          <table id="report-top-products-table" aria-label="Top selling products">
            <thead>
              <tr>
                <th>{locales[currentLang].headerSKU}</th>
                <th>{locales[currentLang].headerName}</th>
                <th>{locales[currentLang].headerQuantitySold}</th>
                <th>{locales[currentLang].headerTotalRevenue}</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>{locales[currentLang].noSales}</td></tr>
              ) : (
                sortedProducts.map(p => (
                  <tr key={p.product.id}>
                    <td>{p.product.sku}</td>
                    <td>{p.product.name}</td>
                    <td>{p.qtySold}</td>
                    <td>{formatCurrency(p.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Notes tab content
  const renderNotesTab = () => (
    <>
      <h2>{locales[currentLang].headerNotesManager}</h2>
      <div className="flex-row">
        <div className="flex-1-3">
          <div className="section-box">
            <h3>{locales[currentLang].headerAddNote}</h3>
            <form id="note-form" onSubmit={handleNoteFormSubmit}>
              <label htmlFor="note-text">{locales[currentLang].labelNote}</label>
              <textarea
                id="note-text"
                rows="5"
                placeholder={currentLang === 'id' ? 'Tulis catatan di sini...' : 'Write your note here...'}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                required
              />
              <div style={{ marginTop: '1em', textAlign: 'right' }}>
                <button type="submit">{locales[currentLang].buttonSaveNote}</button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-2-3">
          <div className="section-box" style={{ overflowX: 'auto' }}>
            <h3>{locales[currentLang].headerSavedNotes}</h3>
            <table id="notes-list-table" aria-label="Saved notes">
              <thead>
                <tr>
                  <th>{locales[currentLang].headerDate}</th>
                  <th>{locales[currentLang].headerNote}</th>
                  <th>{locales[currentLang].headerActions}</th>
                </tr>
              </thead>
              <tbody>
                {notes.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>{locales[currentLang].noNotesSaved}</td></tr>
                ) : (
                  notes.map(note => (
                    <tr key={note.id}>
                      <td>{formatDateTime(note.date, currentLang)}</td>
                      <td>{note.text}</td>
                      <td>
                        <button className="small-btn danger" onClick={() => handleDeleteNote(note.id)}>{locales[currentLang].delete}</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header style={{ fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontSize: '3rem', fontWeight: '900' }}>DNR POS</div>
        <button
          id="settings-btn"
          title="Settings"
          aria-label="Open settings"
          style={{ fontSize: '1.5em', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={toggleSettingsMenu}
          ref={settingsBtnRef}
          aria-expanded={settingsMenuVisible}
        >
          🛠️
        </button>
      {settingsMenuVisible && (
        <div
          id="settings-menu"
          aria-hidden={!settingsMenuVisible}
          role="dialog"
          aria-modal="true"
          aria-label="Settings menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          ref={settingsMenuRef}
          onClick={(e) => {
            if (e.target.id === 'settings-menu') {
              setSettingsMenuVisible(false);
            }
          }}
        >
          <div
            style={{
              background: 'var(--color-bg-alt)',
              borderRadius: '12px',
              padding: '1.5em 2em',
              width: '280px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              color: 'var(--color-text)',
              userSelect: 'none',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1em', color: 'var(--color-primary-dark)' }}>
              {currentLang === 'id' ? 'Pengaturan' : 'Settings'}
            </h2>
            <div style={{ marginBottom: '1.2em' }}>
              <label htmlFor="language-select" style={{ fontWeight: '700', display: 'block', marginBottom: '0.4em', color: 'var(--color-primary-dark)' }}>
                {currentLang === 'id' ? 'Bahasa' : 'Language'}
              </label>
              <select
                id="language-select"
                value={currentLang}
                onChange={handleLanguageChange}
                aria-describedby="language-select-desc"
                style={{
                  width: '100%',
                  padding: '0.4em 0.6em',
                  borderRadius: '6px',
                  border: '1.5px solid var(--color-border)',
                  fontWeight: '500',
                  fontSize: '1em',
                  transition: 'border-color var(--transition-speed), box-shadow var(--transition-speed)',
                }}
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
              <div id="language-select-desc" style={{ fontSize: '0.8em', color: '#666', marginTop: '-0.6em' }}>
                {currentLang === 'id' ? 'Pilih bahasa' : 'Select language'}
              </div>
            </div>
            <div>
              <label htmlFor="dark-mode-toggle" style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5em', cursor: 'pointer', color: 'var(--color-primary-dark)' }}>
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                {currentLang === 'id' ? 'Mode Gelap' : 'Dark Mode'}
              </label>
            </div>
            <div style={{ marginTop: '1.5em', textAlign: 'right' }}>
              <button onClick={() => setSettingsMenuVisible(false)} style={{ background: 'var(--color-primary)', color: 'white', padding: '0.5em 1em', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                {currentLang === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
            <button
              onClick={() => alert('About Dev\n\nVersion: 1.0.0.0\nAuthor: Dima')}
              style={{
                marginTop: '1.5em',
                width: '100%',
                background: 'var(--color-primary)',
                color: 'white',
                padding: '0.5em 1em',
                borderRadius: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                textAlign: 'center',
              }}
            >
              About Dev
            </button>
          </div>
        </div>
      )}
      </header>
      <nav>
        {['products', 'cart', 'transactions', 'reports', 'notes'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            data-tab={tab}
            onClick={() => handleTabChange(tab)}
          >
            {locales[currentLang][`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`]}
          </button>
        ))}
      </nav>
      <main>
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'cart' && renderCartTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'notes' && renderNotesTab()}
      </main>
    </>
  );
};

export default POS;
