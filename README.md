# HorribleSubs batcher

WebExtension to create naive batch downloads before official HorribleSubs batches exist.

**Warning**: This extension was created for qBittorrent's WebUI, it currently does not work with other BitTorrent clients. I will update it to work with BitTorrent and uTorrent Soon™.

**Warning**: This extension has only been tested on **Firefox**.

Feel free to request or contribute any features.

## How to use

1. Install and open qBittorrent
2. Open Preferences > WebUI
3. Check the "Web User Interface (Remote control)" box and "Bypass authentication for clients on localhost" below it
4. Download the extension from "Releases" and install it on your browser. Drag the file onto it or something.
5. Open `https://horriblesubs.info/shows/<your-anime-here>` on your browser.
6. Choose a resolution from the dropdown list below the episode filter text box.
7. Click the Download button.

Remember to open qBittorrent before you try to download anything, otherwise it won't work. I will try to implement some kind of alert if possible.

## How it works

* It gets a list of all magnet links that are visible on the page, with the selected resolution
* Sends the list to your qBittorrent WebUI `/download` endpoint. It currently assumes no authentication is needed on localhost.

## TODO

* Add BitTorrent and uTorrent compatibility
* Add images to README
* Check if alert can be implemented to popup if your qBittorrent client is not open
