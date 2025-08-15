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
        
        // まず管理画面のブログ投稿データをチェック
        const blogPosts = localStorage.getItem('blogPosts');
        
        if (blogPosts) {
            const posts = JSON.parse(blogPosts);
            const publishedPosts = posts.filter(post => post.status === 'published');
            
            if (publishedPosts.length > 0) {
                // 管理画面のブログデータを表示（作成日の降順）
                const sortedPosts = publishedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                displayInfoData(sortedPosts.slice(0, CMS_CONFIG.POSTS_PER_PAGE));
                return;
            }
        }
        
        // ブログデータがない場合はmicroCMSを試行
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
        
        // コンテンツの取得（本文を優先して表示）
        let content = '';
        if (article.content) {
            // 本文から抜粋を生成（優先）
            content = article.content;
        } else if (article.summary) {
            // 管理画面のブログの概要（本文がない場合）
            content = article.summary;
        } else if (article.excerpt) {
            // microCMSの場合
            content = article.excerpt;
        } else {
            content = '内容なし';
        }
        
        // HTMLタグを除去してテキストのみ取得（100文字程度に制限）
        let plainContent = content.replace(/<[^>]*>/g, '').substring(0, 100);
        if (content.length > 100) {
            plainContent += '...';
        }
        
        // カテゴリ表示の追加
        const categoryText = article.category ? getCategoryText(article.category) : '';
        const categoryBadge = categoryText ? `<span class="info-category">${categoryText}</span>` : '';
        
        // 記事IDを生成（日本語対応）
        const articleId = article.id || encodeURIComponent(article.title + (article.createdAt || article.publishedAt)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) || 'article_' + Date.now().toString().substring(-6);
        
        return `
            <div class="info-item">
                <div class="info-date">${date}${categoryBadge}</div>
                <div class="info-text">
                    <h3><a href="blog-detail.html?id=${articleId}" class="title-link">${title}</a></h3>
                    <p>${plainContent}</p>
                </div>
            </div>
        `;
    }).join('');
    
    infoList.innerHTML = infoHTML;
}

// カテゴリIDをテキストに変換
function getCategoryText(category) {
    const categoryMap = {
        'massage': 'マッサージ',
        'health': '健康情報',
        'selfcare': 'セルフケア',
        'store': '店舗情報',
        'staff': 'スタッフ'
    };
    return categoryMap[category] || category;
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの初期化
    initializeHamburgerMenu();
    
    // infoセクションのデータを読み込み
    loadInfoData();
    
    // スクロールトップボタンの初期化
    initializeScrollToTop();
    
    // 画像読み込み最適化
    optimizeImageLoading();
    
    // 管理画面からの更新通知を監視
    setupBlogUpdateListener();
});

// 管理画面からの更新通知を監視する機能
function setupBlogUpdateListener() {
    // 方法1: BroadcastChannelで通知を受信
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('hogusees_updates');
        channel.addEventListener('message', (event) => {
            if (event.data.type === 'blog_updated') {
                console.log('ブログ更新通知を受信しました');
                refreshInfoData();
            }
        });
    }
    
    // 方法2: localStorageの変更を監視
    let lastBlogUpdate = localStorage.getItem('blogUpdated') || '0';
    setInterval(() => {
        const currentUpdate = localStorage.getItem('blogUpdated') || '0';
        if (currentUpdate !== lastBlogUpdate) {
            console.log('ブログ更新を検出しました');
            lastBlogUpdate = currentUpdate;
            refreshInfoData();
        }
    }, 1000); // 1秒ごとにチェック
}

// ハンバーガーメニューの初期化
function initializeHamburgerMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // メニューリンクをクリックしたときにメニューを閉じる
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// スクロールトップボタンの初期化
function initializeScr