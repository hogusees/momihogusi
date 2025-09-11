// 記事詳細ページ専用JavaScript
const BLOG_DETAIL_CONFIG = {
    // CMS連携設定（LPと同じ）
    API_KEY: 'y33nqinuS0kqnnWaqQ15lUfDzQBiLnc1rvlP',
    API_ENDPOINT: 'https://hogusees-blog.microcms.io/api/v1/blogs'
};

// グローバル変数
let currentArticle = null;
let allArticles = [];

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // APIキーのテスト
    testAPIKey();
    initializeArticleDetail();
    setupEventListeners();
});

// APIキーのテスト
async function testAPIKey() {
    try {
        console.log('=== APIキーテスト ===');
        const testResponse = await fetch(`${BLOG_DETAIL_CONFIG.API_ENDPOINT}?limit=1`, {
            method: 'GET',
            headers: {
                'X-MICROCMS-API-KEY': BLOG_DETAIL_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('テストレスポンスステータス:', testResponse.status);
        console.log('テストレスポンスOK:', testResponse.ok);
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('テスト成功 - 記事数:', testData.contents?.length || 0);
        } else {
            const errorText = await testResponse.text();
            console.error('APIキーテスト失敗:', errorText);
        }
    } catch (error) {
        console.error('APIキーテストエラー:', error);
    }
}

// 記事詳細の初期化
async function initializeArticleDetail() {
    try {
        // URLから記事IDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (!articleId) {
            showError('記事IDが指定されていません。');
            return;
        }
        
        await loadArticleDetail(articleId);
        await loadAllArticles(); // 前後の記事用
        setupNavigation();
        
    } catch (error) {
        console.error('記事詳細初期化エラー:', error);
        showError('記事の読み込みに失敗しました。しばらく時間をおいてから再度お試しください。');
    }
}

// 記事詳細の読み込み
async function loadArticleDetail(articleId) {
    const articleContent = document.getElementById('article-content');
    const articleTitle = document.getElementById('article-title');
    const articleDate = document.getElementById('article-date');
    const articleCategory = document.getElementById('article-category');
    
    try {
        // ローディング表示
        articleContent.innerHTML = '<div class="article-loading"><p>記事を読み込み中...</p></div>';
        
        // microCMSから記事を取得
        console.log('=== 記事詳細取得デバッグ ===');
        console.log('APIエンドポイント:', `${BLOG_DETAIL_CONFIG.API_ENDPOINT}/${articleId}`);
        console.log('APIキー:', BLOG_DETAIL_CONFIG.API_KEY);
        console.log('記事ID:', articleId);
        
        const response = await fetch(`${BLOG_DETAIL_CONFIG.API_ENDPOINT}/${articleId}`, {
            method: 'GET',
            headers: {
                'X-MICROCMS-API-KEY': BLOG_DETAIL_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('レスポンスステータス:', response.status);
        console.log('レスポンスOK:', response.ok);
        console.log('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('APIエラーレスポンス:', errorText);
            throw new Error(`記事の取得に失敗しました: ${response.status} - ${errorText}`);
        }

        const article = await response.json();
        console.log('取得した記事データ:', article);
        currentArticle = article;
        
        // 記事情報を表示
        displayArticle(article);
        
        // ページタイトルを更新
        document.title = `${article.title}｜ほぐし処 HoguSeeS【武豊町のマッサージ・もみほぐし専門店】`;
        
        // OGPメタタグを更新
        updateOGPTags(article);

    } catch (error) {
        console.error('記事取得エラー:', error);
        
        // エラー時はlocalStorageから取得
        const articles = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const article = articles.find(a => a.id === articleId);
        
        if (article) {
            currentArticle = article;
            displayArticle(article);
        } else {
            showError('記事が見つかりませんでした。');
        }
    }
}

// 記事の表示
function displayArticle(article) {
    const articleTitle = document.getElementById('article-title');
    const articleDate = document.getElementById('article-date');
    const articleCategory = document.getElementById('article-category');
    const articleContent = document.getElementById('article-content');
    
    // 記事情報を設定
    const postDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '.');
    
    const categoryText = getCategoryText(article.category);
    
    articleTitle.textContent = article.title || 'タイトルなし';
    articleDate.textContent = postDate;
    articleCategory.textContent = categoryText;
    
    // 記事本文を表示
    const content = article.content || article.summary || '内容がありません。';
    articleContent.innerHTML = `<div class="article-body">${content}</div>`;
    
    // ナビゲーションを表示
    document.getElementById('article-navigation').style.display = 'flex';
}

// 全記事の読み込み（前後の記事用）
async function loadAllArticles() {
    try {
        const response = await fetch(`${BLOG_DETAIL_CONFIG.API_ENDPOINT}?limit=100&orders=-publishedAt`, {
            method: 'GET',
            headers: {
                'X-MICROCMS-API-KEY': BLOG_DETAIL_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            allArticles = data.contents || [];
        }
    } catch (error) {
        console.error('全記事取得エラー:', error);
        // エラー時はlocalStorageから取得
        allArticles = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    }
}

// ナビゲーションの設定
function setupNavigation() {
    if (!currentArticle || allArticles.length === 0) return;
    
    const currentIndex = allArticles.findIndex(article => article.id === currentArticle.id);
    
    // 前の記事
    const prevArticle = allArticles[currentIndex + 1];
    const prevBtn = document.getElementById('prev-article');
    if (prevArticle) {
        prevBtn.href = `blog-detail.html?id=${prevArticle.id}`;
        prevBtn.style.display = 'inline-flex';
    } else {
        prevBtn.style.display = 'none';
    }
    
    // 次の記事
    const nextArticle = allArticles[currentIndex - 1];
    const nextBtn = document.getElementById('next-article');
    if (nextArticle) {
        nextBtn.href = `blog-detail.html?id=${nextArticle.id}`;
        nextBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'none';
    }
}

// ソーシャルシェア機能は削除済み

// OGPメタタグの更新
function updateOGPTags(article) {
    const title = article.title || '記事詳細';
    const description = article.summary || article.content.substring(0, 160) + '...';
    const url = window.location.href;
    
    // タイトル
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[name="twitter:title"]').content = title;
    
    // 説明
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[name="twitter:description"]').content = description;
    
    // URL
    document.querySelector('meta[property="og:url"]').content = url;
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

// イベントリスナーの設定
function setupEventListeners() {
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
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = `<div class="article-error"><p>${message}</p></div>`;
}

