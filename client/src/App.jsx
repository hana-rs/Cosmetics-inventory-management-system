import { useState } from "react"
import { useEffect } from "react"

function App() {
  const [tasks, setTasks] = useState([])//tasksというステートを作成し、初期値は空の配列

   // 初期化処理をuseEffectで実行
   useEffect(() => {
    fetchTasks();  // ページ読み込み時にfetchTasksを呼び出す
  }, []);  // 空の配列を渡すことで、最初のレンダリング時にのみ実行

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:8000")//fetch関数を使って、サーバーにリクエストを送信
    const data = await response.json()
    setTasks(data)//setTasks関数を使って、dataをtasksにセット
  }

  const addTask = async () => {//addTask関数は、新しいタスクを追加するための関数
    const input = document.querySelector("input")//input要素を取得
    const response = await fetch("http://localhost:8000", {//fetch関数を使って、サーバーにリクエストを送信
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input.value,
        completed: 0,
      }),
    })
    const data = await response.json()

    if(response.status === 200){
      setTasks([...tasks, data])//setTasks関数を使って、tasksに新しいタスクを追加
      input.value = ""
      fetchTasks()
      
    }
  }

  return (
    <>
      <div>
        <h1>TODOLIST</h1>
        <input type="text" placeholder="Add task" />
        <button onClick={addTask}>add Tasks</button>
        <ul>
          {tasks.map((task) => (//tasksの中身を表示
            <li key={task.id}>
              <input type="checkbox" defaultChecked={task.completed} />
              {task.title}
              
            </li>

          ))}
        </ul>
      </div>
    </>
  )
}

export default App
