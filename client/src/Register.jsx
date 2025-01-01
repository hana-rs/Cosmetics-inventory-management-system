import { useState, useEffect } from "react";
import "./Register.css";

const CosmeticApp = () => {
  const [categories, setCategories] = useState([]); // カテゴリデータ
  const [middlecategories, setMiddleCategories] = useState([]); // アイテムデータ
  const [selectedCategory, setSelectedCategory] = useState(""); // 選択されたカテゴリ
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState(""); // 選択されたアイテム
  const [status, setStatus] = useState('unopened'); // デフォルトは未開封
  const [openDate, setOpenDate] = useState('');

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    setOpenDate(e.target.value);
  };

  useEffect(() => {
    // 初回レンダリング時にカテゴリデータを取得
    fetchMakeupCategories();
  }, []);

  

  // カテゴリデータを取得する関数
  const fetchMakeupCategories = async () => {
      const response = await fetch("http://localhost:8000/categories")
      const data = await response.json();
      setCategories(data)
      fetchMiddleCategories(data.big_id)
  };

  // アイテムデータを取得する関数
  const fetchMiddleCategories = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/middle_categories?big_id=${categoryId}`);
      const data = await response.json();
      setMiddleCategories(data);
      
    } catch (error) {
      console.error("アイテムデータの取得中にエラーが発生しました:", error);
    }
  };

  const handleCategoryChange = (e) => {// カテゴリが変更されたときの処理
    const selected = e.target.value;
    setSelectedCategory(selected);
    setSelectedMiddleCategory(""); // アイテムをリセット
    if (selected) {
      fetchMiddleCategories(selected); // 選択されたカテゴリに対応するアイテムを取得
    }
  };

  const handleMiddleCategoryChange = (e) => {
    setSelectedMiddleCategory(e.target.value); // 選択されたアイテムを更新
  };

  const handleAddItem = async () => {
    // アイテムを追加する処理
    const item = {
      big_id: selectedCategory,
      middle_id: selectedMiddleCategory,
      item_name: document.getElementById('itemName').value,
      item_memo: document.getElementById('itemMemo').value,
      item_count: document.getElementById('itemCount').value,
      item_opened: status === 'opened' ? 1 : 0,
      item_opened_date: status === 'opened' ? openDate : null,
    };

    const response = await fetch('http://localhost:8000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (response.status === 200) {
      alert('登録しました');
    } else {
      alert('登録に失敗しました');
    }
  }

  

  return (
    <div>
      <h1>登録</h1>
      <div>
        <label>大分類：</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.big_id} value={category.big_id}>
              {category.content}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>中分類：</label>
        <select value={selectedMiddleCategory} onChange={handleMiddleCategoryChange} disabled={!selectedCategory}>
          <option value="">選択してください</option>
          {middlecategories.map((item) => (
            <option key={item.middle_id} value={item.middle_id}>
              {item.content}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>アイテム名：</label>
        <input type="text" id="itemName" />
      </div>
      <div>
        <label>色番号：</label>
        <input type="text" id="itemMemo" />
      </div>
      <div>
        <label>在庫数：</label>
        <input type="number" min="1" step="1" id="itemCount" />
      </div>
      <div>
        <label>開封日：</label>
        <div>
          <label>
            <input
              type="radio"
              value="unopened"
              checked={status === 'unopened'}
              onChange={handleStatusChange}
            />
            未開封
          </label>
          <label>
            <input
              type="radio"
              value="opened"
              checked={status === 'opened'}
              onChange={handleStatusChange}
            />
            開封済
          </label>
        </div>
        <div>
          <label>
            開封した日：
            <input
              type="date"
              value={openDate}
              onChange={handleDateChange}
              disabled={status === 'unopened'}
            />
          </label>
        </div>
      </div>
      <button onClick={handleAddItem}>
        登録
      </button>
    </div>
  );
};

export default CosmeticApp;
