const tabButtons = document.querySelectorAll(".product-tabs button");
const productCards = document.querySelectorAll(".product-card");
const swipeLists = document.querySelectorAll(".horizontal-scroll");

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

setDeviceScale();
window.addEventListener("resize", setDeviceScale);

swipeLists.forEach((list) => {
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

    if (list.hasPointerCapture(event.pointerId)) {
      list.releasePointerCapture(event.pointerId);
    }
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

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    tabButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    productCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
