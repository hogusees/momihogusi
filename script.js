// CMS連携設定
const CMS_CONFIG = {
    // ここにAPIキーを設定してください
    API_KEY: 'vdklHLdPlKkoI0O5I68A8qDeRTSJnDyazTWn',
    // microCMS APIエンドポイント
    API_ENDPOINT: 'https://hogusees-blog.microcms.io/api/v1/articles',
    // 取得する投稿数
    POSTS_PER_PAGE: 5
};

// infoセクションのデータを取得・表示
async function loadInfoData() {
    const infoList = document.getElementById('info-list');
    
    if (!infoList) return;
    
    try {
        // ローディング表示
        infoList.innerHTML = '<div class="info-loading"><p>情報を読み込み中...</p></div>';
        
        // APIからデータを取得
        const response = await fetch(`${CMS_CONFIG.API_ENDPOINT}?limit=${CMS_CONFIG.POSTS_PER_PAGE}&orders=-publishedAt`, {
            headers: {
                'X-API-KEY': CMS_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('APIリクエストに失敗しました');
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
    // infoセクションのデータを読み込み
    loadInfoData();
    
    // その他の初期化処理
    initializeScrollToTop();
});

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
