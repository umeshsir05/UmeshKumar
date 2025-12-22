// App Configuration
const CONFIG = {
    currentLanguage: 'hindi',
    currentTab: 'today',
    selectedDate: 0,
    newsData: {},
    bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
    
    // News categories with Hindi/English labels
    categories: {
        'today': { hindi: 'आज', english: 'Today' },
        'yesterday': { hindi: 'कल', english: 'Yesterday' },
        'week': { hindi: '7 दिन', english: '7 Days' },
        'national': { hindi: 'देश', english: 'National' },
        'international': { hindi: 'विदेश', english: 'International' },
        'local': { hindi: 'स्थानीय', english: 'Local' }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadNews();
    setupEventListeners();
    updateLastUpdateTime();
});

function initializeApp() {
    // Set initial language
    updateLanguage(CONFIG.currentLanguage);
    
    // Set initial tab
    updateTab(CONFIG.currentTab);
    
    // Load bookmarks if any
    if (CONFIG.bookmarks.length > 0) {
        console.log(`${CONFIG.bookmarks.length} bookmarks loaded`);
    }
}

// News Data - Simulated with realistic news
function getNewsData() {
    const currentDate = new Date();
    
    // Generate dates for last 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        dates.push(date.toLocaleDateString('hi-IN'));
    }

    // Comprehensive news database
    return {
        'today': [
            {
                id: 1,
                title: {
                    hindi: 'सरकार ने नई शिक्षा नीति के तहत परीक्षा सुधारों की घोषणा की',
                    english: 'Government announces exam reforms under new education policy'
                },
                description: {
                    hindi: 'केंद्र सरकार ने आज नई शिक्षा नीति के तहत परीक्षा प्रणाली में बड़े बदलावों की घोषणा की है।',
                    english: 'Central government today announced major changes in examination system under new education policy.'
                },
                time: '2 घंटे पहले',
                category: 'national',
                source: 'BBC Hindi',
                readTime: '2 मिनट'
            },
            {
                id: 2,
                title: {
                    hindi: 'भारतीय क्रिकेट टीम ने T20 सीरीज जीती',
                    english: 'Indian cricket team wins T20 series'
                },
                description: {
                    hindi: 'भारतीय क्रिकेट टीम ने ऑस्ट्रेलिया के खिलाफ T20 सीरीज 3-2 से जीत ली है।',
                    english: 'Indian cricket team wins T20 series against Australia 3-2.'
                },
                time: '4 घंटे पहले',
                category: 'sports',
                source: 'NDTV',
                readTime: '1 मिनट'
            }
        ],
        'yesterday': [
            {
                id: 3,
                title: {
                    hindi: 'विदेश मंत्री की अमेरिका यात्रा, द्विपक्षीय संबंधों पर चर्चा',
                    english: 'Foreign Minister visits USA, discusses bilateral relations'
                },
                description: {
                    hindi: 'विदेश मंत्री ने अमेरिका की आधिकारिक यात्रा की और द्विपक्षीय संबंधों पर चर्चा की।',
                    english: 'Foreign Minister made official visit to USA and discussed bilateral relations.'
                },
                time: '1 दिन पहले',
                category: 'international',
                source: 'The Hindu',
                readTime: '3 मिनट'
            }
        ],
        'national': [
            {
                id: 4,
                title: {
                    hindi: 'केंद्र ने राज्यों को स्वास्थ्य बजट में वृद्धि की घोषणा की',
                    english: 'Center announces increased health budget for states'
                },
                description: {
                    hindi: 'केंद्र सरकार ने राज्यों के लिए स्वास्थ्य बजट में 15% की वृद्धि की घोषणा की है।',
                    english: 'Central government announces 15% increase in health budget for states.'
                },
                time: '6 घंटे पहले',
                category: 'national',
                source: 'दैनिक भास्कर',
                readTime: '2 मिनट'
            }
        ],
        'international': [
            {
                id: 5,
                title: {
                    hindi: 'यूक्रेन संकट पर संयुक्त राष्ट्र की आपात बैठक',
                    english: 'UN emergency meeting on Ukraine crisis'
                },
                description: {
                    hindi: 'संयुक्त राष्ट्र सुरक्षा परिषद ने यूक्रेन संकट पर आपात बैठक बुलाई है।',
                    english: 'UN Security Council calls emergency meeting on Ukraine crisis.'
                },
                time: '8 घंटे पहले',
                category: 'international',
                source: 'BBC World',
                readTime: '4 मिनट'
            }
        ],
        'local': [
            {
                id: 6,
                title: {
                    hindi: 'दिल्ली में नई मेट्रो लाइन का उद्घाटन',
                    english: 'New metro line inaugurated in Delhi'
                },
                description: {
                    hindi: 'दिल्ली में आज नई मेट्रो लाइन का उद्घाटन किया गया, जिससे लाखों यात्रियों को लाभ होगा।',
                    english: 'New metro line inaugurated in Delhi today, benefiting millions of commuters.'
                },
                time: '3 घंटे पहले',
                category: 'local',
                source: 'प्रभात खबर',
                readTime: '2 मिनट'
            }
        ]
    };
}

