import { useState } from "react";

const CosmeticApp = () => {
  // メイクカテゴリとアイテムのデータ
  const makeupCategories = {
    ベースメイク: ["日焼け止め", "下地", "フェイスパウダー"],
    アイメイク: ["アイシャドウ", "アイライナー", "マスカラ"],
    リップ: ["口紅", "リップグロス", "リップクリーム"],
  };

  const [selectedCategory, setSelectedCategory] = useState(""); // 一つ目のコンボボックス
  const [selectedItem, setSelectedItem] = useState(""); // 二つ目のコンボボックス

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItem(""); // リセット
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div>
      <h1>化粧品管理アプリ</h1>
      <label>
        メイクのカテゴリ:
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">選択してください</option>
          {Object.keys(makeupCategories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        メイクアイテム:
        <select
          value={selectedItem}
          onChange={handleItemChange}
          disabled={!selectedCategory}
        >
          <option value="">選択してください</option>
          {selectedCategory &&
            makeupCategories[selectedCategory].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
      </label>

      <div>
        <h2>選択されたアイテム:</h2>
        <p>{selectedCategory && `${selectedCategory} - ${selectedItem}`}</p>
      </div>
    </div>
  );
};

export default CosmeticApp;
