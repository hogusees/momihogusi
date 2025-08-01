# ほぐし処 HoguSeeS - ランディングページ

愛知県知多郡武豊町にあるもみほぐし店「ほぐし処 HoguSeeS」のランディングページです。

## 📋 プロジェクト概要

- **店舗名**: ほぐし処 HoguSeeS
- **所在地**: 愛知県知多郡武豊町道崎26-7 ほほえみビル3F
- **電話番号**: 0569-84-2515
- **業務形態**: もみほぐし店

## 🎨 デザインコンセプト

- **カラーテーマ**: 茶色を基調とした優しい色合い
- **キーワード**: 武豊町、隠れ家、癒し
- **レスポンシブデザイン**: スマートフォン、タブレット、PCに対応

## 📁 ファイル構成

```
Hogusees LP/
├── index.html          # メインのランディングページ
├── styles.css          # スタイルシート
├── script.js           # JavaScript機能
├── privacy.html        # プライバシーポリシー
├── terms.html          # 利用規約
└── README.md           # このファイル
```

## 🚀 セットアップ方法

### 1. ファイルの配置
すべてのファイルを同じディレクトリに配置してください。

### 2. ローカルサーバーの起動
以下のいずれかの方法でローカルサーバーを起動してください：

#### 方法1: Pythonを使用
```bash
# Python 3の場合
python -m http.server 8000

# Python 2の場合
python -m SimpleHTTPServer 8000
```

#### 方法2: Node.jsを使用
```bash
# http-serverをインストール
npm install -g http-server

# サーバーを起動
http-server
```

#### 方法3: Live Server（VS Code拡張）
VS CodeでLive Server拡張をインストールし、`index.html`を右クリックして「Live Serverで開く」を選択。

### 3. ブラウザでアクセス
- ローカルサーバーを起動後、ブラウザで `http://localhost:8000` にアクセス
- または、`index.html`を直接ブラウザで開く

## 📱 機能一覧

### ヘッダー
- 店名とサブタイトル表示
- 電話番号（クリックで電話発信）
- LINE予約ボタン
- ナビゲーションメニュー

### メインビジュアル
- ヒーローセクション
- 予約ボタン（LINE連携）

### 店舗紹介
- 店舗の特徴説明
- 3つの特徴ポイント

### スタッフ紹介
- スタッフのプロフィール
- 資格情報

### メニュー・料金
- 4つのメニュー
- 時間別料金表示
- ホバーエフェクト

### アクセス
- 店舗情報
- Googleマップ埋め込み

### フッター
- 店舗情報
- メニューリンク
- ソーシャルリンク
- プライバシーポリシー・利用規約

## 🎯 メニュー・料金

| メニュー | 30分 | 60分 | 90分 | 120分 |
|---------|------|------|------|-------|
| もみほぐし | ¥3,000 | ¥5,500 | ¥7,500 | ¥9,500 |
| オイルリンパマッサージ | ¥3,500 | ¥6,000 | ¥8,500 | ¥10,500 |
| 足つぼマッサージ | ¥3,000 | ¥5,500 | ¥7,500 | ¥9,500 |
| タイ古式ストレッチ | - | ¥6,500 | ¥8,500 | ¥10,500 |

## 🔧 カスタマイズ方法

### 色の変更
`styles.css`の以下の変数を変更してください：

```css
/* メインカラー */
--primary-color: #8B4513;
--secondary-color: #D2691E;
--accent-color: #D2B48C;
```

### 画像の追加
現在はプレースホルダーを使用しています。実際の画像に置き換える場合は：

1. 画像ファイルをプロジェクトフォルダに配置
2. HTMLの該当箇所で画像パスを更新

### LINE予約リンクの変更
`index.html`内の以下のリンクを実際のLINE公式アカウントのURLに変更：

```html
<a href="https://line.me/R/ti/p/@hogusees" target="_blank">
```

### Googleマップの更新
`index.html`内のiframeのsrc属性を実際の店舗の座標に更新してください。

## 📞 お問い合わせ

- **電話**: 0569-84-2515
- **住所**: 愛知県知多郡武豊町道崎26-7 ほほえみビル3F
- **営業時間**: 10:00〜22:00（最終受付21:00）

## 📄 ライセンス

このプロジェクトは、ほぐし処 HoguSeeS 専用に作成されています。

---

© 2024 ほぐし処 HoguSeeS. All rights reserved. 