// Load and display news
function loadNews() {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-newspaper fa-spin"></i>
            <p>${CONFIG.currentLanguage === 'hindi' ? 'समाचार लोड हो रहे हैं...' : 'Loading news...'}</p>
        </div>
    `;
    
    // Simulate API call delay
    setTimeout(() => {
        const newsData = getNewsData();
        CONFIG.newsData = newsData;
        
        // Check which news to display based on current tab
        let newsToDisplay = [];
        
        switch(CONFIG.currentTab) {
            case 'today':
                newsToDisplay = newsData.today || [];
                break;
            case 'yesterday':
                newsToDisplay = newsData.yesterday || [];
                break;
            case 'week':
                // Combine last 7 days news
                newsToDisplay = [
                    ...(newsData.today || []),
                    ...(newsData.yesterday || [])
                ];
                break;
            case 'national':
                newsToDisplay = newsData.national || [];
                break;
            case 'international':
                newsToDisplay = newsData.international || [];
                break;
            case 'local':
                newsToDisplay = newsData.local || [];
                break;
        }
        
        displayNews(newsToDisplay);
    }, 500);
}

// Display news in container
function displayNews(newsList) {
    const newsContainer = document.getElementById('news-container');
    
    if (newsList.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <i class="fas fa-newspaper"></i>
                <h3>${CONFIG.currentLanguage === 'hindi' ? 'कोई समाचार उपलब्ध नहीं' : 'No news available'}</h3>
                <p>${CONFIG.currentLanguage === 'hindi' ? 'कृपया बाद में पुनः प्रयास करें' : 'Please try again later'}</p>
            </div>
        `;
        return;
    }
    
    let newsHTML = '';
    
    newsList.forEach(news => {
        const isBookmarked = CONFIG.bookmarks.some(b => b.id === news.id);
        
        newsHTML += `
            <div class="news-card">
                <div class="news-time">
                    <i class="far fa-clock"></i>
                    ${news.time} • ${CONFIG.currentLanguage === 'hindi' ? 'पढ़ने का समय' : 'Read time'}: ${news.readTime}
                </div>
                <h3 class="news-title">
                    ${CONFIG.currentLanguage === 'hindi' ? news.title.hindi : news.title.english}
                </h3>
                <p class="news-desc">
                    ${CONFIG.currentLanguage === 'hindi' ? news.description.hindi : news.description.english}
                </p>
                <div class="news-source">
                    <span class="source-name">${news.source}</span>
                    <div class="news-actions">
                        <button class="action-btn bookmark-btn" data-id="${news.id}" title="${CONFIG.currentLanguage === 'hindi' ? 'बुकमार्क करें' : 'Bookmark'}">
                            <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                        <button class="action-btn share-btn" data-id="${news.id}" title="${CONFIG.currentLanguage === 'hindi' ? 'शेयर करें' : 'Share'}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    newsContainer.innerHTML = newsHTML;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const newsId = parseInt(this.getAttribute('data-id'));
            toggleBookmark(newsId);
        });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const newsId = parseInt(this.getAttribute('data-id'));
            shareNews(newsId);
        });
    });
}

// Update language
function updateLanguage(lang) {
    CONFIG.currentLanguage = lang;
    
    // Update UI elements based on language
    const hindiBtn = document.getElementById('lang-hindi');
    const englishBtn = document.getElementById('lang-english');
    
    hindiBtn.classList.toggle('active', lang === 'hindi');
    englishBtn.classList.toggle('active', lang === 'english');
    
    // Update tab labels
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const tab = btn.getAttribute('data-tab');
        if (CONFIG.categories[tab]) {
            btn.textContent = CONFIG.categories[tab][lang];
        }
    });
    
    // Update date selector
    document.querySelectorAll('.date-btn').forEach((btn, index) => {
        if (index === 0) {
            btn.textContent = lang === 'hindi' ? 'आज' : 'Today';
        } else {
            btn.textContent = lang === 'hindi' ? `${index} दिन पहले` : `${index} days ago`;
        }
    });
    
    // Reload news with new language
    loadNews();
}

// Update active tab
function updateTab(tab) {
    CONFIG.currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    
    // Show/hide date selector
    const dateSelector = document.getElementById('date-selector');
    dateSelector.style.display = tab === 'week' ? 'flex' : 'none';
    
    // Reload news
    loadNews();
}

// Toggle bookmark
function toggleBookmark(newsId) {
    const newsData = getAllNews();
    const news = newsData.find(n => n.id === newsId);
    
    if (!news) return;
    
    const index = CONFIG.bookmarks.findIndex(b => b.id === newsId);
    
    if (index === -1) {
        // Add bookmark
        CONFIG.bookmarks.push({
            ...news,
            bookmarkedAt: new Date().toISOString()
        });
        
        // Update button icon
        const btn = document.querySelector(`.bookmark-btn[data-id="${newsId}"] i`);
        btn.classList.remove('far');
        btn.classList.add('fas');
        
        showNotification(CONFIG.currentLanguage === 'hindi' ? 'बुकमार्क किया गया' : 'Bookmarked');
    } else {
        // Remove bookmark
        CONFIG.bookmarks.splice(index, 1);
        
        // Update button icon
        const btn = document.querySelector(`.bookmark-btn[data-id="${newsId}"] i`);
        btn.classList.remove('fas');
        btn.classList.add('far');
        
        showNotification(CONFIG.currentLanguage === 'hindi' ? 'बुकमार्क हटाया गया' : 'Bookmark removed');
    }
    
    // Save to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(CONFIG.bookmarks));
}

// Share news
function shareNews(newsId) {
    const newsData = getAllNews();
    const news = newsData.find(n => n.id === newsId);
    
    if (!news) return;
    
    const title = CONFIG.currentLanguage === 'hindi' ? news.title.hindi : news.title.english;
    const text = CONFIG.currentLanguage === 'hindi' ? 
        `इस समाचार को देखें: ${title}` : 
        `Check this news: ${title}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Samachar Daily',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(text + '\n' + window.location.href)
            .then(() => {
                showNotification(CONFIG.currentLanguage === 'hindi' ? 
                    'लिंक कॉपी किया गया' : 'Link copied to clipboard');
            });
    }
}

