import { use } from "react";
import { useState, useEffect } from "react";

const CosmeticApp = () => {
  const [categories, setCategories] = useState([]); // カテゴリデータ
  const [items, setItems] = useState([]); // アイテムデータ
  const [selectedCategory, setSelectedCategory] = useState(""); // 選択されたカテゴリ
  const [selectedItem, setSelectedItem] = useState(""); // 選択されたアイテム


  useEffect(() => {
    // 初回レンダリング時にカテゴリデータを取得
    fetchMakeupCategories();
  }, []);

  

  // カテゴリデータを取得する関数
  const fetchMakeupCategories = async () => {
      const response = await fetch("http://localhost:8000/categories")
      const data = await response.json();
      setCategories(data)
      fetchItems(data.big_id)
  };

  // アイテムデータを取得する関数
  const fetchItems = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/middle_categories?big_id=${categoryId}`);
      const data = await response.json();
      setItems(data);
      
    } catch (error) {
      console.error("アイテムデータの取得中にエラーが発生しました:", error);
    }
  };

  

  const handleCategoryChange = (e) => {// カテゴリが変更されたときの処理
    const selected = e.target.value;
    setSelectedCategory(selected);
    setSelectedItem(""); // アイテムをリセット
    if (selected) {
      // カテゴリに基づいてアイテムを取得
      fetchItems(selected);
    }
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value); // 選択されたアイテムを更新
  };

  return (
    <div>
      <h1>登録</h1>
      <div>
        <label>大分類：</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">選択してください</option>
          console.log("categories")
          console.log(categories)
          {categories.map((category) => (
            <option key={category.big_id} value={category.big_id}>
              {category.content}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>中分類：</label>
        <select value={selectedItem} onChange={handleItemChange} disabled={!selectedCategory}>
          <option value="">選択してください</option>
          {items.map((item) => (
            <option>
              {item.content}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CosmeticApp;
