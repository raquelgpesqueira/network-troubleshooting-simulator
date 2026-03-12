const hintBox = document.getElementById("hintBox");
const toast = document.getElementById("toast");

const browserWindow = document.getElementById("browserWindow");
const browserContent = document.getElementById("browserContent");
const reloadBtn = document.getElementById("reloadBtn");
const closeBrowserBtn = document.getElementById("closeBrowserBtn");
const desktopPortal = document.getElementById("desktopPortal");
const taskPortal = document.getElementById("taskPortal");

const networkButton = document.getElementById("networkButton");
const networkCross = document.getElementById("networkCross");
const networkFlyout = document.getElementById("networkFlyout");
const troubleshootBtn = document.getElementById("troubleshootBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");

const networkSettingsWindow = document.getElementById("networkSettingsWindow");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const showNetworksBtn = document.getElementById("showNetworksBtn");
const networksWindow = document.getElementById("networksWindow");
const closeNetworksBtn = document.getElementById("closeNetworksBtn");
const networkConnectBtns = document.querySelectorAll(".network-connect-btn[data-network]");

const troubleshootWindow = document.getElementById("troubleshootWindow");
const closeTroubleshootBtn = document.getElementById("closeTroubleshootBtn");
const troubleshootLoading = document.getElementById("troubleshootLoading");
const troubleshootResult = document.getElementById("troubleshootResult");
const advancedTroubleshootBtn = document.getElementById("advancedTroubleshootBtn");
const fixInternetBtn = document.getElementById("fixInternetBtn");

const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("statusText");
const brokenLine = document.getElementById("brokenLine");
const ethernetState = document.getElementById("ethernetState");

const nextCaseBox = document.getElementById("nextCaseBox");
const nextCaseBtn = document.getElementById("nextCaseBtn");

const navButtons = {
  Estado: document.getElementById("navEstado"),
  Ethernet: document.getElementById("navEthernet"),
  Acceso: document.getElementById("navAcceso"),
  VPN: document.getElementById("navVPN"),
  Proxy: document.getElementById("navProxy")
};

const panels = {
  Estado: document.getElementById("panelEstado"),
  Ethernet: document.getElementById("panelEthernet"),
  Acceso: document.getElementById("panelAcceso"),
  VPN: document.getElementById("panelVPN"),
  Proxy: document.getElementById("panelProxy")
};

const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");

const state = {
  connected: false,
  caseCompleted: false,
  hintsLevel: 0,
  usedTroubleshooter: false,
  usedNetworksList: false
};

function updateClock() {
  const now = new Date();
  clockTime.textContent = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
  clockDate.textContent = now.toLocaleDateString("es-ES");
}

