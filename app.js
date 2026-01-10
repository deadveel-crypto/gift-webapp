const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.setHeaderColor("secondary_bg_color");
}

const items = [
    { id: "rose", title: "Букет роз", desc: "Роскошный букет. Выдача админом после покупки.", price: 25, img: "https://picsum.photos/seed/rose/600/400" },
    { id: "bear", title: "Плюшевый мишка", desc: "Мягкий подарок. Выдача админом после покупки.", price: 40, img: "https://picsum.photos/seed/bear/600/400" },
    { id: "choco", title: "Набор шоколада", desc: "Сладкий набор. Выдача админом после покупки.", price: 15, img: "https://picsum.photos/seed/choco/600/400" },
    { id: "perfume", title: "Парфюм", desc: "Аромат в подарок. Выдача админом после покупки.", price: 70, img: "https://picsum.photos/seed/perfume/600/400" },
    { id: "giftbox", title: "Подарочный бокс", desc: "Сюрприз-бокс. Выдача админом после покупки.", price: 55, img: "https://picsum.photos/seed/giftbox/600/400" },
];

const grid = document.getElementById("grid");

function cardTemplate(it) {
    return `
    <article class="card">
      <img class="card-img" src="${it.img}" alt="${it.title}">
      <div class="card-body">
        <h3 class="card-title">${it.title}</h3>
        <p class="card-desc">${it.desc}</p>
        <div class="row">
          <div class="price">${it.price} <span class="stars">⭐ Stars</span></div>
          <button class="btn" data-buy="${it.id}">Купить</button>
        </div>
      </div>
    </article>
  `;
}

grid.innerHTML = items.map(cardTemplate).join("");

grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-buy]");
    if (!btn) return;

    const itemId = btn.getAttribute("data-buy");
    const data = JSON.stringify({ action: "buy", item_id: itemId });

    // отправляем выбор в бот (бот выставит инвойс Stars)
    if (tg) tg.sendData(data);
});

document.getElementById("closeBtn").addEventListener("click", () => {
    if (tg) tg.close();
});