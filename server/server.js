import Database from 'better-sqlite3';
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
const db = new Database('cosme.db');

// CORSの設定
app.use(cors({ origin: "*" }));

// categories テーブルを作成
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
      big_id INTEGER PRIMARY KEY,
      content TEXT NOT NULL
  );
`);
createTable.run();

// middle_cattegories テーブルを作成
const createMiddleCategoriesTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS middle_categories (
      middle_id INTEGER PRIMARY KEY,
      big_id INTEGER,
      content TEXT NOT NULL,
      limited INTEGER
  );
`);
createMiddleCategoriesTable.run();

// categories を取得するクエリ
const getCategoriesQuery = db.prepare(`
  SELECT * FROM categories;
`);

// データの挿入
const insertCategories = db.prepare(`
  INSERT OR IGNORE INTO categories (big_id, content) VALUES
  (1, 'ベースメイク'),
  (2, 'アイメイク'),
  (3, '眉メイク'),
  (4, 'まつ毛メイク'),
  (5, 'チーク'),
  (6, 'シャドウ'),
  (7, 'ハイライト'),
  (8, 'リップメイク'),
  (9, 'スキンケア'),
  (10, 'メイク落とし'),
  (11, 'その他');
`);
insertCategories.run();

// middle_categories を取得するクエリ
const getMiddleCategoriesQuery = db.prepare(`
  SELECT * FROM middle_categories WHERE big_id = @big_id;
`);


const getLimitedQuery = db.prepare(`
  SELECT limited FROM middle_categories WHERE middle_id = @middle_id;
`);

// データの挿入
const insertMiddleCategories = db.prepare(`
INSERT OR IGNORE INTO middle_categories (middle_id, big_id, content, limited) VALUES
  (1, 1, '日焼け止め', 180),
  (2, 1, '下地', 180),
  (3, 1, 'リキッドファンデーション', 365),
  (4, 1, 'パウダーファンデーション', 365),
  (5, 1, 'コンシーラー', 365),
  (6, 1, 'BBクリーム', 365),
  (7, 1, 'フェイスパウダー', 365),
  (8, 2, 'アイシャドウ', 365),
  (9, 2, 'アイライナー', 90),
  (10, 3, 'アイブロウ', 365),
  (11, 3, '眉マスカラ', 365),
  (12, 4, 'マスカラ', 90),
  (13, 5, 'チーク', 365),
  (14, 5, 'クリームチーク', 365),
  (15, 6, 'フェイスシャドウ', 365),
  (16, 7, 'ハイライト', 365),
  (17, 8, 'リップ', 180),
  (18, 8, 'リップグロス', 180),
  (19, 9, '化粧水', 120),
  (20, 9, '美容液', 120),
  (21, 9, '乳液', 120),
  (22, 9, 'パック', 120),
  (23, 10, 'クレンジングオイル', 180),
  (24, 10, 'クレンジングリキッド', 180),
  (25, 11, 'メイクキープミスト', 180),
  (26, 11, 'その他', 180);
`);
insertMiddleCategories.run();
  

console.log('テーブルとデータが正常に作成されました。');

// items テーブルの作成
const createItemsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      big_id INTEGER,
      middle_id INTEGER,
      limited INTEGER,
      item_name TEXT,
      item_memo TEXT,
      item_count INTEGER,
      item_opened INTEGER NOT NULL DEFAULT 0,
      item_opened_date DATE
  );
`);
createItemsTable.run();



// categories エンドポイント
app.get("/categories", async (c) => {
  try {
    console.log('カテゴリデータを取得します。');
    const categories = getCategoriesQuery.all();  // カテゴリを取得
    return c.json(categories, 200);  // ステータスコードと一緒にレスポンス
    
  } catch (error) {
    console.error('カテゴリデータの取得エラー:', error);
    return c.json({ error: 'カテゴリデータの取得中にエラーが発生しました' }, 500);
  }
});

// middle_categories エンドポイント
app.get("/middle_categories", async (c) => {
  try {
    console.log('中カテゴリデータを取得します。');
    const bigId = c.req.query("big_id"); // フロントエンドから送信されたbig_idを取得
    console.log(`big_id: ${bigId}`);

    const middleCategories = getMiddleCategoriesQuery.all({ big_id: bigId });// 中カテゴリを取得
    return c.json(middleCategories, 200);  // ステータスコードと一緒にレスポンス
  } catch (error) {
    console.error('中カテゴリデータの取得エラー:', error);
    return c.json({ error: '中カテゴリデータの取得中にエラーが発生しました' }, 500);
  }
});

// items エンドポイント
app.get("/items", async (c) => {
  try {
    console.log('アイテムデータを取得します。');
    const items = db.prepare(`
      SELECT * FROM items;
    `).all();  // アイテムデータを取得
    return c.json(items, 200);  // ステータスコードと一緒にレスポンス
  } catch (error) {
    console.error('アイテムデータの取得エラー:', error);
    return c.json({ error: 'アイテムデータの取得中にエラーが発生しました' }, 500);
  }
});

app.post("/items", async (c) => {
  try {
    console.log('アイテムデータを登録します。');
    const item = await c.req.json();  // リクエストボディを取得
    console.log(item);

    const insertItem = db.prepare(`
      INSERT INTO items (big_id, middle_id, item_name, item_count, item_opened, item_opened_date)
      VALUES (@big_id, @middle_id, @item_name, @item_count, @item_opened, @item_opened_date);
    `);
   
    const limitedResult = getLimitedQuery.get({ middle_id: item.middle_id });
    item.limited = limitedResult ? limitedResult.limited : 0;

    insertItem.run({
      ...item,
      limited: item.limited, // 明示的にlimitedをセット
    });

    return c.json({ message: 'アイテムデータを登録しました' }, 200);  // ステータスコードと一緒にレスポンス
  } catch (error) {
    console.error('アイテムデータの登録エラー:', error);
    return c.json({ error: 'アイテムデータの登録中にエラーが発生しました' }, 500);
  }
});


// サーバー起動
serve({
  fetch: app.fetch,
  port: 8000,
});
