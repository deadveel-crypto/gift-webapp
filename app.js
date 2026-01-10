const tg = window.Telegram?.WebApp;
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = text;
}

if (tg) {
  tg.ready();
  tg.expand();
  setStatus("Открыто в Telegram WebApp. Выберите подарок.");
} else {
  setStatus("Откройте витрину через кнопку в Telegram-боте (иначе покупка не работает).");
}

const items = [
  { id: "rose",    title: "Букет роз",       desc: "Выдача админом после покупки.", price: 25, img: "https://picsum.photos/seed/rose/600/400" },
  { id: "bear",    title: "Плюшевый мишка",  desc: "Выдача админом после покупки.", price: 40, img: "https://picsum.photos/seed/bear/600/400" },
  { id: "choco",   title: "Набор шоколада",  desc: "Выдача админом после покупки.", price: 15, img: "https://picsum.photos/seed/choco/600/400" },
  { id: "perfume", title: "Парфюм",          desc: "Выдача админом после покупки.", price: 70, img: "https://picsum.photos/seed/perfume/600/400" },
  { id: "giftbox", title: "Подарочный бокс", desc: "Выдача админом после покупки.", price: 55, img: "https://picsum.photos/seed/giftbox/600/400" },
];

const grid = document.getElementById("grid");

grid.innerHTML = items.map(it => `
  <article class="card">
    <img class="card-img" src="${it.img}" alt="${it.title}">
    <div class="card-body">
      <h3 class="card-title">${it.title}</h3>
      <p class="card-desc">${it.desc}</p>
      <div class="row">
        <div class="price">${it.price} <span class="stars">⭐ Stars</span></div>
        <button class="btn buy-btn" data-id="${it.id}">Купить</button>
      </div>
    </div>
  </article>
`).join("");

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".buy-btn");
  if (!btn) return;

  const itemId = btn.dataset.id;

  // ЯВНАЯ РЕАКЦИЯ: чтобы было понятно, что клик сработал
  setStatus(`Отправляю запрос на покупку: ${itemId}...`);

  const data = JSON.stringify({ action: "buy", item_id: itemId });

  if (!tg) {
    alert("Это не Telegram WebApp. Откройте витрину через кнопку бота.");
    setStatus("Ошибка: открыто не в Telegram WebApp.");
    return;
  }

  tg.sendData(data);       // отправит сообщение боту
  // tg.close();           // можно закрыть, но обычно Telegram сам закрывает после sendData
});

document.getElementById("closeBtn").addEventListener("click", () => {
  if (tg) tg.close();
});
