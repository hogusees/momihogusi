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
        
        // 記事IDを生成（タイムスタンプベース）
        const articleId = article.id || btoa(article.title + (article.createdAt || article.publishedAt)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        
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
});

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
function initializeScrollToTop() {
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

// カテゴリバッジのスタイルをページに追加
function addCategoryStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .info-category {
            background: #8B4513;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            font-size: 0.7rem;
            margin-left: 0.5rem;
            font-weight: 500;
        }
        
        .info-item {
            border-left: 3px solid #8B4513;
            padding-left: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .info-date {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 0.5rem;
        }
        
        .read-more-link {
            display: inline-block;
            margin-top: 0.8rem;
            color: #8B4513;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            padding: 0.4rem 1rem;
            border: 1px solid #8B4513;
            border-radius: 15px;
            transition: all 0.3s ease;
        }
        
        .read-more-link:hover {
            background: #8B4513;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
        }
        
        .title-link {
            color: #333;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .title-link:hover {
            color: #8B4513;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
}

// ページ読み込み時にスタイルを追加
document.addEventListener('DOMContentLoaded', function() {
    addCategoryStyles();
});

// 画像読み込み最適化（デザイン保持）
function optimizeImageLoading() {
    // 遅延読み込み画像の処理
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // フォールバック: すぐに全画像を表示
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
    
    // 画像読み込み完了時の処理
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                // エラー時の処理（デザインを崩さない）
                this.style.backgroundColor = '#f0f0f0';
                this.style.color = '#666';
                this.alt = this.alt || '画像を読み込めませんでした';
            });
        }
    });
}