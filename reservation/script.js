// dancestudioVANZ予約サイトのJavaScript機能

document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initializeApp();
});

function initializeApp() {
    // スムーズスクロール機能
    setupSmoothScroll();
    
    // フォーム送信機能
    setupFormSubmission();
    
    // ページトップボタン
    setupScrollToTop();
    
    // 日付入力の制限
    setupDateInputs();
    
    // フォームバリデーション
    setupFormValidation();
    
    // キッズダンスクラス選択機能
    setupKidsDanceClassSelection();
    
    // 曜日制限機能
    setupDayRestrictions();
}

// スムーズスクロール機能
function setupSmoothScroll() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // ヘッダーの高さを考慮してスクロール
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // スムーズスクロール
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // ハイライト効果
                highlightSection(targetSection);
            }
        });
    });
    
    // ナビゲーションリンクのスムーズスクロール
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// セクションハイライト機能
function highlightSection(section) {
    // 既存のハイライトを削除
    document.querySelectorAll('.booking-section').forEach(sec => {
        sec.classList.remove('highlight');
    });
    
    // 新しいハイライトを追加
    section.classList.add('highlight');
    
    // 3秒後にハイライトを削除
    setTimeout(() => {
        section.classList.remove('highlight');
    }, 3000);
}

// フォーム送信機能
function setupFormSubmission() {
    const forms = document.querySelectorAll('.booking-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const lessonType = this.id.replace('-form', '');
            
            // フォームデータをオブジェクトに変換
            const bookingData = {};
            for (let [key, value] of formData.entries()) {
                bookingData[key] = value;
            }
            
            // 予約内容をLINEトークに送信
            sendToLine(lessonType, bookingData);
        });
    });
}

// LINEトーク送信機能
function sendToLine(lessonType, bookingData) {
    const submitBtn = document.querySelector(`#${lessonType}-form .submit-btn`);
    
    // ボタンをローディング状態に
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // 予約内容を整形
    const message = formatBookingMessage(lessonType, bookingData);
    
    // 複数の方法でLINEに送信を試行
    const lineUrls = createLineUrls(message);
    
    // 少し待ってからLINEアプリを開く
    setTimeout(() => {
        // スマホの場合はアプリを優先、PCの場合はWeb版
        const userAgent = navigator.userAgent;
        const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone');
        
        // 予約内容をクリップボードにコピー（フォールバック用）
        const enableClipboard = window.CONFIG ? window.CONFIG.BOOKING.ENABLE_CLIPBOARD_COPY : true;
        if (enableClipboard && navigator.clipboard) {
            navigator.clipboard.writeText(message).then(() => {
                console.log('予約内容をクリップボードにコピーしました');
            }).catch(err => {
                console.log('クリップボードへのコピーに失敗しました:', err);
            });
        }
        
        if (isMobile) {
            // スマホ: LINEアプリでメッセージ作成画面を開く
            window.location.href = lineUrls.message;
        } else {
            // PC: Web版LINEでメッセージ作成画面を開く
            window.open(lineUrls.message, '_blank');
        }
        
        // ボタンを成功状態に
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitBtn.textContent = 'LINEを開きました！';
        
        // フォームをリセット
        document.getElementById(`${lessonType}-form`).reset();
        
        // 3秒後にボタンを元に戻す
        setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.textContent = '予約をLINEに送信';
            submitBtn.disabled = false;
        }, 3000);
        
    }, 1000);
}


// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日（${weekday}）`;
}

// LINE URLを作成（リッチメニュー連携版）
function createLineUrls(message) {
    // エンコードされたメッセージ
    const encodedMessage = encodeURIComponent(message);
    
    // 設定から送信先を取得
    const sendTo = window.CONFIG && window.CONFIG.LINE.RICH_MENU ? 
                   window.CONFIG.LINE.RICH_MENU.SEND_TO : 'user';
    
    if (sendTo === 'official') {
        // 公式アカウントに送信する場合
        const officialAccountId = window.CONFIG ? window.CONFIG.LINE.OFFICIAL_ACCOUNT_ID : '@dancestudiovanz';
        const accountId = officialAccountId.replace('@', '');
        
        return {
            // スマホ用: 公式アカウントのトークを開く
            app: `line://ti/p/${accountId}`,
            
            // PC用: Web版LINEで公式アカウントを開く
            web: `https://line.me/R/ti/p/${accountId}`,
            
            // メッセージ付きで開く
            message: `line://msg/text/${encodedMessage}`
        };
    } else {
        // 予約者のトークに送信する場合（リッチメニュー連携）
        return {
            // スマホ用: LINEアプリでメッセージ作成画面を開く
            app: `line://msg/text/${encodedMessage}`,
            
            // PC用: Web版LINEでメッセージ作成画面を開く
            web: `https://line.me/R/msg/text/?${encodedMessage}`,
            
            // メッセージ付きで開く
            message: `line://msg/text/${encodedMessage}`
        };
    }
}

// ページトップボタン
function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    // スクロール位置を監視
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // ボタンクリックでページトップに移動
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// フォームバリデーション
function setupFormValidation() {
    const forms = document.querySelectorAll('.booking-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // エラーメッセージをクリア
                clearFieldError(this);
            });
        });
    });
}

