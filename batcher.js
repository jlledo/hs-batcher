const DRY_RUN = false;
const resolutions = [360, 480, 720, 1080];

// Uses XHR because for some reason it doesn't send an Origin header
// while fetch() sends 'Origin: null', which triggers CSRF protection
function post(path, params, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", path, true);

    xhr.onreadystatechange = function () {
        if (callback && xhr.readyState == 4)
            callback(xhr);
    };

    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key]);
    }
    xhr.send(formData);
}

async function getSettings() {
    let defaultsURL = browser.runtime.getURL("options/defaults.json");
    let response = await fetch(defaultsURL, { mode: "no-cors" });
    let defaults = await response.json();

    return browser.storage.sync.get(defaults);
}

async function downloadVisibleLinks(res) {
    let magnets = {};
    magnets[res] = document.querySelectorAll("div[class$='" + res + "p'] a[title='Magnet Link']");

    if (!DRY_RUN) {
        let settings = await getSettings();
        let torrentAddPath = "api/v2/torrents/add";
        if (settings.apiVersion == 1) {
            torrentAddPath = "command/download";
        }
        let downloadEndpoint = `http://${settings.host}:${settings.port}/${torrentAddPath}`;

        let magnetURLs = Array.from(magnets[res], a => a.href).reverse().join("\n");
        post(downloadEndpoint, { urls: magnetURLs });
    } else {
        console.log("Magnets found for " + res + "p: " + magnets[res].length);
    }
}

function injectElements() {
    let parent = document.querySelector(".episode-container");

    let div = document.createElement("div");
    div.setAttribute("class", "hs-batcher");
    div.style.paddingTop = "5px";
    parent.insertBefore(div, parent.childNodes[4].nextSibling);

    let wrapper = document.createElement("div");
    wrapper.style.textAlign = "center";
    div.append(wrapper);

    let select = document.createElement("select");
    for (let i = 0; i < resolutions.length; i++) {
        let option = document.createElement("option");
        option.value = resolutions[i];
        option.text = resolutions[i] + "p";
        select.append(option);
    }
    wrapper.append(select);

    let button = document.createElement("button");
    button.innerHTML = "Download";
    button.onclick = () => downloadVisibleLinks(select.options[select.selectedIndex].value);
    wrapper.append(button);
}

injectElements();
