var DRY_RUN = false;
var resList = [480, 720, 1080];
var downloadPath = "http://localhost:8080/api/v2/torrents/add";

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

function downloadVisibleLinks(res) {
    let magnets = {};
    magnets[res] = document.querySelectorAll("div[class$='" + res + "p'] a[title='Magnet Link']");

    if (!DRY_RUN) {
        let magnetURLs = Array.from(magnets[res], a => a.href).reverse().join("\n");
        post(downloadPath, { urls: magnetURLs });
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
    for (let i = 0; i < resList.length; i++) {
        let option = document.createElement("option");
        option.value = resList[i];
        option.text = resList[i] + "p";
        select.append(option);
    }
    wrapper.append(select);

    let button = document.createElement("button");
    button.innerHTML = "Download";
    button.onclick = () => downloadVisibleLinks(select.options[select.selectedIndex].value);
    wrapper.append(button);
}

injectElements();
