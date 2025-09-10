// ブログ専用JavaScript
const BLOG_CONFIG = {
    // CMS連携設定（LPと同じ）
    API_KEY: 'vdklHLdPlKkoI0O5I68A8qDeRTSJnDyazTWn',
    API_ENDPOINT: 'https://hogusees-blog.microcms.io/api/v1/blogs',
    POSTS_PER_PAGE: 6
};

// グローバル変数
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let currentCategory = 'all';

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    setupEventListeners();
});

// ブログの初期化
async function initializeBlog() {
    try {
        await loadBlogPosts();
        renderBlogPosts();
        setupPagination();
    } catch (error) {
        console.error('ブログ初期化エラー:', error);
        showError('記事の読み込みに失敗しました。しばらく時間をおいてから再度お試しください。');
    }
}

// ブログ記事の読み込み
async function loadBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    
    try {
        // ローディング表示
        blogGrid.innerHTML = '<div class="blog-loading"><p>記事を読み込み中...</p></div>';
        
        // microCMSから投稿を取得
        const response = await fetch(`${BLOG_CONFIG.API_ENDPOINT}?limit=100&orders=-publishedAt`, {
            method: 'GET',
            headers: {
                'X-MICROCMS-API-KEY': BLOG_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`投稿の取得に失敗しました: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.contents || [];
        
        // 削除された記事IDを除外
        const deletedPostIds = JSON.parse(localStorage.getItem('deletedPostIds') || '[]');
        allPosts = posts.filter(post => !deletedPostIds.includes(post.id));
        
        console.log(`ブログ記事取得: ${posts.length}件 → 削除済み除外後: ${allPosts.length}件`);

        // カテゴリフィルターを適用
        applyCategoryFilter();

    } catch (error) {
        console.error('ブログ記事取得エラー:', error);
        
        // エラー時はlocalStorageから取得
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const deletedPostIds = JSON.parse(localStorage.getItem('deletedPostIds') || '[]');
        allPosts = posts.filter(post => !deletedPostIds.includes(post.id));
        
        applyCategoryFilter();
    }
}

// カテゴリフィルターの適用
function applyCategoryFilter() {
    if (currentCategory === 'all') {
        filteredPosts = allPosts;
    } else {
        filteredPosts = allPosts.filter(post => post.category === currentCategory);
    }
    
    currentPage = 1;
    renderBlogPosts();
    setupPagination();
}

// ブログ記事の表示
function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = '<div class="blog-error"><p>該当する記事が見つかりませんでした。</p></div>';
        return;
    }

    // ページネーション用の記事を取得
    const startIndex = (currentPage - 1) * BLOG_CONFIG.POSTS_PER_PAGE;
    const endIndex = startIndex + BLOG_CONFIG.POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(startIndex, endIndex);

    const blogHTML = pagePosts.map(post => {
        const postDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.');
        
        const title = post.title || 'タイトルなし';
        const excerpt = post.summary || post.content.substring(0, 120) + '...';
        const category = post.category || 'その他';
        const categoryText = getCategoryText(category);
        
        return `
            <article class="blog-card" data-category="${category}">
                <div class="blog-card-image">
                    <i class="fas fa-spa"></i>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <div class="blog-card-date">${postDate}</div>
                        <div class="blog-card-category">${categoryText}</div>
                    </div>
                    <h2 class="blog-card-title">${title}</h2>
                    <p class="blog-card-excerpt">${excerpt}</p>
                    <a href="blog-detail.html?id=${post.id}" class="blog-card-link">
                        続きを読む
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }).join('');

    blogGrid.innerHTML = blogHTML;
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

// ページネーションの設定
function setupPagination() {
    const totalPages = Math.ceil(filteredPosts.length / BLOG_CONFIG.POSTS_PER_PAGE);
    const pagination = document.getElementById('blog-pagination');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';
    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    // 前のページボタン
    prevBtn.disabled = currentPage <= 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderBlogPosts();
            setupPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 次のページボタン
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBlogPosts();
            setupPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
}

// イベントリスナーの設定
function setupEventListeners() {
    // カテゴリフィルターボタン
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // アクティブ状態を更新
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // カテゴリを更新
            currentCategory = this.dataset.category;
            applyCategoryFilter();
        });
    });

    // ハンバーガーメニュー（LPと同じ機能）
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

// エラー表示
function showError(message) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = `<div class="blog-error"><p>${message}</p></div>`;
}

// 管理画面からの更新通知を監視
function setupBlogUpdateListener() {
    // BroadcastChannelで通知を受信
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('hogusees_updates');
        channel.addEventListener('message', (event) => {
            if (event.data.type === 'blog_updated') {
                console.log('ブログ更新通知を受信しました');
                initializeBlog();
            }
        });
    }
    
    // localStorageの変更を監視
    let lastBlogUpdate = localStorage.getItem('blogUpdated') || '0';
    setInterval(() => {
        const currentUpdate = localStorage.getItem('blogUpdated') || '0';
        if (currentUpdate !== lastBlogUpdate) {
            console.log('ブログ更新を検出しました');
            lastBlogUpdate = currentUpdate;
            initializeBlog();
        }
    }, 1000);
}

// 更新通知の監視を開始
setupBlogUpdateListener();

