import { useState } from "react"
import { useEffect } from "react"
//List.cssをインポート
import "./List.css";

function App() {
  const [items, setitems] = useState([])//tasksというステートを作成し、初期値は空の配列

   // 初期化処理をuseEffectで実行
   useEffect(() => {
    fetchitems();  // ページ読み込み時にfetchTasksを呼び出す
  }, []);  // 空の配列を渡すことで、最初のレンダリング時にのみ実行

  const fetchitems = async () => {
    const response = await fetch("http://localhost:8000/items")//fetch関数を使って、サーバーにリクエストを送信
    const data = await response.json()
    setitems(data)//setTasks関数を使って、dataをtasksにセット
  }

  //item_countを追加する関数
  const add_item_count = async (itemId) => {
    const response = await fetch("http://localhost:8000/items/add", {//fetch関数を使って、サーバーにリクエストを送信
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemId,
      }),
    })
    const data = await response.json()

    if(response.status === 200){
      setitems([...items, data])//setTasks関数を使って、tasksに新しいタスクを追加
      fetchitems()
    }
  }

  //item_countを減らす関数
  const dec_item_count = async (itemId) => {
    const response = await fetch("http://localhost:8000/items/dec", {//fetch関数を使って、サーバーにリクエストを送信
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemId,
      }),
    })
    const data = await response.json()

    if(response.status === 200){
      setitems([...items, data])//setTasks関数を使って、tasksに新しいタスクを追加
      fetchitems()
    }
  }

  //item_openedを更新する関数
  const item_open = async (itemId) => {
    const response = await fetch("http://localhost:8000/items/open", {//fetch関数を使って、サーバーにリクエストを送信
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: itemId,
      }),
    })
    const data = await response.json()

    if(response.status === 200){
      setitems([...items, data])//setTasks関数を使って、tasksに新しいタスクを追加
      fetchitems()
    }
  }

  //itemをソートする関数
  const sortitems = async () => {
    const response = await fetch("http://localhost:8000/items_sort")
    const data = await response.json()
    setitems(data)//setTasks関数を使って、dataをtasksにセット
  }

  //Edit.jsxに遷移する関数
  const handleEdit = (itemId) => {
    window.location.href = `http://localhost:5173/edit/${itemId}`
  }

  return (
    <>
      <div>
        <h1>LIST</h1>
        <button onClick={sortitems}>ソート</button>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div className="item-category">
              <div className="item-name">{item.item_name}</div> 
              <div className="item-memo">{item.item_memo}</div> 
              </div>
              <div className="item-count">在庫数:{item.item_count}</div>
              {item.item_opened !== 0 && (
                <> 
                <div className="opened_limited">
                  <div className="item-opened-date">開封日：{item.item_opened_date}</div> 
                  <div className="item-limited-date">期限日：{item.item_limited_date}</div> 
                </div>
                </>
              )}
             
              <div className="button-group">
              {item.item_opened !== 0 && (
                <> 
                    <button onClick={() => dec_item_count(item.id)}>使い切った</button>
                </>
              )}
                {item.item_opened === 0 && item.item_count !== 0 && (
                <> 
                  <button onClick={() => item_open(item.id)}>使用開始</button>
                </>
              )}
                <button onClick={() => handleEdit(item.id)}>編集</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
