// dancestudioVANZ予約サイト設定ファイル

const CONFIG = {
    // LINE公式アカウント設定
    LINE: {
        // スタジオの公式LINEアカウントID
        // 例: @dancestudiovanz または @1234567890
        OFFICIAL_ACCOUNT_ID: '@dancestudiovanz',
        
        // リッチメニュー連携設定
        RICH_MENU: {
            // リッチメニューからのアクセスかどうか
            FROM_RICH_MENU: true,
            
            // 送信先: 'user' = 予約者のトーク, 'official' = 公式アカウント
            SEND_TO: 'user'
        }
    },
    
    // スタジオ情報
    STUDIO: {
        NAME: 'dancestudioVANZ',
        EMAIL: 'info@dancestudiovanz.com'
    },
    
    // 予約設定
    BOOKING: {
        // 予約可能期間（月）
        ADVANCE_BOOKING_MONTHS: 3,
        
        // クリップボードコピー機能の有効/無効
        ENABLE_CLIPBOARD_COPY: true
    }
};

// 設定をグローバルに公開
window.CONFIG = CONFIG;
