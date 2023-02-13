function refreshStatus() {
  setTimeout(() => {
    location.reload();
  }, 2000);
}
window.onload = refreshStatus();
