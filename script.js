const phone = document.querySelector(".phone");
const pageButtons = document.querySelectorAll("[data-page-target]");
const pages = document.querySelectorAll(".prototype-page");
const headerStatus = document.querySelector(".header-status-img");
const headerBrand = document.querySelector(".header-brand-img");
const headerTabs = document.querySelector(".header-tabs-img");

const headerAssets = {
  new: {
    status: "./assets/header-new-status.png",
    brand: "./assets/header-new-brand.png",
    tabs: "./assets/header-new-tabs.png",
  },
  hot: {
    status: "./assets/header-hot-status.png",
    brand: "./assets/header-hot-brand.png",
    tabs: "./assets/header-hot-tabs.png",
  },
  best: {
    status: "./assets/header-best-status.png",
    brand: "./assets/header-best-brand.png",
    tabs: "./assets/header-best-tabs.png",
  },
};

const products = [
  {
    id: "ring",
    name: "백설 된장찌개 1분링 64G",
    image: "./assets/spotlight-ring.png",
    category: "meal today soup",
    badge: "15% 할인",
    badgeTone: "plus",
    price: "33,867",
    oldPrice: "47,700원",
    temp: "상온",
  },
  {
    id: "jang",
    name: "비비고 돼지고기 장조림 370g",
    image: "./assets/spotlight-jangjorim.png",
    category: "easy gold soup",
    price: "33,867",
    oldPrice: "47,700원",
    temp: "냉동",
  },
  {
    id: "konbu",
    name: "쿠라콘 시오 콘부 47g",
    image: "./assets/spotlight-konbu.png",
    category: "snack gift",
    badge: "15% 할인",
    badgeTone: "plus",
    price: "33,867",
    oldPrice: "47,700원",
    temp: "상온",
  },
  {
    id: "slim",
    name: "이너비 슬리밍샷 라이트",
    image: "./assets/product-card-e.png",
    category: "drink today",
    badge: "오늘 특가",
    badgeTone: "dark",
    price: "33,867",
    oldPrice: "47,700원",
    temp: "상온",
  },
  {
    id: "gochu",
    name: "옛장 고추장 1KG",
    image: "./assets/product-card-b.png",
    category: "easy box soup",
    badge: "골라담기",
    badgeTone: "orange",
    price: "33,867",
    temp: "상온",
  },
  {
    id: "hanip",
    name: "은정한과 한입한과 200g 3종 세트",
    image: "./assets/product-card-c.png",
    category: "snack gold gift",
    badge: "박스특가",
    badgeTone: "gold",
    price: "33,867",
    oldPrice: "47,700원",
    temp: "상온",
  },
  {
    id: "calvo",
    name: "칼보 해바라기유 참치 65GX3번들 (고단백)",
    image: "./assets/weekly-second.png",
    category: "health rice",
    price: "33,867",
    temp: "상온",
  },
  {
    id: "salad",
    name: "두부 계란우유샐러드",
    image: "./assets/product-card-a.png",
    category: "meal health",
    price: "33,867",
    temp: "상온",
  },
];

const productById = Object.fromEntries(products.map((product) => [product.id, product]));

const setDeviceScale = () => {
  const isFullScreenPhone = window.matchMedia("(max-width: 460px)").matches;

  if (isFullScreenPhone) {
    document.documentElement.style.setProperty("--device-scale", "1");
    return;
  }

  const shellWidth = 428;
  const shellHeight = 882;
  const safePadding = 48;
  const scale = Math.min(
    1,
    (window.innerWidth - safePadding) / shellWidth,
    (window.innerHeight - safePadding) / shellHeight,
  );

  document.documentElement.style.setProperty("--device-scale", Math.max(0.72, scale).toFixed(4));
};

const makeProductCard = (product, options = {}) => {
  const rank = options.rank ? `<span class="rank-flag ${options.rank > 3 ? "muted" : ""}">${options.rank}</span>` : "";
  const badge = product.badge
    ? `<span class="badge ${product.badgeTone || ""}">${product.badge}</span>`
    : "";
  const tags = product.id === "gochu"
    ? `<span class="gray-tag tag">무료배송</span>`
    : `<span class="green-tag tag">신규입점</span><span class="orange-tag tag">5개 사면 10%할인</span>`;

  return `
    <article class="product-card" data-category="${product.category}">
      <div class="product-media">
        ${badge}
        ${rank}
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        ${product.oldPrice ? `<del>${product.oldPrice}</del>` : ""}
        <strong class="product-price"><em>29%</em> ${product.price}<span>원</span></strong>
        <div class="tags">${tags}</div>
        <p class="delivery"><img src="./assets/delivery.svg" alt="" />${product.temp} 8월 25일 도착예정</p>
      </div>
    </article>
  `;
};

