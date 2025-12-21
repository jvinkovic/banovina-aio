export const getDataSocket = (url, onMessageFunc) => {
  const socket = new WebSocket(url);

  socket.onopen = function (event) {
    // Handle connection open
  };

  socket.onmessage = function (event) {
    onMessageFunc(event.data);
  };

  socket.onclose = function (event) {
    // Handle connection close
  };

  const sendMessage = (message) => {
    socket.send(message);
  };

  return {};
};

export const shoutemDataRead = (url) => {
  return fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url))
    .then((response) => response.json())
    .then((result) => {
      const contents = result?.contents || "";
      const htmlObject = document.createElement("div");
      htmlObject.innerHTML = contents;
      const info = htmlObject.innerText;

      if (!info) {
        return;
      }

      const listeners = info.split(",")[0];
      let currentInfo = info.split(",");
      currentInfo.reverse();
      currentInfo = currentInfo[0];
      const artist = currentInfo.split(" - ")[0];
      const title = currentInfo.split(" - ")[1];
      const data = {
        nowplaying: `${title} [#${listeners}]`,
        artist: artist,
      };

      return data;
    });
};

export const tamburaskiSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "",
    artist: "??",
  };

  fetch(url)
    .then((r) => r.json())
    .then((result) => {
      const album = result?.album || " / ";
      data.nowplaying = `${result.title} (${album})`;
      data.coverart = result.cover;
      data.artist = result.artist;
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

export const DRSSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://amu.me/wp-content/uploads/2018/04/DRS-logo3-300x192-1.jpg",
    artist: "??",
  };

  shoutemDataRead(url)
    .then((r) => {
      if (r) {
        data.nowplaying = r.nowplaying;
        data.artist = r.artist;
      }
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

export const fortunaSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://cdn.onlineradiobox.com/img/l/7/13697.v4.png",
    artist: "??",
  };

  setFunc(data);
};

export const banovinaSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "",
    artist: "??",
  };

  fetch(url)
    .then((r) => r.json())
    .then((result) => {
      data.nowplaying = result.nowplaying;
      data.coverart = result.coverart;
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

export const radioDjakovoSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.radio-djakovo.hr/wp-content/uploads/2018/06/Radio-Djakovo-live-stream-logo-final.jpg",
    artist: "??",
  };

  setFunc(data);
};

export const slavonskiSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://slavonskiradio.hr/wp-content/uploads/2024/09/LOGO-SLAVONSKI-COLOR-PNG.png",
    artist: "??",
  };

  setFunc(data);
};

export const antenaSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.antenazagreb.hr/wp-content/uploads/2018/03/ANTENA-LOGOTIP-2018-color-landscape-2.png",
    artist: "??",
  };

  fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url))
    .then((response) => response.json())
    .then((result) => {
      const contents = result?.contents || "";
      const parts = contents.split(" - ");
      data.artist = parts[0] ? parts[0].trim() : data.artist;
      data.nowplaying = parts[1] ? parts[1].trim() : data.nowplaying;
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

export const naxiSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.naxi.rs/images/naxiLive.png",
    artist: "??",
  };

  const getCurrentSong = (jsonData) => {
    const html = jsonData?.rs || jsonData?.rs2;
    const result = {};
    if (!html) return;

    const container = document.createElement("div");
    container.innerHTML = html;

    // Current song info
    const details = container.querySelector("div.onAir .details");
    if (details) {
      // Find artist and song
      const pTags = details.querySelectorAll("p");
      if (pTags.length > 1) {
        // Second <p> contains artist and song
        const artistSpan = pTags[1].querySelector("span");
        if (artistSpan) {
          result.artist = artistSpan.textContent.trim();
        }
        // The text after the span is the song title
        const text = pTags[1].childNodes;
        for (let i = 0; i < text.length; i++) {
          if (text[i].nodeType === 3 && text[i].textContent.includes("-")) {
            result.nowplaying = text[i].textContent.replace("-", "").trim();
            break;
          }
        }
      }
    }

    // Cover art
    const img = container.querySelector("div.onAir .images img");
    if (img && img.getAttribute("src")) {
      let src = img.getAttribute("src");
      if (src.startsWith("//")) src = "https:" + src;
      result.coverart = src;
    }

    return [result.nowplaying, result.artist, result.coverart];
  };

  url = url + Date.now(); // Prevent caching
  fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url))
    .then((r) => r.json())
    .then((result) => {
      const contents = result?.contents || "";
      let parsed = null;
      try {
        parsed = JSON.parse(contents);
      } catch (e) {
        console.warn("Could not parse contents as JSON", e);
      }
      if (parsed) {
        const [nowplaying, artist, coverart] = getCurrentSong(parsed);
        data.nowplaying = nowplaying || data.nowplaying;
        data.artist = artist || data.artist;
        if (coverart) data.coverart = coverart;
      }
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

export const otvoreniSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://static.mytuner.mobi/media/tvos_radios/wSGYWxvtqZ.jpg",
    artist: "??",
  };

  getDataSocket(url, (result) => {
    // result may be string or object depending on socket - try to parse
    let parsed = result;
    try {
      parsed = typeof result === "string" ? JSON.parse(result) : result;
    } catch (e) {
      // leave parsed as original
    }
    data.nowplaying = parsed?.nowplaying || data.nowplaying;
    setFunc(data);
  });
};