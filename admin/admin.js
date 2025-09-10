// 管理画面用JavaScript

// ダッシュボードデータの読み込み
function loadDashboardData() {
    // ローカルストレージからデータを取得（実際の実装ではAPIから取得）
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem(`analytics_${today}`);
    
    let data = {
        visitors: Math.floor(Math.random() * 200) + 50,
        clicks: Math.floor(Math.random() * 30) + 5,
        phoneCalls: Math.floor(Math.random() * 15) + 2,
        seoRank: Math.floor(Math.random() * 10) + 1
    };
    
    if (storedData) {
        data = JSON.parse(storedData);
    } else {
        // 新しいデータを生成して保存
        localStorage.setItem(`analytics_${today}`, JSON.stringify(data));
    }
    
    // 前日のデータと比較してトレンドを計算
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    const yesterdayData = localStorage.getItem(`analytics_${yesterdayKey}`);
    
    let trends = {
        visitors: 'neutral',
        clicks: 'neutral', 
        phoneCalls: 'neutral',
        seoRank: 'neutral'
    };
    
    if (yesterdayData) {
        const prevData = JSON.parse(yesterdayData);
        trends.visitors = data.visitors > prevData.visitors ? 'up' : data.visitors < prevData.visitors ? 'down' : 'neutral';
        trends.clicks = data.clicks > prevData.clicks ? 'up' : data.clicks < prevData.clicks ? 'down' : 'neutral';
        trends.phoneCalls = data.phoneCalls > prevData.phoneCalls ? 'up' : data.phoneCalls < prevData.phoneCalls ? 'down' : 'neutral';
        trends.seoRank = data.seoRank < prevData.seoRank ? 'up' : data.seoRank > prevData.seoRank ? 'down' : 'neutral'; // SEOは順位が低い方が良い
    }
    
    // DOMを更新
    updateElement('todayVisitors', data.visitors + '人');
    updateElement('todayClicks', data.clicks + '回');
    updateElement('todayPhoneCalls', data.phoneCalls + '回');
    updateElement('seoRank', data.seoRank + '位');
    
    // トレンド表示を更新
    updateTrend('visitorsTrend', trends.visitors, getTrendText(trends.visitors));
    updateTrend('clicksTrend', trends.clicks, getTrendText(trends.clicks));
    updateTrend('phonesTrend', trends.phoneCalls, getTrendText(trends.phoneCalls));
    updateTrend('seoTrend', trends.seoRank, getSEOTrendText(trends.seoRank));
}

// 要素更新のヘルパー関数
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// トレンド表示の更新
function updateTrend(id, trend, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
        element.className = 'trend ' + trend;
    }
}

// トレンドテキストの生成
function getTrendText(trend) {
    switch(trend) {
        case 'up': return '↗️ 増加';
        case 'down': return '↘️ 減少';
        default: return '→ 変化なし';
    }
}

// SEO順位用のトレンドテキスト
function getSEOTrendText(trend) {
    switch(trend) {
        case 'up': return '↗️ 順位UP';
        case 'down': return '↘️ 順位DOWN';
        default: return '→ 変化なし';
    }
}

// SEO推奨キーワードの読み込み
function loadSEOKeywords() {
    const keywords = [
        {
            keyword: '武豊町 マッサージ 肩こり',
            volume: '高',
            trend: '上昇中',
            reason: '地域性 + 症状特化'
        },
        {
            keyword: 'デスクワーク 疲れ 解消',
            volume: '中',
            trend: '安定',
            reason: 'テレワーク需要'
        },
        {
            keyword: '知多半島 リラクゼーション',
            volume: '中',
            trend: '上昇中', 
            reason: '地域拡張キーワード'
        },
        {
            keyword: '腰痛 セルフケア 方法',
            volume: '高',
            trend: '上昇中',
            reason: '検索ボリューム大'
        },
        {
            keyword: '冬 冷え性 改善 マッサージ',
            volume: '中',
            trend: '季節性',
            reason: '季節に応じた需要'
        },
        {
            keyword: '美浜町 常滑市 もみほぐし',
            volume: '低',
            trend: '新規',
            reason: '近隣地域への展開'
        }
    ];
    
    const container = document.getElementById('seoKeywords');
    if (container) {
        container.innerHTML = keywords.map(item => `
            <div class="keyword-item">
                <div class="keyword">"${item.keyword}"</div>
                <div class="volume">検索ボリューム: ${item.volume} | ${item.trend}</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
                    ${item.reason}
                </div>
            </div>
        `).join('');
    }
}

