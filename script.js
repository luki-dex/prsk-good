document.addEventListener('DOMContentLoaded', () => {
    const characterFilter = document.getElementById('character-filter');
    const categoryFilter = document.getElementById('category-filter');
    const textFilter = document.getElementById('text-filter');
    const filterButton = document.getElementById('filter-button');
    const resultsContainer = document.getElementById('results-container');

    let allData = [];

    fetch('goods.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('無法讀取 goods.json 檔案');
            }
            return response.json();
        })
        .then(data => {
            allData = data;
            populateFilters(data);
        })
        .catch(error => {
            console.error('讀取資料時發生錯誤:', error);
            resultsContainer.innerHTML = `<p class="message">錯誤：無法載入圖片資料。</p>`;
        });

    function populateFilters(data) {
        const characters = new Set();
        const categories = new Set();
        const texts = new Set();

        data.forEach(item => {
            characters.add(item.character);
            categories.add(item.category);
            texts.add(item.text);
        });

        const fillSelect = (selectElement, items) => {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                if (option.textContent !== "") {
                    selectElement.appendChild(option);
                };
            });
        };
        
        fillSelect(characterFilter, [...characters]);
        fillSelect(categoryFilter, [...categories]);
        fillSelect(textFilter, [...texts]);
    }

    filterButton.addEventListener('click', () => {
        displayResults();
    });

    function displayResults() {
        const selectedCharacter = characterFilter.value;
        const selectedCategory = categoryFilter.value;
        const selectedText = textFilter.value;

        const filteredData = allData.filter(item => {
            const characterMatch = !selectedCharacter || item.character === selectedCharacter;
            const categoryMatch = !selectedCategory || item.category === selectedCategory;
            const textMatch = !selectedText || item.text === selectedText;
            return characterMatch && categoryMatch && textMatch;
        });

        renderCards(filteredData);
    }

    function renderCards(data) {
        resultsContainer.innerHTML = ''; 

        if (data.length === 0) {
            resultsContainer.innerHTML = `<p class="message">找不到符合條件的圖片。</p>`;
            return;
        }

        data.forEach((item, index) => {
            const detailHtml = item.detail.map(d => `<p>${d}</p>`).join('');
            
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.text}" class="thumbnail" data-full-src="${item.webp}">
                <div class="card-content">
                    <h3 class="card-title">${item.character} - ${item.category}</h3>
                    ${item.warning === 1 ? '<p class="card-warning">建議使用副團體版本</p>' : ''}
                    <div class="card-buttons">
                        <a href="${item.full}" download class="btn btn-download-png">下載 PNG</a>
                        <a href="${item.webp}" download class="btn btn-download-webp">下載 WebP</a>
                        <button class="btn btn-details" data-target="details-${index}">展開說明</button>
                    </div>
                    <div id="details-${index}" class="details-content">
                        ${detailHtml}
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    resultsContainer.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-details')) {
            const detailsId = target.getAttribute('data-target');
            const detailsContent = document.getElementById(detailsId);
            if (detailsContent) {
                const isVisible = detailsContent.style.display === 'block';
                detailsContent.style.display = isVisible ? 'none' : 'block';
                target.textContent = isVisible ? '展開說明' : '收起說明';
            }
        }
        
        if (target.classList.contains('thumbnail')) {
            const fullImageUrl = target.getAttribute('data-full-src');
            if (fullImageUrl) {
                showLightbox(fullImageUrl);
            }
        }
    });

    function showLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox-overlay';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${imageUrl}" alt="圖片預覽">
            </div>
        `;

        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox-overlay') {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', handleEscKey);
    }
    
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox-overlay');
        if (lightbox) {
            lightbox.remove();
            document.removeEventListener('keydown', handleEscKey);
        }
    }
    
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});