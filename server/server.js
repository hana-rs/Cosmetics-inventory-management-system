import Database from 'better-sqlite3';
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception';
import { cors } from "hono/cors";

const app = new Hono();
const db = new Database('cosme.db');

// CORSの設定
app.use(cors({ origin: "*" }));

const big_id = [
    { big_id: 1, content: "ベースメイク" },
    { big_id: 2, content: "アイメイク" },
    { big_id: 3, content: "眉メイク" },
    { big_id: 4, content: "まつ毛メイク" },
    { big_id: 5, content: "チーク" },
    { big_id: 6, content: "シャドウ" },
    { big_id: 7, content: "ハイライト" },
    { big_id: 8, content: "リップメイク" },
    { big_id: 9, content: "スキンケア" },
    { big_id: 10, content: "メイク落とし" },
    { big_id: 11, content: "その他" },
  ];
  
  const middle_id = [
    { big_id: 1, middle_id: 1, content: "日焼け止め" },
    { big_id: 1, middle_id: 2, content: "下地" },
    { big_id: 1, middle_id: 3, content: "リキッドファンデーション" },
    { big_id: 1, middle_id: 4, content: "パウダーファンデーション" },
    { big_id: 1, middle_id: 5, content: "コンシーラー" },
    { big_id: 1, middle_id: 6, content: "BBクリーム" },
    { big_id: 1, middle_id: 7, content: "フェイスパウダー" },
    { big_id: 2, middle_id: 8, content: "アイシャドウ" },
    { big_id: 2, middle_id: 9, content: "アイライナー" },
    { big_id: 3, middle_id: 10, content: "アイブロウ" },
    { big_id: 3, middle_id: 11, content: "眉マスカラ" },
    { big_id: 4, middle_id: 12, content: "マスカラ" },
    { big_id: 5, middle_id: 13, content: "チーク" },
    { big_id: 5, middle_id: 14, content: "クリームチーク" },
    { big_id: 6, middle_id: 15, content: "フェイスシャドウ" },
    { big_id: 7, middle_id: 16, content: "ハイライト" },
    { big_id: 8, middle_id: 17, content: "リップ" },
    { big_id: 8, middle_id: 18, content: "リップグロス" },
    { big_id: 9, middle_id: 19, content: "化粧水" },
    { big_id: 9, middle_id: 20, content: "美容液" },
    { big_id: 9, middle_id: 21, content: "乳液" },
    { big_id: 9, middle_id: 22, content: "パック" },
    { big_id: 10, middle_id: 23, content: "クレンジングオイル" },
    { big_id: 10, middle_id: 24, content: "クレンジングリキッド" },
    { big_id: 11, middle_id: 25, content: "メイクキープミスト" },
    { big_id: 11, middle_id: 26, content: "その他" },
  ];

  const limited_time = [
    { middle_id: 1, limited: 180 }, // 日焼け止め：6ヶ月
    { middle_id: 2, limited: 180 }, // 下地：6ヶ月
    { middle_id: 3, limited: 365 }, // リキッドファンデーション：1年
    { middle_id: 4, limited: 365 }, // パウダーファンデーション：1年
    { middle_id: 5, limited: 365 }, // コンシーラー：1年
    { middle_id: 6, limited: 365 }, // BBクリーム：1年
    { middle_id: 7, limited: 365 }, // フェイスパウダー：1年
    { middle_id: 8, limited: 365 }, // アイシャドウ：1年
    { middle_id: 9, limited: 90 },  // アイライナー：3ヶ月
    { middle_id: 10, limited: 365 }, // アイブロウ：1年
    { middle_id: 11, limited: 365 }, // 眉マスカラ：1年
    { middle_id: 12, limited: 90 },  // マスカラ：3ヶ月
    { middle_id: 13, limited: 365 }, // チーク：1年
    { middle_id: 14, limited: 365 }, // クリームチーク：1年
    { middle_id: 15, limited: 365 }, // フェイスシャドウ：1年
    { middle_id: 16, limited: 365 }, // ハイライト：1年
    { middle_id: 17, limited: 180 }, // リップ：6ヶ月
    { middle_id: 18, limited: 180 }, // リップグロス：6ヶ月
    { middle_id: 19, limited: 120 }, // 化粧水：4ヶ月
    { middle_id: 20, limited: 120 }, // 美容液：4ヶ月
    { middle_id: 21, limited: 120 }, // 乳液：4ヶ月
    { middle_id: 22, limited: 120 }, // パック：4ヶ月
    { middle_id: 23, limited: 180 }, // クレンジングオイル：6ヶ月
    { middle_id: 24, limited: 180 }, // クレンジングリキッド：6ヶ月
    { middle_id: 25, limited: 180 }, // メイクキープミスト：6ヶ月
    { middle_id: 26, limited: 180 }, // その他：6ヶ月
  ];
  


const createitemsTableQuery = db.prepare(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        big_id INTEGER,
        middle_id INTEGER,
        limited INTEGER,
        item_name TEXT,
        item_memo TEXT,
        item_count INTEGER,
        item_opened INTEGER NOT NULL DEFAULT 0,
        item_opened_date DATE,
        );
    `);

createitemsTableQuery.run();

const gettasksQuery = db.prepare(`
  SELECT * FROM tasks;
  `);

app.get("/", (c) => {
  const todoList = gettasksQuery.all();
  return c.json(todoList, 200);//c.json(todoList, 200)は、todoListをJSON形式で返すという意味
});

const insertTaskQuery = db.prepare(`
  INSERT INTO tasks (title,checked) VALUES (?,?);
  `);

app.post("/", async (c) => {//c.req.json()は、リクエストのボディをJSON形式で返すという意味
  const param = await c.req.json();

  if (!param.title) {//titleがない場合はエラーを返す
    throw new HTTPException(400, { message: "Title is required" });
  }

  const newTodo = {
    checked: param.checked ? 1 : 0,
    title: param.title,
  };

 
  insertTaskQuery.run(newTodo.title, newTodo.checked);
  return c.json({ message: "Successfully created" }, 200);
});

serve({
  fetch: app.fetch,
  port: 8000,
});


