const getDataSocket = (url, onMessageFunc) => {
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

const shoutemDataRead = (url) => {
  return fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url))
    .then((response) => response.json())
    .then((result) => {
      const htmlObject = document.createElement("div");
      htmlObject.innerHTML = result?.contents;
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

const tamburaskiSongDataFunc = (url, setFunc) => {
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

const DRSSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://amu.me/wp-content/uploads/2018/04/DRS-logo3-300x192-1.jpg",
    artist: "??",
  };

  shoutemDataRead(url)
    .then((r) => {
      data.nowplaying = r.nowplaying;
      data.artist = r.artist;
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

const fortunaSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://cdn.onlineradiobox.com/img/l/7/13697.v4.png",
    artist: "??",
  };

  setFunc(data);
};

const banovinaSongDataFunc = (url, setFunc) => {
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

const radioDjakovoSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.radio-djakovo.hr/wp-content/uploads/2018/06/Radio-Djakovo-live-stream-logo-final.jpg",
    artist: "??",
  };

  setFunc(data);
};

const slavonskiSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://slavonskiradio.hr/wp-content/uploads/2024/09/LOGO-SLAVONSKI-COLOR-PNG.png",
    artist: "??",
  };

  setFunc(data);
};

const antenaSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.antenazagreb.hr/wp-content/uploads/2018/03/ANTENA-LOGOTIP-2018-color-landscape-2.png",
    artist: "??",
  };

  fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url))
    .then((response) => response.text())
    .then((result) => {
      data.nowplaying = `${result?.contents.split(" - ")[1]}`;
      data.artist = result?.contents.split(" - ")[0];
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

const naxiSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://www.naxi.rs/images/naxiLive.png",
    artist: "??",
  };

  const getCurrentSong = (jsonData) => {
    const html = jsonData.rs || jsonData.rs2;
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
      const [nowplaying, artist, coverart] = getCurrentSong(JSON.parse(result.contents));
      data.nowplaying = nowplaying;
      data.artist = artist;
      if (coverart) {
        data.coverart = coverart;
      }
    })
    .catch((error) => console.warn("Fetch error:", error))
    .finally(() => {
      setFunc(data);
    });
};

const otvoreniSongDataFunc = (url, setFunc) => {
  const data = {
    nowplaying: "??",
    coverart: "https://static.mytuner.mobi/media/tvos_radios/wSGYWxvtqZ.jpg",
    artist: "??",
  };

  getDataSocket(url, (result) => {
    data.nowplaying = result.nowplaying;
    setFunc(data);
  });
};

