export interface CardSetting {
  id?: number; // 不重複id
  class?: string; // item排版
  size?: string; // 元件尺寸
  type?: string; // 元件名稱
  page?: string; // 所屬頁面
  name?: string; // 標題
  tips?: string; // 說明
  data?: any; // 所需資料
  edit?: boolean; // 自定義開啟/關閉
  hasLarge?: boolean; // 放大檢視
}
