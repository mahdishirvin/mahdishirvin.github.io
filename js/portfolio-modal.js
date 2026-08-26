(function () {
  var trigger = document.querySelector("[data-modal-trigger]");
  var backdrop = document.querySelector("[data-modal-backdrop]");
  if (!trigger || !backdrop) return;

  var modal = backdrop.querySelector(".modal");
  var closeBtn = backdrop.querySelector("[data-modal-close]");
  var lastFocused = null;

  function focusableElements() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function openModal() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", handleKeydown);
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      var items = focusableElements();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (event) {
    if (event.target === backdrop) closeModal();
  });
})();
