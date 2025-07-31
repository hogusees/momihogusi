// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // スムーズスクロール機能
    const navLinks = document.querySelectorAll('.nav a, .footer-section a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ヘッダーの背景色変更（スクロール時）
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(139, 69, 19, 0.95)';
        } else {
            header.style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
        }
    });

    // メニューアイテムのホバー効果
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // スタッフ紹介のアニメーション
    const staffMembers = document.querySelectorAll('.staff-member');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    staffMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(member);
    });

    // 料金表示のアニメーション
    const prices = document.querySelectorAll('.price');
    
    prices.forEach((price, index) => {
        price.style.opacity = '0';
        price.style.transform = 'translateX(-20px)';
        price.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });
    
    const priceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const priceElements = entry.target.querySelectorAll('.price');
                priceElements.forEach(price => {
                    price.style.opacity = '1';
                    price.style.transform = 'translateX(0)';
                });
            }
        });
    }, { threshold: 0.5 });
    
    menuItems.forEach(item => {
        priceObserver.observe(item);
    });

    // 電話番号クリック時の確認
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            const confirmed = confirm(`${phoneNumber} に電話をかけますか？`);
            
            if (!confirmed) {
                e.preventDefault();
            }
        });
    });

    // LINE予約ボタンの効果
    const lineButtons = document.querySelectorAll('a[href*="line.me"]');
    
    lineButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // クリック効果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // ページトップに戻るボタン
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #D2691E;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(210, 105, 30, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // スクロール時にボタンを表示/非表示
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // トップに戻る機能
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ローディングアニメーション
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // メニューアイテムの価格表示アニメーション
    const amountElements = document.querySelectorAll('.amount');
    
    amountElements.forEach(amount => {
        const originalText = amount.textContent;
        amount.textContent = '¥---';
        
        setTimeout(() => {
            amount.textContent = originalText;
            amount.style.color = '#D2691E';
            amount.style.fontWeight = '700';
        }, 1000);
    });

    // レスポンシブナビゲーション（モバイル用）
    const nav = document.querySelector('.nav');
    const navToggle = document.createElement('button');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navToggle.className = 'nav-toggle';
    navToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    `;
    
    // モバイル表示時のみナビゲーションボタンを表示
    function checkMobile() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.nav-toggle')) {
                nav.parentNode.insertBefore(navToggle, nav);
                navToggle.style.display = 'block';
                nav.style.display = 'none';
            }
        } else {
            if (document.querySelector('.nav-toggle')) {
                document.querySelector('.nav-toggle').remove();
                nav.style.display = 'block';
            }
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // モバイルナビゲーションの開閉
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            if (nav.style.display === 'none' || nav.style.display === '') {
                nav.style.display = 'block';
                navToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                nav.style.display = 'none';
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}); 
