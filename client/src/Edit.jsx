import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [middlecategories, setMiddleCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState("");
  const [status, setStatus] = useState("unopened");
  const [openDate, setOpenDate] = useState("");
  const [item, setItem] = useState({
    item_name: "",
    item_memo: "",
    item_count: 0,
  });

  useEffect(() => {
    fetchMakeupCategories();
    fetchItemData();
  }, []);

  const fetchItemData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/items/${id}`);
      if (!response.ok) throw new Error("アイテムデータの取得に失敗しました");
      const data = await response.json();
      setItem({
        item_name: data.item_name,
        item_memo: data.item_memo,
        item_count: data.item_count,
      });
      setSelectedCategory(data.big_id);
      setSelectedMiddleCategory(data.middle_id);
      setStatus(data.item_opened ? "opened" : "unopened");
      setOpenDate(data.item_opened_date || "");
      fetchMiddleCategories(data.big_id);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchMakeupCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("カテゴリデータの取得中にエラーが発生しました:", error);
    }
  };

  const fetchMiddleCategories = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/middle_categories?big_id=${categoryId}`);
      const data = await response.json();
      setMiddleCategories(data);
    } catch (error) {
      console.error("中分類データの取得中にエラーが発生しました:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    setSelectedMiddleCategory("");
    if (selected) {
      fetchMiddleCategories(selected);
    }
  };

  const handleMiddleCategoryChange = (e) => {
    setSelectedMiddleCategory(e.target.value);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setItem({ ...item, [id]: value });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    setOpenDate(e.target.value);
  };

  const handleEditItem = async () => {
    const updatedItem = {
      big_id: selectedCategory,
      middle_id: selectedMiddleCategory,
      item_name: item.item_name,
      item_memo: item.item_memo,
      item_count: item.item_count,
      item_opened: status === "opened" ? 1 : 0,
      item_opened_date: status === "opened" ? openDate : null,
    };

    try {
      const response = await fetch(`http://localhost:8000/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        alert("登録しました");
        navigate("/list");
      } else {
        throw new Error("登録に失敗しました");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm("削除してもよろしいですか？")) {
      try {
        const response = await fetch(`http://localhost:8000/items/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("削除しました");
          navigate("/list");
        } else {
          throw new Error("削除に失敗しました");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="edit-item-container">
      <h2 className="edit-item-title">アイテムを編集</h2>

      <div className="form-group">
        <label className="form-label">大分類：</label>
        <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.big_id} value={category.big_id}>
              {category.content}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">中分類：</label>
        <select
          className="form-select"
          value={selectedMiddleCategory}
          onChange={handleMiddleCategoryChange}
          disabled={!selectedCategory}
        >
          <option value="">選択してください</option>
          {middlecategories.map((item) => (
            <option key={item.middle_id} value={item.middle_id}>
              {item.content}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">アイテム名：</label>
        <input
          className="form-input"
          type="text"
          id="item_name"
          value={item.item_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">色番号：</label>
        <input
          className="form-input"
          type="text"
          id="item_memo"
          value={item.item_memo}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">在庫数：</label>
        <input
          className="form-input"
          type="number"
          min="1"
          step="1"
          id="item_count"
          value={item.item_count}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">開封日：</label>
        <div className="form-radio-group">
          <label className="form-radio-label">
            <input
              type="radio"
              value="unopened"
              checked={status === "unopened"}
              onChange={handleStatusChange}
            />
            未開封
          </label>
          <label className="form-radio-label">
            <input
              type="radio"
              value="opened"
              checked={status === "opened"}
              onChange={handleStatusChange}
            />
            開封済
          </label>
        </div>
        <div>
          <label className="form-label">
            開封した日：
            <input
              className="form-input"
              type="date"
              value={openDate}
              onChange={handleDateChange}
              disabled={status === "unopened"}
            />
          </label>
        </div>
      </div>

      <button className="form-button" onClick={handleEditItem}>保存</button>
      <button className="form-button" onClick={handleDeleteItem}>削除</button>
    </div>
  );
};

export default EditItem;
