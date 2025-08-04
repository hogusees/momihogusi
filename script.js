// CMS連携設定
const CMS_CONFIG = {
    // ここにAPIキーを設定してください
    API_KEY: 'vdklHLdPlKkoI0O5I68A8qDeRTSJnDyazTWn',
    // microCMS APIエンドポイント
    API_ENDPOINT: 'https://hogusees-blog.microcms.io/api/v1/blogs',
    // 取得する投稿数
    POSTS_PER_PAGE: 3
};

// infoセクションのデータを取得・表示
async function loadInfoData() {
    const infoList = document.getElementById('info-list');
    
    if (!infoList) return;
    
    try {
        // ローディング表示
        infoList.innerHTML = '<div class="info-loading"><p>情報を読み込み中...</p></div>';
        
        // デバッグ用：APIエンドポイントをコンソールに表示
        console.log('API Endpoint:', CMS_CONFIG.API_ENDPOINT);
        console.log('API Key:', CMS_CONFIG.API_KEY);
        
        // APIからデータを取得
        const response = await fetch(`${CMS_CONFIG.API_ENDPOINT}?limit=${CMS_CONFIG.POSTS_PER_PAGE}&orders=-publishedAt`, {
            headers: {
                'X-API-KEY': CMS_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response text:', await response.text());
            throw new Error(`APIリクエストに失敗しました: ${response.status}`);
        }
        
        const data = await response.json();
        
        // データを表示
        displayInfoData(data.contents);
        
    } catch (error) {
        console.error('データ取得エラー:', error);
        // エラー時の表示
        infoList.innerHTML = `
            <div class="info-item">
                <div class="info-date">最新情報</div>
                <div class="info-text">
                    <h3>情報の読み込みに失敗しました</h3>
                    <p>しばらく時間をおいてから再度お試しください。</p>
                    <a href="#" class="read-more">更新する</a>
                </div>
            </div>
        `;
    }
}

// 取得したデータをHTMLに表示
function displayInfoData(posts) {
    const infoList = document.getElementById('info-list');
    
    if (!posts || posts.length === 0) {
        infoList.innerHTML = `
            <div class="info-item">
                <div class="info-date">最新情報</div>
                <div class="info-text">
                    <h3>現在お知らせはありません</h3>
                    <p>新しい情報が更新されましたら、こちらに表示されます。</p>
                </div>
            </div>
        `;
        return;
    }
    
    const infoHTML = posts.map(article => {
        const date = new Date(article.publishedAt || article.createdAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.');
        
        // タイトルとコンテンツを取得
        const title = article.title || 'タイトルなし';
        const content = article.content || article.excerpt || '内容なし';
        
        // HTMLタグを除去してテキストのみ取得（最初の1文のみ）
        const plainContent = content.replace(/<[^>]*>/g, '').split('。')[0] + '。';
        
        return `
            <div class="info-item">
                <div class="info-date">${date}</div>
                <div class="info-text">
                    <h3>${title}</h3>
                    <p>${plainContent}</p>
                    <a href="${article.url || '#'}" class="read-more" target="_blank">続きを読む</a>
                </div>
            </div>
        `;
    }).join('');
    
    infoList.innerHTML = infoHTML;
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーのスタイルを強制適用
    forceHeaderStyles();
    
    // infoセクションのデータを読み込み
    loadInfoData();
    
    // その他の初期化処理
    initializeScrollToTop();
});

// ヘッダーのスタイルを強制適用する関数
function forceHeaderStyles() {
    const header = document.querySelector('.header');
    const headerContent = document.querySelector('.header-content');
    const headerContact = document.querySelector('.header-contact');
    const phone = document.querySelector('.phone');
    const reserveBtn = document.querySelector('.reserve-btn');
    
    if (header) {
        header.style.cssText = `
            background: linear-gradient(135deg, #8B4513, #A0522D) !important;
            color: white !important;
            padding: 0.8rem 0 !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 1000 !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
            overflow: hidden !important;
        `;
    }
    
    if (headerContent) {
        headerContent.style.cssText = `
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 0.5rem !important;
            width: 100% !important;
            flex-wrap: wrap !important;
        `;
    }
    
    if (headerContact) {
        headerContact.style.cssText = `
            display: flex !important;
            align-items: center !important;
            gap: 0.8rem !important;
            flex-wrap: wrap !important;
            justify-content: flex-end !important;
            min-width: auto !important;
        `;
    }
    
    if (phone) {
        phone.style.cssText = `
            font-size: 0.75rem !important;
            text-align: center !important;
            white-space: nowrap !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            align-items: center !important;
        `;
    }
    
    if (reserveBtn) {
        reserveBtn.style.cssText = `
            padding: 0.25rem 0.5rem !important;
            font-size: 0.7rem !important;
            width: auto !important;
            min-width: 70px !important;
            text-align: center !important;
            white-space: nowrap !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: white !important;
            align-items: center !important;
        `;
    }
}

// スクロールトップボタンの初期化
function initializeScrollToTop() {
    // スクロールトップボタンが存在する場合の処理
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 手動でデータを更新する関数
function refreshInfoData() {
    loadInfoData();
}

// グローバル関数として公開（必要に応じて）
window.refreshInfoData = refreshInfoData;