// 最近のアクティビティの読み込み
function loadRecentActivity() {
    const activities = [
        {
            time: '10分前',
            action: '予約ボタンがクリックされました',
            icon: 'fas fa-mouse-pointer'
        },
        {
            time: '25分前', 
            action: 'メニューページが閲覧されました',
            icon: 'fas fa-eye'
        },
        {
            time: '1時間前',
            action: '電話番号がタップされました',
            icon: 'fas fa-phone'
        },
        {
            time: '2時間前',
            action: 'スタッフ紹介ページが閲覧されました',
            icon: 'fas fa-users'
        },
        {
            time: '3時間前',
            action: 'アクセス情報が確認されました',
            icon: 'fas fa-map-marker-alt'
        }
    ];
    
    const container = document.getElementById('recentActivity');
    if (container) {
        container.innerHTML = activities.map(activity => `
            <li>
                <i class="${activity.icon}" style="color: #8B4513; margin-right: 0.5rem;"></i>
                ${activity.action}
                <div class="activity-time">${activity.time}</div>
            </li>
        `).join('');
    }
}

// イベントトラッキング関数（メインサイトから呼び出される）
function trackEvent(eventType, data = {}) {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `analytics_${today}`;
    
    let todayData = localStorage.getItem(storageKey);
    if (todayData) {
        todayData = JSON.parse(todayData);
    } else {
        todayData = {
            visitors: 0,
            clicks: 0,
            phoneCalls: 0,
            seoRank: 5
        };
    }
    
    // イベントに応じてカウンターを増加
    switch(eventType) {
        case 'page_view':
            todayData.visitors++;
            break;
        case 'reservation_click':
            todayData.clicks++;
            break;
        case 'phone_call':
            todayData.phoneCalls++;
            break;
    }
    
    // データを保存
    localStorage.setItem(storageKey, JSON.stringify(todayData));
    
    // リアルタイム更新（管理画面が開いている場合）
    if (window.location.pathname.includes('admin')) {
        loadDashboardData();
    }
}

// 週間レポートの生成
function generateWeeklyReport() {
    const report = {
        week: [],
        totalVisitors: 0,
        totalClicks: 0,
        totalPhoneCalls: 0,
        avgSeoRank: 0
    };
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        const dayData = localStorage.getItem(`analytics_${dateKey}`);
        if (dayData) {
            const data = JSON.parse(dayData);
            report.week.push({
                date: dateKey,
                ...data
            });
            report.totalVisitors += data.visitors || 0;
            report.totalClicks += data.clicks || 0;
            report.totalPhoneCalls += data.phoneCalls || 0;
            report.avgSeoRank += data.seoRank || 0;
        }
    }
    
    report.avgSeoRank = Math.round(report.avgSeoRank / 7);
    return report;
}

// データの初期化（開発・テスト用）
function initializeSampleData() {
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        const sampleData = {
            visitors: Math.floor(Math.random() * 150) + 50,
            clicks: Math.floor(Math.random() * 20) + 3,
            phoneCalls: Math.floor(Math.random() * 10) + 1,
            seoRank: Math.floor(Math.random() * 8) + 3
        };
        
        localStorage.setItem(`analytics_${dateKey}`, JSON.stringify(sampleData));
    }
    
    console.log('サンプルデータを30日分生成しました');
}

// エクスポート用の関数をグローバルに公開
window.trackEvent = trackEvent;
window.generateWeeklyReport = generateWeeklyReport;
window.initializeSampleData = initializeSampleData;





