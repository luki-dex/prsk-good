let goods = [];

fetch('goods.json')
  .then(res => res.json())
  .then(data => {
    goods = data;
    populateSelects();
    updateImages();
  });

function populateSelects() {
  const character = [...new Set(goods.map(b => b.character))];
  const category = [...new Set(goods.map(b => b.category))];

  fillSelect('characterSelect', character);
  fillSelect('categorySelect', category);;

  document.getElementById("searchButton").addEventListener("click", updateImages);
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function updateImages() {
  const character = document.getElementById("characterSelect").value;
  const category = document.getElementById("categorySelect").value;

  const filtered = goods.filter(b =>
    (!character || b.character === character) &&
    (!category || b.category === category)
  );

  const container = document.getElementById("imageContainer");
  container.innerHTML = "";

  filtered.forEach(b => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    const img = document.createElement("img");
    img.src = b.thumbnail;
    img.alt = b.character;
    img.title = b.character;
    img.addEventListener("click", () => {
      window.open(b.full, "_blank");
    });
    wrapper.appendChild(img);

    if (b.warning === 1) {

      const warning = document.createElement("div");
        warning.textContent = "含南嘉堂合作色紙";
        warning.style.color = "black";
        warning.style.fontSize = "14px";
        warning.style.textAlign = "center";
        wrapper.appendChild(warning);
    }else if (b.warning === 2) {

      const warning = document.createElement("div");
        warning.textContent = "不含南嘉堂合作色紙";
        warning.style.color = "black";
        warning.style.fontSize = "14px";
        warning.style.textAlign = "center";
        wrapper.appendChild(warning);
    }else if (b.warning === 3) {

      const warning = document.createElement("div");
        warning.textContent = "⚠️建議使用副團體版本";
        warning.style.color = "black";
        warning.style.fontSize = "14px";
        warning.style.textAlign = "center";
        wrapper.appendChild(warning);
    }

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

    wrapper.appendChild(downloadPNG);
    wrapper.appendChild(downloadWebP);
    container.appendChild(wrapper);
  });
}
