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

    const downloadBtn = document.createElement("a");
    downloadBtn.href = b.full;
    downloadBtn.download = "";
    downloadBtn.textContent = "下載PNG";
    downloadBtn.style.textDecoration = "none";
    downloadBtn.style.backgroundColor = "#4CAF50";
    downloadBtn.style.color = "white";
    downloadBtn.style.padding = "6px 12px";
    downloadBtn.style.borderRadius = "4px";
    downloadBtn.style.fontSize = "14px";

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
    wrapper.appendChild(downloadBtn);
    wrapper.appendChild(downloadWebP);
    container.appendChild(wrapper);
  });
}
