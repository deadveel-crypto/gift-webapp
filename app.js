// app.js — версия с максимальной надёжностью для Telegram WebApp
// 1) Пишет статус внизу
// 2) Проверяет, что это РЕАЛЬНЫЙ WebApp (tg.initData не пустой)
// 3) При покупке: tg.sendData(...) + tg.close() (на части клиентов доставка происходит после close)
// 4) Если это не WebApp-контекст — показывает понятную ошибку и (опционально) даёт fallback через deep-link /start

const tg = window.Telegram?.WebApp || null;

const BOT_USERNAME = ""; 
// <-- опционально: впиши username бота БЕЗ @ (например: "gift_shop_bot").
// Нужен только для fallback-режима, если sendData не работает.

const items = [
  {
    id: "rose",
    title: "Букет роз",
    desc: "Выдача админом после покупки.",
    price: 25,
    img: "https://picsum.photos/seed/rose/600/400"
  },
  {
    id: "bear",
    title: "Плюшевый мишка",
    desc: "Выдача админом после покупки.",
    price: 40,
    img: "https://picsum.photos/seed/bear/600/400"
  },
  {
    id: "choco",
    title: "Набор шоколада",
    desc: "Выдача админом после покупки.",
    price: 15,
    img: "https://picsum.photos/seed/choco/600/400"
  },
  {
    id: "perfume",
    title: "Парфюм",
    desc: "Выдача админом после покупки.",
    price: 70,
    img: "https://picsum.photos/seed/perfume/600/400"
  },
  {
    id: "giftbox",
    title: "Подарочный бокс",
    desc: "Выдача админом после покупки.",
    price: 55,
    img: "https://picsum.photos/seed/giftbox/600/400"
  }
];

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

function isRealWebApp() {
  // Самый важный критерий: initData НЕ пустой => страница открыта именно как WebApp через кнопку
  return !!(tg && typeof tg.sendData === "function" && tg.initData && tg.initData.length > 0);
}

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

  // Надёжно: вешаем обработчики напрямую на кнопки
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => onBuy(btn.dataset.id));
  });
}

function onBuy(itemId) {
  setStatus(`Клик: ${itemId}. Пытаюсь отправить запрос боту…`);

  // Если tg вообще нет — открыли в обычном браузере
  if (!tg) {
    show("Откройте витрину через кнопку в Telegram-боте (WebApp).");
    setStatus("Ошибка: Telegram.WebApp недоступен.");
    return;
  }

  // Если tg есть, но initData пустой — открыто НЕ как WebApp (часто через ссылку/браузер внутри Telegram)
  if (!isRealWebApp()) {
    setStatus("Ошибка: initData пустой (не WebApp-контекст).");

    // Fallback: уводим пользователя в бота через /start параметр
    if (BOT_USERNAME) {
      show("Открыто не как WebApp. Сейчас перекину в бота для покупки…");
      tg.openTelegramLink(`https://t.me/${BOT_USERNAME}?start=buy_${encodeURIComponent(itemId)}`);
    } else {
      show(
        "Открыто не как WebApp (initData пустой).\n" +
        "Откройте витрину через кнопку бота.\n\n" +
        "Если хотите fallback-режим — впишите BOT_USERNAME в app.js."
      );
    }
    return;
  }

  const data = JSON.stringify({ action: "buy", item_id: itemId });

  try {
    // Подтверждение, чтобы было видно, что sendData реально вызвался
    // (можно потом убрать)
    // show("sendData отправляю…");

    tg.sendData(data);

    // На части клиентов доставка web_app_data происходит после закрытия WebApp:
    setTimeout(() => {
      try { tg.close(); } catch (_) {}
    }, 150);

    setStatus("Запрос отправлен. Сейчас бот выставит счёт…");
  } catch (e) {
    show("Ошибка sendData: " + (e?.message || e));
    setStatus("Ошибка sendData: " + (e?.message || e));
  }
}

(function init() {
  if (tg) {
    try {
      tg.ready();
      tg.expand();
    } catch (_) {}
  }

  // Стартовый статус с диагностикой
  if (!tg) {
    setStatus("Открыто вне Telegram. Откройте через кнопку бота.");
  } else {
    const initLen = (tg.initData || "").length;
    setStatus(`Готово. Telegram WebApp найден. initData length: ${initLen}`);
  }

  render();

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (tg) tg.close();
    });
  }
})();
