function refreshStatus() {
  setTimeout(() => {
    location.reload();
  }, 5000);
}
window.onload = refreshStatus();
