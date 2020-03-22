function saveOptions(e) {
    let formData = new FormData(e.srcElement);
    browser.storage.sync.set({
        apiVersion: formData.get("apiVersion"),
        host: formData.get("host"),
        port: formData.get("port"),
    });
    e.preventDefault();
}

async function restoreOptions() {
    let defaultsURL = browser.runtime.getURL("options/defaults.json");
    let response = await fetch(defaultsURL, { mode: "no-cors" });
    let defaults = await response.json();

    let settings = await browser.storage.sync.get(defaults);
    document.getElementById(`apiVersion${settings.apiVersion}`).checked = true;
    document.getElementById("host").value = settings.host;
    document.getElementById("port").value = settings.port;
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
