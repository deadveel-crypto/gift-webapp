// app.js — вариант "сразу в бота за инвойсом" (без initData/алертов/диагностики)
// При клике "Купить" открывает бота по deep-link: https://t.me/BOT_USERNAME?start=buy_<itemId>

const tg = window.Telegram?.WebApp || null;

// ВАЖНО: впиши username своего бота БЕЗ @ (пример: "my_gift_shop_bot")
const BOT_USERNAME = "giftsfreeall399_bot";

const items = [
  {
    id: "rose",
    title: "Роза",
    desc: "Выдача ботом после покупки.",
    price: 25,
    img: "./assets/img/rose.jpg"
  },
  {
    id: "bear",
    title: "Мишка",
    desc: "Выдача ботом после покупки.",
    price: 40,
    img: "./assets/img/bear.jpg"
  },
  {
    id: "choco",
    title: "Шоколадка",
    desc: "Выдача ботом после покупки.",
    price: 15,
    img: "./assets/img/choco.jpg"
  },
  {
    id: "giftbox",
    title: "Подарок",
    desc: "Выдача ботом после покупки.",
    price: 55,
    img: "./assets/img/giftbox.jpg"
  }
];

const grid = document.getElementById("grid");
const closeBtn = document.getElementById("closeBtn");

function render() {
  if (!grid) return;

  grid.innerHTML = items.map((it) => `
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

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => buy(btn.dataset.id));
  });
}

function buy(itemId) {
  if (!BOT_USERNAME || BOT_USERNAME === "ВАШ_USERNAME_БОТА") {
    console.error("BOT_USERNAME не задан в app.js");
    return;
  }

  const url = `https://t.me/${BOT_USERNAME}?start=buy_${encodeURIComponent(itemId)}`;

  if (tg && typeof tg.openTelegramLink === "function") {
    tg.openTelegramLink(url);
    setTimeout(() => {
      try { tg.close(); } catch (_) {}
    }, 150);
  } else {
    window.location.href = url;
  }
}

(function init() {
  if (tg) {
    try { tg.ready(); tg.expand(); } catch (_) {}
  }

  render();

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (tg) tg.close();
    });
  }
})();
