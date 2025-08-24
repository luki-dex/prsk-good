let goods = [];

fetch('goods.json')
  .then(res => res.json())
  .then(data => {
    goods = data;
    populateSelects();
  });

function populateSelects() {
  const character = [...new Set(goods.map(b => b.character))];
  const category = [...new Set(goods.map(b => b.category))];
  const text = [...new Set(goods.map(b => b.text))];

  fillSelect('characterSelect', character);
  fillSelect('categorySelect', category);
  fillSelect('textSelect', text);

  document.getElementById("searchButton").addEventListener("click", updateImages);
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    if (option.textContent !== "") {
      select.appendChild(option);
    }
  });
}

function updateImages() {
  const character = document.getElementById("characterSelect").value;
  const category = document.getElementById("categorySelect").value;
  const text = document.getElementById("textSelect").value;

  const filtered = goods.filter(b =>
    (!character || b.character === character) &&
    (!category || b.category === category) &&
    (!text || b.text === text || b.text === "")
  );

  const container = document.getElementById("imageContainer");
  container.innerHTML = "";

  filtered.forEach(b => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    const name = document.createElement("div");
      fullname = b.character + "/" + b.category
      name.textContent = fullname;
      name.style.color = "black";
      name.style.fontSize = "16px";
      name.style.textAlign = "center";
      wrapper.appendChild(name);
    
    
    const detailsBox = document.createElement("div");
    detailsBox.style.display = "none";
    detailsBox.style.flexDirection = "column";
    detailsBox.style.alignItems = "center";
    detailsBox.style.gap = "4px";
    detailsBox.style.border = "1px solid #000000";
    detailsBox.style.padding = "4px 4px";
    detailsBox.style.backgroundColor = "#FFFFFF"
    
    for (var i = 0; i < b.detail.length; i++){
      const details = document.createElement("div");
      details.textContent = b.detail[i];
      details.style.color = "black";
      details.style.fontSize = "14px";
      details.style.textAlign = "center";
      detailsBox.appendChild(details);
    }

    if (b.warning === 1) {
      const warning = document.createElement("div");
      warning.textContent = "建議使用副團體版本";
      warning.style.color = "black";
      warning.style.fontSize = "14px";
      warning.style.textAlign = "center";
      detailsBox.appendChild(warning);
    }
    
    const toggleLink = document.createElement("a");
    toggleLink.type = "a";
    toggleLink.textContent = "展開說明";
    toggleLink.style.cursor = "pointer";
    toggleLink.style.fontSize = "12px";
    toggleLink.style.textDecoration = "underline";
    toggleLink.style.color = "#000000";

    toggleLink.addEventListener("click", () => {
      const isHidden = detailsBox.style.display === "none";
      detailsBox.style.display = isHidden ? "flex" : "none";
      toggleLink.textContent = isHidden ? "收起說明" : "展開說明";
    });

      wrapper.appendChild(toggleLink);
      wrapper.appendChild(detailsBox);

    const img = document.createElement("img");
    img.src = b.thumbnail;
    img.alt = b.character;
    img.title = b.character;
    img.addEventListener("click", () => {
      window.open(b.full, "_blank");
    });

    const downloadPNG = document.createElement("a");
    downloadPNG.href = b.full;
    downloadPNG.download = "";
    downloadPNG.textContent = "下載PNG";
    downloadPNG.style.textDecoration = "none";
    downloadPNG.style.backgroundColor = "#4CAF50";
    downloadPNG.style.color = "white";
    downloadPNG.style.padding = "6px 12px";
    downloadPNG.style.borderRadius = "4px";
    downloadPNG.style.fontSize = "14px";

    const downloadWebP = document.createElement("a");
    downloadWebP.href = b.webp;
    downloadWebP.download = "";
    downloadWebP.textContent = "下載WebP";
    downloadWebP.style.textDecoration = "none";
    downloadWebP.style.backgroundColor = "#329cc9";
    downloadWebP.style.color = "white";
    downloadWebP.style.padding = "6px 12px";
    downloadWebP.style.borderRadius = "4px";
    downloadWebP.style.fontSize = "14px";

    wrapper.appendChild(img);
    wrapper.appendChild(downloadPNG);
    wrapper.appendChild(downloadWebP);
    container.appendChild(wrapper);
  });
}