const renderProducts = () => {
  document.querySelectorAll("[data-product]").forEach((slot) => {
    const product = productById[slot.dataset.product];
    if (!product) return;
    slot.innerHTML = makeProductCard(product).replace("product-card", "product-card compact-card");
  });

  const newProducts = [products[3], products[4], products[5], products[6], products[0], products[1], products[2], products[7], products[3], products[4], products[5], products[6]];
  const hotProducts = [products[3], products[4], products[5], products[6], products[3], products[4], products[5], products[6], products[0], products[1]];
  const bestProducts = [products[3], products[4], products[5], products[6], products[3], products[4], products[5], products[6]];

  document.querySelector('[data-grid="new"]').innerHTML = newProducts.map((product) => makeProductCard(product)).join("");
  document.querySelector('[data-grid="hot"]').innerHTML = hotProducts.map((product) => makeProductCard(product)).join("");
  document.querySelector('[data-grid="best"]').innerHTML = bestProducts.map((product, index) => makeProductCard(product, { rank: index + 2 })).join("");
};

const initSwipe = () => {
  document.querySelectorAll(".horizontal-scroll").forEach((list) => {
    let isDragging = false;
    let didMove = false;
    let startX = 0;
    let startScrollLeft = 0;

    list.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      isDragging = true;
      didMove = false;
      startX = event.clientX;
      startScrollLeft = list.scrollLeft;
      list.classList.add("is-dragging");
      list.setPointerCapture(event.pointerId);
    });

    list.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 4) didMove = true;
      list.scrollLeft = startScrollLeft - deltaX;
    });

    const stopDragging = (event) => {
      if (!isDragging) return;
      isDragging = false;
      list.classList.remove("is-dragging");
      if (list.hasPointerCapture(event.pointerId)) list.releasePointerCapture(event.pointerId);
    };

    list.addEventListener("pointerup", stopDragging);
    list.addEventListener("pointercancel", stopDragging);
    list.addEventListener("pointerleave", stopDragging);
    list.addEventListener(
      "click",
      (event) => {
        if (!didMove) return;
        event.preventDefault();
        event.stopPropagation();
        didMove = false;
      },
      true,
    );
  });
};

const activatePage = (target) => {
  pages.forEach((page) => page.classList.toggle("active", page.dataset.page === target));
  pageButtons.forEach((button) => button.classList.toggle("active", button.dataset.pageTarget === target));
  const assets = headerAssets[target];
  if (assets) {
    headerStatus.src = assets.status;
    headerBrand.src = assets.brand;
    headerTabs.src = assets.tabs;
  }
  phone.scrollTo({ top: 0, behavior: "auto" });
  phone.classList.remove("is-scrolled");
};

const initPageTabs = () => {
  pageButtons.forEach((button) => {
    button.addEventListener("click", () => activatePage(button.dataset.pageTarget));
  });
};

const initFilters = () => {
  document.querySelectorAll("[data-filter-group]").forEach((tabbar) => {
    const page = tabbar.closest(".prototype-page");
    const grid = page.querySelector(".product-grid");
    const buttons = tabbar.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        grid.querySelectorAll(".product-card").forEach((card) => {
          const shouldShow = filter === "all" || card.dataset.category.split(" ").includes(filter);
          card.classList.toggle("is-hidden", !shouldShow);
        });
      });
    });
  });
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const initCountdowns = () => {
  const timers = Array.from(document.querySelectorAll("[data-countdown]")).map((timer) => ({
    element: timer,
    endAt: Date.now() + Number(timer.dataset.duration) * 1000,
    initial: Number(timer.dataset.duration),
  }));

  const tick = () => {
    timers.forEach((timer) => {
      const remaining = Math.max(0, Math.floor((timer.endAt - Date.now()) / 1000));
      timer.element.textContent = formatTime(remaining || timer.initial);
      if (remaining === 0) timer.endAt = Date.now() + timer.initial * 1000;
    });
  };

  tick();
  window.setInterval(tick, 1000);
};

const initHeaderScroll = () => {
  phone.addEventListener("scroll", () => {
    phone.classList.toggle("is-scrolled", phone.scrollTop > 16);
  }, { passive: true });
};

const initConfetti = () => {
  const confetti = document.querySelector(".confetti");
  if (!confetti) return;

  const colors = ["#12c486", "#ff7612", "#ffd23f", "#3a86ff", "#f15bb5"];
  confetti.innerHTML = Array.from({ length: 18 }, (_, index) => {
    const left = 6 + ((index * 17) % 88);
    const delay = (index % 9) * 210;
    const color = colors[index % colors.length];
    return `<i style="left:${left}%; background:${color}; animation-delay:${delay}ms"></i>`;
  }).join("");
};

renderProducts();
setDeviceScale();
initSwipe();
initPageTabs();
initFilters();
initCountdowns();
initHeaderScroll();
initConfetti();

window.addEventListener("resize", setDeviceScale);