// フィールドバリデーション
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 必須チェック
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'この項目は必須です';
    }
    
    // 名前の形式チェック
    if (field.name === 'names' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = '名前は2文字以上で入力してください';
        }
    }
    
    // エラー表示
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// フィールドエラー表示
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// フィールドエラー削除
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// エラー状態のCSS（動的に追加）
const errorStyles = `
.field-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.form-input.error,
.form-select.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
`;

// エラースタイルを追加
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// レスポンシブ対応
function handleResize() {
    // ウィンドウサイズが変わった時の処理
    const isMobile = window.innerWidth <= 768;
    
    // モバイル用の調整
    if (isMobile) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// リサイズイベント
window.addEventListener('resize', handleResize);
handleResize(); // 初期実行

// ページ読み込み完了時の処理
window.addEventListener('load', function() {
    // 初期アニメーション
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});

// キッズダンスクラス選択機能
function setupKidsDanceClassSelection() {
    const classOptions = document.querySelectorAll('input[name="dance-class"]');
    const classInfo = document.getElementById('selected-class-info');
    const classNameSpan = document.getElementById('selected-class-name');
    const classTimeSpan = document.getElementById('selected-class-time');
    const classDaysSpan = document.getElementById('selected-class-days');
    
    classOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                const days = this.getAttribute('data-days').split(',').map(Number);
                const time = this.getAttribute('data-time');
                const classNames = {
                    'preschool': '幼児クラス（3-6歳）',
                    'elementary-low': '低学年クラス（1-3年生）',
                    'elementary-high': '高学年クラス（4-6年生）',
                    'junior-high': '中学生クラス（1-3年生）'
                };
                
                const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                const allowedDays = days.map(day => dayNames[day]).join('・');
                
                classNameSpan.textContent = classNames[this.value];
                classTimeSpan.textContent = time;
                classDaysSpan.textContent = allowedDays;
                
                classInfo.style.display = 'block';
                
                // 日付入力を更新
                updateDateRestrictions('kids-date', days);
            }
        });
    });
}

// 曜日制限機能
function setupDayRestrictions() {
    // エアロビクス: 水曜（3）
    updateDateRestrictions('aerobics-date', [3]);
    
    // ヨガ: 月曜（1）
    updateDateRestrictions('yoga-date', [1]);
}

// 日付入力の曜日制限
function updateDateRestrictions(inputId, allowedDays) {
    const dateInput = document.getElementById(inputId);
    if (!dateInput) return;
    
    // 日付変更時のイベントリスナーを追加
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        if (!allowedDays.includes(dayOfWeek)) {
            // 選択された日が許可された曜日でない場合
            const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
            const allowedDayNames = allowedDays.map(day => dayNames[day]).join('・');
            
            alert(`このクラスは${allowedDayNames}曜日のみ開講しています。\n他の日付を選択してください。`);
            this.value = '';
            return;
        }
    });
}

// 日付入力の制限（更新版）
function setupDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // 今日以降の日付のみ選択可能
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
        
        // 3ヶ月後まで選択可能
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        input.setAttribute('max', maxDate.toISOString().split('T')[0]);
    });
}

// 予約メッセージを整形（更新版）
function formatBookingMessage(lessonType, bookingData) {
    let message = '🎉 レッスン予約完了\n\n';
    
    // レッスンタイプに応じてメッセージを構成
    switch(lessonType) {
        case 'kids-dance':
            const classNames = {
                'preschool': '幼児クラス（3-6歳）',
                'elementary-low': '低学年クラス（1-3年生）',
                'elementary-high': '高学年クラス（4-6年生）',
                'junior-high': '中学生クラス（1-3年生）'
            };
            
            const timeMapping = {
                'preschool': '16:00-16:50',
                'elementary-low': '17:00-18:00',
                'elementary-high': '18:30-19:30',
                'junior-high': '19:40-20:40'
            };
            
            message += `🕺 レッスン: キッズダンス（${classNames[bookingData['dance-class']] || bookingData['dance-class']}）\n`;
            message += `📅 日時: ${formatDate(bookingData.date)} ${timeMapping[bookingData['dance-class']]}\n`;
            message += `👥 人数: ${bookingData.participants}名\n`;
            message += `👤 参加者: ${bookingData.names}\n`;
            message += `📚 学年: ${bookingData.grade}\n`;
            break;
            
            
        case 'aerobics':
            message += `💃 レッスン: エアロビクス\n`;
            message += `📅 日時: ${formatDate(bookingData.date)} 10:00-11:00\n`;
            message += `👥 人数: ${bookingData.participants}名\n`;
            message += `👤 参加者: ${bookingData.names}\n`;
            break;
            
        case 'yoga':
            message += `🧘‍♀️ レッスン: 癒しのヨガ\n`;
            message += `📅 日時: ${formatDate(bookingData.date)} 9:00-10:00\n`;
            message += `👥 人数: ${bookingData.participants}名\n`;
            message += `👤 参加者: ${bookingData.names}\n`;
            break;
    }
    
    message += '\nありがとうございます！';
    
    return message;
}

// デバッグ用（開発時のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('dancestudioVANZ予約サイトが読み込まれました');
    console.log('利用可能な機能:', {
        smoothScroll: true,
        formSubmission: true,
        lineIntegration: true,
        validation: true,
        dayRestrictions: true,
        classSelection: true
    });
}