function showToast(message, type = "") {
  toast.textContent = message;
  toast.className = `toast ${type}`.trim();
  toast.classList.remove("hidden");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

function setHint(text) {
  hintBox.textContent = text;
}

function setDisconnectedUI() {
  state.connected = false;
  statusText.textContent = "No estás conectado a Internet.";
  statusText.className = "status-text disconnected";
  ethernetState.textContent = "No conectado";
  ethernetState.className = "ethernet-state disconnected";
  brokenLine.classList.add("broken");
  networkCross.classList.remove("hidden");
  connectBtn.disabled = false;
  connectBtn.textContent = "Conectar";
  nextCaseBox.classList.add("hidden");
  state.caseCompleted = false;
}

function setConnectedUI() {
  state.connected = true;
  state.caseCompleted = true;
  statusText.textContent = "Estás conectado a Internet.";
  statusText.className = "status-text connected";
  ethernetState.textContent = "Conectado";
  ethernetState.className = "ethernet-state connected";
  brokenLine.classList.remove("broken");
  networkCross.classList.add("hidden");
  connectBtn.disabled = true;
  connectBtn.textContent = "Conectado";
  nextCaseBox.classList.remove("hidden");
  setHint("Bien. Has restaurado la conectividad.");
  showToast("✔ Conexión restablecida. Caso 1 completado.", "success");
}

function resetBrowserError() {
  browserContent.classList.add("frozen");
}

function openBrowserWindow() {
  browserWindow.classList.remove("hidden");
  resetBrowserError();
}

function closeBrowserWindow() {
  browserWindow.classList.add("hidden");
}

function toggleFlyout(forceOpen = null) {
  const shouldOpen =
    forceOpen === null ? networkFlyout.classList.contains("hidden") : forceOpen;

  networkFlyout.classList.toggle("hidden", !shouldOpen);
}

function closeAllPopups() {
  networkFlyout.classList.add("hidden");
  networksWindow.classList.add("hidden");
  troubleshootWindow.classList.add("hidden");
}

function showPanel(name) {
  Object.keys(navButtons).forEach((key) => {
    navButtons[key].classList.toggle("active", key === name);
  });

  Object.keys(panels).forEach((key) => {
    panels[key].classList.toggle("active", key === name);
  });
}

function openSettings(panel = "Estado") {
  networkSettingsWindow.classList.remove("hidden");
  showPanel(panel);
}

function startTroubleshooter() {
  closeAllPopups();
  troubleshootWindow.classList.remove("hidden");
  troubleshootLoading.classList.remove("hidden");
  troubleshootResult.classList.add("hidden");

  setTimeout(() => {
    troubleshootLoading.classList.add("hidden");
    troubleshootResult.classList.remove("hidden");
  }, 1800);
}

function completeViaNetwork(networkName) {
  networksWindow.classList.add("hidden");
  networkSettingsWindow.classList.remove("hidden");
  showPanel("Estado");
  state.usedNetworksList = true;
  setConnectedUI();
  showToast(`✔ Conectado a la red ${networkName}.`, "success");
}

function scheduleHints() {
  setTimeout(() => {
    if (!state.connected) setHint("¿Qué puedes hacer para comprobar la conexión?");
  }, 18000);

  setTimeout(() => {
    if (!state.connected && state.hintsLevel < 1) {
      state.hintsLevel = 1;
      setHint("Revisa los indicadores de red o abre una herramienta de configuración de conexión.");
    }
  }, 36000);

  setTimeout(() => {
    if (!state.connected && state.hintsLevel < 2) {
      state.hintsLevel = 2;
      setHint("Busca una ruta de red válida: configuración, redes disponibles o diagnóstico.");
    }
  }, 54000);
}

/* eventos principales */

reloadBtn.addEventListener("click", () => {
  resetBrowserError();
  setHint("Observa la conexión.");
  showToast("La página se ha recargado, pero sigue sin responder correctamente.", "warning");
});

closeBrowserBtn.addEventListener("click", closeBrowserWindow);
desktopPortal.addEventListener("click", openBrowserWindow);
taskPortal.addEventListener("click", openBrowserWindow);

networkButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleFlyout();
});

openSettingsBtn.addEventListener("click", () => {
  closeAllPopups();
  openSettings("Estado");
});

troubleshootBtn.addEventListener("click", startTroubleshooter);
advancedTroubleshootBtn.addEventListener("click", startTroubleshooter);

closeSettingsBtn.addEventListener("click", () => {
  networkSettingsWindow.classList.add("hidden");
});

showNetworksBtn.addEventListener("click", () => {
  networksWindow.classList.remove("hidden");
});

closeNetworksBtn.addEventListener("click", () => {
  networksWindow.classList.add("hidden");
});

networkConnectBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    completeViaNetwork(btn.dataset.network);
  });
});

closeTroubleshootBtn.addEventListener("click", () => {
  troubleshootWindow.classList.add("hidden");
});

fixInternetBtn.addEventListener("click", () => {
  state.usedTroubleshooter = true;
  troubleshootWindow.classList.add("hidden");
  openSettings("Estado");
  showToast("Diagnóstico completado. Ya puedes intentar conectar.", "success");
});

connectBtn.addEventListener("click", () => {
  setConnectedUI();
});

nextCaseBtn.addEventListener("click", () => {
  showToast("Siguiente caso: aquí enlazarías con el caso 2.", "success");
});

Object.entries(navButtons).forEach(([name, btn]) => {
  btn.addEventListener("click", () => showPanel(name));
});

document.addEventListener("click", (e) => {
  const insideFlyout = networkFlyout.contains(e.target);
  const onNetwork = networkButton.contains(e.target);
  if (!insideFlyout && !onNetwork) {
    networkFlyout.classList.add("hidden");
  }
});

/* inicio */
updateClock();
setInterval(updateClock, 1000);
setDisconnectedUI();
resetBrowserError();
scheduleHints();