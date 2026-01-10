const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = text;
}

if (tg) {
  tg.ready();
  tg.expand();
  setStatus("Открыто в Telegram WebApp. Нажмите «Купить».");
} else {
  setStatus("Откройте витрину через кнопку бота, иначе покупка не работает.");
}

const items = [
  { id: "rose",    title: "Букет роз",       desc: "Выдача админом после покупки.", price: 25, img: "https://picsum.photos/seed/rose/600/400" },
  { id: "bear",    title: "Плюшевый мишка",  desc: "Выдача админом после покупки.", price: 40, img: "https://picsum.photos/seed/bear/600/400" },
  { id: "choco",   title: "Набор шоколада",  desc: "Выдача админом после покупки.", price: 15, img: "https://picsum.photos/seed/choco/600/400" },
];

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

// ВАЖНО: вешаем обработчик на каждую кнопку (без closest/делегирования)
document.querySelectorAll(".buy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const itemId = btn.dataset.id;
    setStatus(`Клик: ${itemId}. Отправляю запрос боту…`);

    if (!tg) {
      alert("Открыто не внутри Telegram WebApp. Откройте через кнопку бота.");
      setStatus("Ошибка: не Telegram WebApp");
      return;
    }

    const data = JSON.stringify({ action: "buy", item_id: itemId });

    try {
      tg.sendData(data);
      // Можно не закрывать, но часто удобно:
      // tg.close();
    } catch (e) {
      alert("sendData ошибка: " + (e?.message || e));
      setStatus("Ошибка sendData: " + (e?.message || e));
    }
  });
});

document.getElementById("closeBtn").addEventListener("click", () => {
  if (tg) tg.close();
});