// Get all news from all categories
function getAllNews() {
    const newsData = CONFIG.newsData;
    const allNews = [];
    
    Object.values(newsData).forEach(category => {
        if (Array.isArray(category)) {
            allNews.push(...category);
        }
    });
    
    return allNews;
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('hi-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const updateText = CONFIG.currentLanguage === 'hindi' ? 
        `अंतिम अपडेट: ${timeString}` : 
        `Last update: ${timeString}`;
    
    document.getElementById('last-update').textContent = updateText;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup all event listeners
function setupEventListeners() {
    // Language switcher
    document.getElementById('lang-hindi').addEventListener('click', () => updateLanguage('hindi'));
    document.getElementById('lang-english').addEventListener('click', () => updateLanguage('english'));
    
    // Tab switcher
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            updateTab(tab);
        });
    });
    
    // Date selector
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            CONFIG.selectedDate = parseInt(this.getAttribute('data-days'));
            loadNews();
        });
    });
    
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadNews();
        updateLastUpdateTime();
        showNotification(CONFIG.currentLanguage === 'hindi' ? 
            'समाचार ताजा किए गए' : 'News refreshed');
    });
    
    // Bookmark button
    document.getElementById('bookmark-btn').addEventListener('click', () => {
        const modal = document.getElementById('bookmark-modal');
        const list = document.getElementById('bookmark-list');
        
        if (CONFIG.bookmarks.length === 0) {
            list.innerHTML = `<p class="no-bookmarks">${CONFIG.currentLanguage === 'hindi' ? 
                'कोई बुकमार्क नहीं' : 'No bookmarks'}</p>`;
        } else {
            let bookmarkHTML = '';
            CONFIG.bookmarks.forEach(bookmark => {
                bookmarkHTML += `
                    <div class="bookmark-item">
                        <h4>${CONFIG.currentLanguage === 'hindi' ? bookmark.title.hindi : bookmark.title.english}</h4>
                        <button class="remove-bookmark" data-id="${bookmark.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            list.innerHTML = bookmarkHTML;
            
            // Add remove listeners
            document.querySelectorAll('.remove-bookmark').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    toggleBookmark(id);
                    this.closest('.bookmark-item').remove();
                });
            });
        }
        
        modal.style.display = 'flex';
    });
    
    // About button
    document.getElementById('about-btn').addEventListener('click', () => {
        document.getElementById('about-modal').style.display = 'flex';
    });
    
    // Close modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-news {
        text-align: center;
        padding: 40px;
        color: #6b7280;
    }
    
    .no-news i {
        font-size: 3rem;
        color: #9ca3af;
        margin-bottom: 20px;
    }
    
    .bookmark-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .bookmark-item:last-child {
        border-bottom: none;
    }
    
    .bookmark-item h4 {
        margin: 0;
        font-size: 0.95rem;
        color: #374151;
    }
    
    .remove-bookmark {
        background: none;
        border: none;
        color: #ef4444;
        cursor: pointer;
        padding: 5px;
    }
    
    .no-bookmarks {
        text-align: center;
        color: #6b7280;
        padding: 20px;
    }
`;
document.head.appendChild(style);

// Auto-refresh news every 30 minutes
setInterval(() => {
    loadNews();
    updateLastUpdateTime();
}, 30 * 60 * 1000);

// Add periodic notification for fresh news
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 9 || now.getHours() === 15 || now.getHours() === 21) {
        showNotification(CONFIG.currentLanguage === 'hindi' ? 
            'ताजा समाचार उपलब्ध हैं!' : 'Fresh news available!');
    }
}, 60 * 60 * 1000);