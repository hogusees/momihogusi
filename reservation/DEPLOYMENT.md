# 予約フォーム デプロイ手順

## 📋 概要

この予約フォームをWebサーバーにアップロードして、LINEリッチメニューから連携させる手順です。

## 🚀 デプロイ手順

### **ステップ1: ファイルの準備**

現在のファイル構成：
```
reservation/
├── index.html          # メインのペライチページ
├── styles.css          # スタイルシート
├── script.js           # JavaScript機能
├── config.js           # 設定ファイル
└── README.md           # 説明書
```

### **ステップ2: Webサーバーの選択**

以下のいずれかの方法で公開します：

#### **方法A: GitHub Pages（無料・推奨）**
1. GitHubアカウントを作成
2. 新しいリポジトリを作成
3. ファイルをアップロード
4. GitHub Pagesを有効化

#### **方法B: Netlify（無料・簡単）**
1. Netlifyアカウントを作成
2. ファイルをドラッグ&ドロップでアップロード
3. 自動でURLが生成される

#### **方法C: レンタルサーバー**
1. 既存のWebサーバーにFTPでアップロード
2. ドメインを設定

### **ステップ3: 設定ファイルの調整**

`config.js`を開いて、必要に応じて設定を変更：

```javascript
const CONFIG = {
    LINE: {
        OFFICIAL_ACCOUNT_ID: '@あなたの公式アカウントID',
        RICH_MENU: {
            FROM_RICH_MENU: true,
            SEND_TO: 'user'  // 'user' = 予約者のトークに送信
        }
    }
};
```

### **ステップ4: 動作確認**

1. アップロード完了後、公開URLにアクセス
2. 予約フォームが正常に表示されるか確認
3. 「予約をLINEに送信」ボタンをテスト

## 📱 GitHub Pages 詳細手順

### **1. GitHubアカウント作成**
- [GitHub.com](https://github.com) にアクセス
- 「Sign up」でアカウント作成

### **2. リポジトリ作成**
- 「New repository」をクリック
- リポジトリ名: `dancestudiovanz-reservation`
- Public を選択
- 「Create repository」をクリック

### **3. ファイルアップロード**
- 「uploading an existing file」をクリック
- 予約フォームの全ファイルをドラッグ&ドロップ
- 「Commit changes」をクリック

### **4. GitHub Pages有効化**
- リポジトリの「Settings」タブをクリック
- 左メニューの「Pages」をクリック
- Source で「Deploy from a branch」を選択
- Branch で「main」を選択
- 「Save」をクリック

### **5. URL確認**
- 数分後に以下のURLでアクセス可能：
  `https://あなたのユーザー名.github.io/dancestudiovanz-reservation/`

## 🔧 Netlify 詳細手順

### **1. Netlifyアカウント作成**
- [Netlify.com](https://netlify.com) にアクセス
- 「Sign up」でアカウント作成

### **2. ファイルアップロード**
- ダッシュボードの「Sites」タブをクリック
- 「Want to deploy a new site without connecting to Git?」のエリアに
- 予約フォームのフォルダをドラッグ&ドロップ

### **3. URL確認**
- 自動でランダムなURLが生成される
- 例: `https://amazing-name-123456.netlify.app`

## ⚠️ 重要な注意点

1. **HTTPS必須**: LINEリッチメニューから連携するため、HTTPS対応が必要
2. **ドメイン設定**: カスタムドメインを使用する場合は設定が必要
3. **設定ファイル**: `config.js`の公式アカウントIDを正しく設定

## 🎯 次のステップ

デプロイ完了後：
1. 公開URLをメモ
2. LINEリッチメニューの設定に進む
3. 動作テストを実施

---

**サポートが必要な場合は、お気軽にお問い合わせください。**

