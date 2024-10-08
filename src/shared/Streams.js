const banovinaSongDataFunc = (input, setFunc) => {
    const data = {
        nowplaying: input.nowplaying,
        coverart: input.coverart
    };
    
    setFunc(data);
};

const tamburaskiSongDataFunc = (input, setFunc) => {
    const album = !!input?.album ? input.album : ' / ';
    const data = {
        nowplaying: `${input.title} (${album})`,
        coverart: input.cover,
        artist: input.artist
    };
    
    setFunc(data);
}

/* list of streams to be shown
    name: name to show
    url: stream url
    web: radio webpage
    historyUrl: link to songs history (optional)
    currentSongUrl: url to current song details (optional)
    currentSongDataFunc: function to transform current song data (optional)
    frequencies: FM frequencies on which radio is available (MHz)
*/
const streams = [
    { 
        name: 'Tamburaški',
        url: 'https://listen.radioking.com/radio/552965/stream/612287',
        web: 'https://www.tamburaski.com/',        
        currentSongUrl: 'https://api.radioking.io/widget/radio/tamburaskiradio/track/current',
        currentSongDataFunc: tamburaskiSongDataFunc,
    },
    { 
        name: 'DRS',
        url: 'https://eu2.fastcast4u.com/proxy/mic0?mp=/stream&1724290816711',
        web: 'https://drugacija.me/',
        frequencies: ['104,8', '101,5', '97,1', '95,5', '93,0', '90,3'],
    },
    { 
        name: 'Banovina Uživo',
        url: 'https://audio.radio-banovina.hr:9998/stream',
        web: 'https://www.radio-banovina.hr/',
        frequencies: ['99,1', '96,8', '93,2'],
        historyUrl: 'https://www.radio-banovina.hr/uzivo/song_history.html',
        currentSongUrl: 'https://pool.alter-media.hr:2020/json/stream/banovina',
        currentSongDataFunc: banovinaSongDataFunc
    },
    { 
        name: 'Banovina Light',
        url: 'https://audio.radio-banovina.hr:7008/stream',
        web: 'https://www.radio-banovina.hr/',
        historyUrl: 'https://www.radio-banovina.hr/light/povijest.html',
        currentSongUrl: 'https://pool.alter-media.hr:2020/json/stream/light',
        currentSongDataFunc: banovinaSongDataFunc
    },
    { 
        name: 'Banovina Turbo',
        url: 'https://audio.radio-banovina.hr:7010/stream',
        web: 'https://www.radio-banovina.hr/',
        historyUrl: 'https://www.radio-banovina.hr/turbo/povijest.html',
        currentSongUrl: 'https://pool.alter-media.hr:2020/json/stream/turbo',
        currentSongDataFunc: banovinaSongDataFunc
    },
    { 
        name: 'Đakovo',
        url: 'https://ec2s.crolive.com.hr:8305/stream',
        web: 'https://www.radio-djakovo.hr/',
        frequencies: ['100,2', '89,6'],
    },
    { 
        name: 'Slavonski',
        url: 'https://ec2s.crolive.com.hr:8035/stream',
        web: 'https://www.slavonskiradio.hr/',
        frequencies: ['106,2', '100,6', '91,0', '89,7'],
    }
];

export default streams;
