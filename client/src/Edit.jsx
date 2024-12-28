import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditItem = () => {
  const { id } = useParams(); // URLパラメータから編集対象のIDを取得
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [middlecategories, setMiddleCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchCategories(); // 大分類データを取得
    fetchItemData(); // 編集対象データを取得
  }, []);

  // 大分類データを取得する関数
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/categories");
      if (!response.ok) throw new Error("大分類データの取得に失敗しました");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      alert(error.message);
    }
  };

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

  // 中分類データを取得する関数
  const fetchMiddleCategories = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/middle_categories?big_id=${categoryId}`);
      if (!response.ok) throw new Error("中分類データの取得に失敗しました");
      const data = await response.json();
      setMiddleCategories(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // 入力変更時のハンドラ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  // 大分類変更時のハンドラ
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setItem({ ...item, big_id: selected, middle_id: "" });
    if (selected) fetchMiddleCategories(selected);
  };

  // 保存ボタン押下時のハンドラ
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        alert("編集が完了しました");
        navigate("/list");
      } else {
        alert("編集に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
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
          onChange={handleInputChange}
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
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </button>
    </div>
  );
};

export default EditItem;
