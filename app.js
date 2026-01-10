const tg = window.Telegram?.WebApp || null;

// ВАЖНО: впиши username бота БЕЗ @, иначе fallback не сможет открыть бота
// пример: const BOT_USERNAME = "my_gift_shop_bot";
const BOT_USERNAME = "giftsfreeall399_bot";

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const closeBtn = document.getElementById("closeBtn");

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function show(text) {
  if (tg && typeof tg.showAlert === "function") tg.showAlert(text);
  else alert(text);
}

function initDataLen() {
  return (tg?.initData || "").length;
}

function isRealWebApp() {
  return !!(tg && typeof tg.sendData === "function" && initDataLen() > 0);
}

const items = [
  { id: "rose",    title: "Букет роз",       desc: "Выдача админом после покупки.", price: 25, img: "https://picsum.photos/seed/rose/600/400" },
  { id: "bear",    title: "Плюшевый мишка",  desc: "Выдача админом после покупки.", price: 40, img: "https://picsum.photos/seed/bear/600/400" },
  { id: "choco",   title: "Набор шоколада",  desc: "Выдача админом после покупки.", price: 15, img: "https://picsum.photos/seed/choco/600/400" },
  { id: "perfume", title: "Парфюм",          desc: "Выдача админом после покупки.", price: 70, img: "https://picsum.photos/seed/perfume/600/400" },
  { id: "giftbox", title: "Подарочный бокс", desc: "Выдача админом после покупки.", price: 55, img: "https://picsum.photos/seed/giftbox/600/400" },
];

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
    btn.addEventListener("click", () => onBuy(btn.dataset.id));
  });
}

function openFallback(itemId) {
  if (!tg || !BOT_USERNAME) {
    show("Fallback не настроен: проверь BOT_USERNAME в app.js");
    return;
  }
  tg.openTelegramLink(`https://t.me/${BOT_USERNAME}?start=buy_${encodeURIComponent(itemId)}`);
}

function onBuy(itemId) {
  const len = initDataLen();
  setStatus(`Клик: ${itemId}. initData length=${len}`);

  if (!tg) {
    show("Открой витрину через Telegram-бота (WebApp). Сейчас Telegram.WebApp недоступен.");
    return;
  }

  // 1) Пытаемся нормальный путь sendData
  if (isRealWebApp()) {
    try {
      tg.sendData(JSON.stringify({ action: "buy", item_id: itemId }));
      setStatus("sendData отправлен. Если бот не прислал счёт — открою fallback…");

      // 2) Если на твоём клиенте sendData не доставляется — fallback спасёт
      setTimeout(() => {
        if (typeof tg.showConfirm === "function") {
          tg.showConfirm("Счёт не появился? Открыть оформление в боте?", (ok) => {
            if (ok) openFallback(itemId);
          });
        } else {
          // если confirm недоступен — просто откроем fallback
          openFallback(itemId);
        }
      }, 1200);

      return;
    } catch (e) {
      show("sendData ошибка: " + (e?.message || e));
      setStatus("sendData ошибка. Открываю fallback…");
      openFallback(itemId);
      return;
    }
  }

  // initData пустой => домен не разрешён/не WebApp-контекст => сразу fallback
  show("initData пустой. Проверь /setdomain в BotFather. Открываю оформление в боте…");
  openFallback(itemId);
}

(function init() {
  if (tg) {
    try { tg.ready(); tg.expand(); } catch (_) {}
    setStatus(`Telegram WebApp найден. initData length=${initDataLen()}`);
  } else {
    setStatus("Открыто вне Telegram WebApp.");
  }

  render();

  if (closeBtn) {
    closeBtn.addEventListener("click", () => { if (tg) tg.close(); });
  }
})();