/////////////////////
/// Format for streams
////////////////////
/* list of streams to be shown
    name: name to show
    url: stream url
    web: radio webpage
    radioLogo: radio logo (optional)
    historyUrl: link to songs history (optional)
    currentSongUrl: url to current song details (optional)
    currentSongDataFunc: function to transform current song data (optional)
    frequencies: FM frequencies on which radio is available (MHz)
*/
const streams = [
  {
    name: "Tamburaški",
    url: "https://listen.radioking.com/radio/552965/stream/612287",
    web: "https://www.tamburaski.com/",
    radioLogo: "https://static.mytuner.mobi/media/tvos_radios/519/tamburaski-radio.d10ee027.png",
    currentSongUrl: "https://api.radioking.io/widget/radio/tamburaskiradio/track/current",
    currentSongDataFunc: tamburaskiSongDataFunc,
  },
  {
    name: "DRS",
    url: "https://eu2.fastcast4u.com/proxy/mic0?mp=/stream",
    web: "https://drugacija.me/",
    radioLogo: "https://amu.me/wp-content/uploads/2018/04/DRS-logo3-300x192-1.jpg",
    frequencies: ["104,8", "101,5", "97,1", "95,5", "93,0", "90,3"],
    currentSongUrl: "https://eu2.fastcast4u.com/proxy/mic0/7.html",
    currentSongDataFunc: DRSSongDataFunc,
  },
  {
    name: "Radio Fortuna MK",
    url: "https://radiofortuna.ipradio.mk/;",
    web: "https://radiofortuna.com.mk/",
    radioLogo: "https://cdn.onlineradiobox.com/img/l/7/13697.v4.png",
    frequencies: ["96,8"],
    historyUrl: "https://radiofortuna.ipradio.mk/played.html",
    currentSongDataFunc: fortunaSongDataFunc,
  },
  {
    name: "Banovina Uživo",
    url: "https://audio.radio-banovina.hr:9998/stream",
    web: "https://www.radio-banovina.hr/",
    radioLogo: "https://upload.wikimedia.org/wikipedia/hr/0/0b/Radio_Banovina_logo.jpg",
    frequencies: ["99,1", "96,8", "93,2"],
    historyUrl: "https://www.radio-banovina.hr/uzivo/song_history.html",
    currentSongUrl: "https://pool.alter-media.hr:2020/json/stream/banovina",
    currentSongDataFunc: banovinaSongDataFunc,
  },
  {
    name: "Banovina Light",
    url: "https://audio.radio-banovina.hr:7008/stream",
    web: "https://www.radio-banovina.hr/",
    radioLogo: "https://upload.wikimedia.org/wikipedia/hr/0/0b/Radio_Banovina_logo.jpg",
    historyUrl: "https://www.radio-banovina.hr/light/povijest.html",
    currentSongUrl: "https://pool.alter-media.hr:2020/json/stream/light",
    currentSongDataFunc: banovinaSongDataFunc,
  },
  {
    name: "Banovina Turbo",
    url: "https://audio.radio-banovina.hr:7010/stream",
    web: "https://www.radio-banovina.hr/",
    radioLogo: "https://upload.wikimedia.org/wikipedia/hr/0/0b/Radio_Banovina_logo.jpg",
    historyUrl: "https://www.radio-banovina.hr/turbo/povijest.html",
    currentSongUrl: "https://pool.alter-media.hr:2020/json/stream/turbo",
    currentSongDataFunc: banovinaSongDataFunc,
  },
  {
    name: "Đakovo",
    url: "https://ec2s.crolive.com.hr:8305/stream",
    web: "https://www.radio-djakovo.hr/",
    radioLogo: "https://www.radio-djakovo.hr/wp-content/uploads/2018/06/Radio-Djakovo-live-stream-logo-final.jpg",
    frequencies: ["100,2", "89,6"],
    currentSongDataFunc: radioDjakovoSongDataFunc,
  },
  {
    name: "Slavonski",
    url: "https://ec2s.crolive.com.hr:8035/stream",
    web: "https://www.slavonskiradio.hr/",
    radioLogo: "https://slavonskiradio.hr/wp-content/uploads/2024/09/LOGO-SLAVONSKI-COLOR-PNG.png",
    frequencies: ["106,2", "100,6", "91,0", "89,7"],
    currentSongDataFunc: slavonskiSongDataFunc,
  },
  {
    name: "Antena Zagreb",
    url: "https://audio.social3.hr/listen/antena_aac/stream",
    web: "https://www.antenazagreb.hr/",
    radioLogo: "https://www.antenazagreb.hr/wp-content/uploads/2018/03/ANTENA-LOGOTIP-2018-color-landscape-2.png",
    historyUrl: "https://streaming.antenazagreb.hr/stream/player/player.html",
    frequencies: ["89,7"],
    currentSongUrl: "https://streaming.antenazagreb.hr/stream/player/info/listen_antena_aac_.txt",
    currentSongDataFunc: antenaSongDataFunc,
  },
  {
    name: "Naxi Radio BG",
    url: "https://naxi128ssl.streaming.rs:9152/;",
    web: "https://www.naxi.rs/",
    radioLogo: "https://www.naxi.rs/images/naxiLive.png",
    frequencies: ["96,9"],
    currentSongUrl: "https://www.naxi.rs/stations/rs-naxi.json?_=",
    currentSongDataFunc: naxiSongDataFunc,
  },
  {
    name: "Otvoreni",
    url: "https://stream2.otvoreni.hr/otvoreni",
    web: "https://www.otvoreni.hr/",
    frequencies: [
      "107,9",
      "107,5",
      "107,3",
      "105,6",
      "104,4",
      "104,3",
      "104,2",
      "103,3",
      "102,6",
      "99,3",
      "97,7",
      "93,2",
      "97,3",
      "92,6",
      "92,5",
      "91,2",
      "91,1",
      "90,6",
      "89,6",
      "88,3",
      "87,6",
    ],
    currentSongUrl: "wss://s-usc1f-nss-2501.firebaseio.com/.ws?v=5&ns=otvoreni-radio-player",
    currentSongDataFunc: otvoreniSongDataFunc,
  },
  {
    name: "Antena Božić",
    url: "https://audio.social3.hr/listen/antena_love/stream",
    web: "https://www.antenazagreb.hr/",
    radioLogo: "https://www.antenazagreb.hr/wp-content/uploads/2018/03/ANTENA-LOGOTIP-2018-color-landscape-2.png",
    historyUrl: "https://streaming.antenazagreb.hr/stream/player/player.html",
    currentSongUrl: "https://streaming.antenazagreb.hr/stream/player/info/listen_antena_love_.txt",
    currentSongDataFunc: antenaSongDataFunc,
  },
];

export default streams;
