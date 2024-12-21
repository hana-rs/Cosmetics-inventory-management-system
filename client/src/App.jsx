import { useState } from "react"
import { useEffect } from "react"

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

  // const addTask = async () => {//addTask関数は、新しいタスクを追加するための関数
  //   const input = document.querySelector("input")//input要素を取得
  //   const response = await fetch("http://localhost:8000", {//fetch関数を使って、サーバーにリクエストを送信
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title: input.value,
  //       completed: 0,
  //     }),
  //   })
  //   const data = await response.json()

  //   if(response.status === 200){
  //     setTasks([...tasks, data])//setTasks関数を使って、tasksに新しいタスクを追加
  //     input.value = ""
  //     fetchTasks()
      
  //   }
  // }

  return (
    <>
      <div>
        <h1>LIST</h1>
        <button onClick={fetchitems}>リストを取得</button>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.item_name} {item.item_memo} 在庫数:{item.item_count}
              <button onClick={() => add_item_count(item.id)}>在庫を追加</button>
              {item.item_opened !== 0 && (
                <> 開封日：{item.item_opened_date} 期限日：{item.item_limited_date}</>    
              )}
              <button onClick={() => dec_item_count(item.id)}>使い切った</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
