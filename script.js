document.addEventListener('DOMContentLoaded', () => {
    const characterFilter = document.getElementById('character-filter');
    const categoryFilter = document.getElementById('category-filter');
    const filterButton = document.getElementById('filter-button');
    const resultsContainer = document.getElementById('results-container');

    let allData = [];
    let currentDisplayData = [];

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

        data.forEach(item => {
            characters.add(item.character);
            categories.add(item.category);
        });

        const fillSelect = (selectElement, items) => {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
                
            });
        };
        
        fillSelect(characterFilter, [...characters]);
        fillSelect(categoryFilter, [...categories]);
    }

    filterButton.addEventListener('click', () => {
        displayResults();
    });

    function displayResults() {
        const selectedCharacter = characterFilter.value;
        const selectedCategory = categoryFilter.value;

        const filteredData = allData.filter(item => {
            const characterMatch = !selectedCharacter || item.character === selectedCharacter;
            const categoryMatch = !selectedCategory || item.category === selectedCategory;
            return characterMatch && categoryMatch;
        });

		currentDisplayData = filteredData;
        renderCards(filteredData);
    }

    function renderCards(data) {
        resultsContainer.innerHTML = ''; 

        if (data.length === 0) {
            resultsContainer.innerHTML = `<p class="message">找不到符合條件的圖片。</p>`;
            return;
        }

        data.forEach((item, index) => {
			
			const hasVariants = item.variants && Array.isArray(item.variants) && item.variants.length > 0;
            
            let variantSelectorHtml = '';
            if (hasVariants) {
                const variantOptions = item.variants.map((variant, vIndex) => 
                    `<option value="${vIndex}" ${vIndex === 0 ? 'selected' : ''}>${variant.name}</option>`
                ).join('');
                
                variantSelectorHtml = `
                    <div class="variant-selector">
                        <label for="variant-${index}">選擇版本：</label>
                        <select id="variant-${index}" class="variant-select" data-item-index="${index}"> ${variantOptions}</select>
                    </div>
                `;
            }
            
            const card = document.createElement('div');
            card.className = 'result-card';
            card.setAttribute('data-item-index', index);
            card.innerHTML = `
                <img src="${hasVariants ? item.variants[0].thumbnail : item.thumbnail}" class="thumbnail"  data-full-src="${hasVariants ? item.variants[0].webp : item.webp}">
                <div class="card-content">
                    <h3 class="card-title">${item.character} - ${item.category}</h3>
                    ${item.warning === 1 ? '<p class="card-warning">建議使用副團體版本</p>' : ''}
                    ${variantSelectorHtml}
					
					<div class="card-buttons">
                        <a href="${hasVariants ? item.variants[0].full : item.full}" download class="btn btn-download-png">下載 PNG</a>
                        <a href="${hasVariants ? item.variants[0].webp : item.webp}" download class="btn btn-download-webp">下載 WebP</a>
					</div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    resultsContainer.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.classList.contains('thumbnail')) {
            const fullImageUrl = target.getAttribute('data-full-src');
            if (fullImageUrl) {
                showLightbox(fullImageUrl);
            }
        }
    });
	
	resultsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('variant-select')) {
            const itemIndex = parseInt(event.target.getAttribute('data-item-index'));
            const variantIndex = parseInt(event.target.value);
            
            const item = currentDisplayData[itemIndex];
            
            if (item && item.variants && item.variants[variantIndex]) {
                const variant = item.variants[variantIndex];
                const card = event.target.closest('.result-card');
                
                const thumbnail = card.querySelector('.thumbnail');
                thumbnail.src = variant.thumbnail;
                thumbnail.setAttribute('data-full-src', variant.webp);
                
                const pngLink = card.querySelector('.btn-download-png');
                const webpLink = card.querySelector('.btn-download-webp');
                pngLink.href = variant.full;
                webpLink.href = variant.webp;
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