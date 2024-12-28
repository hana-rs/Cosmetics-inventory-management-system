import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditItem = () => {
  const { id } = useParams(); // URLパラメータから編集対象のIDを取得
  const navigate = useNavigate();
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


  const [item, setItem] = useState({
    big_id: "",
    middle_id: "",
    item_name: "",
    item_memo: "",
    item_count: 0,
    item_opened: 0,
    item_opened_date: "",
  });

  useEffect(() => {
    fetchMakeupCategories(); // 大分類データを取得
    fetchItemData(); // 編集対象データを取得
  }, []);

  // 編集対象データを取得する関数
  const fetchItemData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/items/${id}`);
      if (!response.ok) throw new Error("アイテムデータの取得に失敗しました");
      const data = await response.json();
      setItem({
        big_id: data.big_id,
        middle_id: data.middle_id,
        item_name: data.item_name,
        item_memo: data.item_memo,
        item_count: data.item_count,
        item_opened: data.item_opened,
        item_opened_date: data.item_opened_date,
      });
      fetchMiddleCategories(data.big_id); // 中分類データを取得
    } catch (error) {
      alert(error.message);
    }
  };
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

  // 入力変更時のハンドラ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  // 保存ボタン押下時のハンドラ
  const handleEditItem = async () => {
    // ステート `item` を基にデータを作成
    const updatedItem = {
      big_id: selectedCategory || item.big_id, // 選択されたカテゴリまたは既存の値
      middle_id: selectedMiddleCategory || item.middle_id, // 選択された中分類または既存の値
      item_name: item.item_name, // ステートの `item_name`
      item_memo: item.item_memo, // ステートの `item_memo`
      item_count: item.item_count, // ステートの `item_count`
      item_opened: status === "opened" ? 1 : 0, // ステータスに基づくフラグ
      item_opened_date: status === "opened" ? openDate : null, // 状態に応じた開封日
    };
  
    try {
      const response = await fetch(`http://localhost:8000/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem), // JSON に変換
      });
  
      if (response.ok) {
        alert("登録しました");
        navigate("/list"); // リストページにリダイレクト
      } else {
        throw new Error("登録に失敗しました");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div>
      <h1>編集</h1>
      <div>
        <label>大分類：</label>
        <select name="big_id" value={item.big_id} onChange={handleCategoryChange}>
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
        <select
          name="middle_id"
          value={item.middle_id}
          onChange={handleMiddleCategoryChange}
          disabled={!item.big_id}
        >
          <option value="">選択してください</option>
          {middlecategories.map((middle) => (
            <option key={middle.middle_id} value={middle.middle_id}>
              {middle.content}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>アイテム名：</label>
        <input
          type="text"
          name="item_name"
          value={item.item_name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>色番号：</label>
        <input
          type="text"
          name="item_memo"
          value={item.item_memo}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>在庫数：</label>
        <input
          type="number"
          name="item_count"
          min="1"
          value={item.item_count}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>開封日：</label>
        <div>
          <label>
            <input
              type="radio"
              name="item_opened"
              value={0}
              checked={item.item_opened === 0}
              onChange={() => setItem({ ...item, item_opened: 0 })}
            />
            未開封
          </label>
          <label>
            <input
              type="radio"
              name="item_opened"
              value={1}
              checked={item.item_opened === 1}
              onChange={() => setItem({ ...item, item_opened: 1 })}
            />
            開封済
          </label>
        </div>
        <div>
          <label>
            開封した日：
            <input
              type="date"
              name="item_opened_date"
              value={item.item_opened_date || ""}
              onChange={handleInputChange}
              disabled={item.item_opened !== 1}
            />
          </label>
        </div>
      </div>
      <button onClick={handleEditItem}>
        保存
      </button>
    </div>
  );
};

export default EditItem;
