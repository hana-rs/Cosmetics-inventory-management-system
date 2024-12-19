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
      content TEXT NOT NULL
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

// データの挿入
const insertMiddleCategories = db.prepare(`
INSERT OR IGNORE INTO middle_categories (middle_id, big_id, content) VALUES
  (1, 1, '日焼け止め'),
  (2, 1, '下地'),
  (3, 1, 'リキッドファンデーション'),
  (4, 1, 'パウダーファンデーション'),
  (5, 1, 'コンシーラー'),
  (6, 1, 'BBクリーム'),
  (7, 1, 'フェイスパウダー'),
  (8, 2, 'アイシャドウ'),
  (9, 2, 'アイライナー'),
  (10, 3, 'アイブロウ'),
  (11, 3, '眉マスカラ'),
  (12, 4, 'マスカラ'),
  (13, 5, 'チーク'),
  (14, 5, 'クリームチーク'),
  (15, 6, 'フェイスシャドウ'),
  (16, 7, 'ハイライト'),
  (17, 8, 'リップ'),
  (18, 8, 'リップグロス'),
  (19, 9, '化粧水'),
  (20, 9, '美容液'),
  (21, 9, '乳液'),
  (22, 9, 'パック'),
  (23, 10, 'クレンジングオイル'),
  (24, 10, 'クレンジングリキッド'),
  (25, 11, 'メイクキープミスト'),
  (26, 11, 'その他');
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

// サーバー起動
serve({
  fetch: app.fetch,
  port: 8000,
});
