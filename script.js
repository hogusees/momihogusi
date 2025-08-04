// microCMSとの連携
document.addEventListener('DOMContentLoaded', function() {
    // microCMSのAPIキーとエンドポイント（実際の値に置き換えてください）
    const MICROCMS_API_KEY = 'YOUR_API_KEY';
    const MICROCMS_ENDPOINT = 'YOUR_ENDPOINT';
    
    // 最新情報を取得して表示
    loadLatestInfo();
    
    function loadLatestInfo() {
        // 実際のmicroCMS APIを使用する場合は以下のコードを有効化
        /*
        fetch(`${MICROCMS_ENDPOINT}/api/v1/articles?limit=3&orders=-publishedAt`, {
            headers: {
                'X-API-KEY': MICROCMS_API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            displayLatestInfo(data.contents);
        })
        .catch(error => {
            console.error('Error loading latest info:', error);
            // エラー時はデフォルトの内容を表示
            displayDefaultInfo();
        });
        */
        
        // 開発用：デフォルトの内容を表示
        displayDefaultInfo();
    }
    
    function displayLatestInfo(articles) {
        const infoList = document.querySelector('.info-list');
        if (!infoList) return;
        
        infoList.innerHTML = '';
        
        articles.forEach(article => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            
            // 日付のフォーマット
            const date = new Date(article.publishedAt || article.createdAt);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            
            // 最初の1文のみを取得（句点で区切る）
            const firstSentence = article.content ? article.content.split('。')[0] + '。' : '';
            
            infoItem.innerHTML = `
                <div class="info-date">${formattedDate}</div>
                <div class="info-text">
                    <h3>${article.title}</h3>
                    <p>${firstSentence}</p>
                    <a href="${article.url || '#'}" class="read-more" target="_blank">続きを読む</a>
                </div>
            `;
            
            infoList.appendChild(infoItem);
        });
    }
    
    function displayDefaultInfo() {
        // デフォルトの内容は既にHTMLに含まれているため、
        // 特別な処理は不要です
        console.log('Default info displayed');
    }
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// スクロールトップボタン
window.addEventListener('scroll', function() {
    const scrollTop = document.createElement('button');
    scrollTop.innerHTML = '↑';
    scrollTop.className = 'scroll-top';
    scrollTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #D2691E;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        display: ${window.scrollY > 300 ? 'block' : 'none'};
        transition: all 0.3s ease;
    `;
    
    scrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 既存のボタンを削除して新しいボタンを追加
    const existingButton = document.querySelector('.scroll-top');
    if (existingButton) {
        existingButton.remove();
    }
    document.body.appendChild(scrollTop);
});
