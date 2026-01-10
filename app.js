const tg = window.Telegram?.WebApp || null;

// ВПИШИ username бота без @, например: "my_gift_shop_bot"
const BOT_USERNAME = "giftsfreeall399_bot";

const items = [
  { id: "rose", title: "Букет роз", desc: "Выдача админом после покупки.", price: 25, img: "./assets/img/rose.jpg" },
  { id: "bear", title: "Плюшевый мишка", desc: "Выдача админом после покупки.", price: 40, img: "./assets/img/bear.jpg" },
  { id: "choco", title: "Набор шоколада", desc: "Выдача админом после покупки.", price: 15, img: "./assets/img/choco.jpg" },
  { id: "perfume", title: "Парфюм", desc: "Выдача админом после покупки.", price: 70, img: "./assets/img/perfume.jpg" },
  { id: "giftbox", title: "Подарочный бокс", desc: "Выдача админом после покупки.", price: 55, img: "./assets/img/giftbox.jpg" },
];

const grid = document.getElementById("grid");
const closeBtn = document.getElementById("closeBtn");

function render() {
  grid.innerHTML = items.map(it => `
    <article class="card">
      <img class="card-img" src="${it.img}" alt="${it.title}">
      <div class="card-body">
        <h3 class="card-title">${it.title}</h3>
        <p class="card-desc">${it.desc}</p>
        <div class="row">
          <div class="price">${it.price} <span class="stars">⭐ Stars</span></div>
          <button class="btn buy-btn" type="button" data-id="${it.id}">Купить</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => buy(btn.dataset.id));
  });
}

function buy(itemId) {
  const url = `https://t.me/${BOT_USERNAME}?start=buy_${encodeURIComponent(itemId)}`;

  // Открываем бота. Telegram сам покажет инвойс, который бот пришлёт по /start параметру
  if (tg && typeof tg.openTelegramLink === "function") {
    tg.openTelegramLink(url);
    // Можно закрыть витрину сразу после перехода:
    setTimeout(() => { try { tg.close(); } catch (_) { } }, 150);
  } else {
    // Если открыли не в WebApp (на всякий случай)
    window.location.href = url;
  }
}

(function init() {
  if (tg) {
    try { tg.ready(); tg.expand(); } catch (_) { }
  }

  render();

  if (closeBtn) {
    closeBtn.addEventListener("click", () => { if (tg) tg.close(); });
  }
})();
