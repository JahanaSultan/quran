let chapters = document.querySelector('.chapters');
let daily = document.querySelector('.daily-verse');
let random = Math.floor(Math.random() * 6236);
let hijri = document.querySelector('.hijri');
let gregorian = document.querySelector('.gregorian');
let clock = document.getElementById("clock")
let loading_div = document.querySelector('.loading')
let prayer_date = document.querySelector('.prayer-date')

let days = [
    "Bazar ertəsi",
    "Çərşənbə axşamı",
    "Çərşənbə",
    "Cümə axşamı",
    "Cümə",
    "Şənbə",
    "Bazar"
]
let month_names = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
]
let hijri_months = [
    "Məhərrəm",
    "Səfər",
    "Rəbiüləvvəl",
    "Rəbiüləhir",
    "Cəmadiyələvvəl",
    "Cəmadiyələhir",
    "Rəcəb",
    "Şaban",
    "Ramazan",
    "Şəvval",
    "Zilqədə",
    "Zilhicce"
];


const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const loadPage = () => {
    chapterNames()
    setInterval(updateTime, 1000);
    daily_verse()
    printPhrasesRun()
}


const chapterNames = async () => {
    fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-chapter-info.json').
        then(res => res.json()).
        then(data => {
            if (chapters) {
                data.quran.map(chapter => chapters.innerHTML +=
                    `<a onclick="navigatePage(this)" data-id=${chapter.chapter} data-sajda=${chapter.sajda_verse}>
                <li>
                    <p>
                        <span>${chapter.chapter}</span> ${chapter.name_az}
                    </p> 
                    <p>${chapter.name_ar} 
                        <span>${chapter.verse_count} ayə</span>
                    </p> 
                </li>
            </a>`
                )
            }
            loading_div.style.display = 'none'
        })
}


const navigatePage = (btn) => {
    localStorage.setItem('chapter', btn.dataset.id)
    localStorage.setItem('sajda', btn.dataset.sajda)
    window.location.href = "chapter.html";
};


const updateTime = () => {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var dayOfWeek = currentTime.getDay();
    var dayName = days[dayOfWeek - 1];

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    clock.innerHTML = `<p>${hours}:${minutes}:${seconds}</p><p>${dayName}</p>`;
}


const daily_verse = async () => {
    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/aze-alikhanmusayev.json').
        then(res => res.json()).
        then(data => {
            let verse = data.quran[random]
            daily.innerHTML += `<p>${capitalize(verse.text)} (${verse.verse}:${verse.chapter})</p>`
        }
        )
}


navigator.geolocation.getCurrentPosition(async (position) => {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    currentCity(long, lat)
    getPrayTime(long, lat)
})



const currentCity = async (long, lat) => {
    if (localStorage.getItem('city') && localStorage.getItem('country')) {
        document.getElementById('location').innerHTML = `${localStorage.getItem('city')}, ${localStorage.getItem('country')}`
    }
    else {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=3e490cfc89ac4cce88823ab10ffd4c59`)
            const data = await response.json()
            localStorage.setItem('city', data.results[0].components.city)
            localStorage.setItem('country', data.results[0].components.country)
            document.getElementById('location').innerHTML = `${data.results[0].components.city}, ${data.results[0].components.country}`
        }
        catch (error) {
            console.log(error)
        }
    }
}


const getPrayTime = async (long, lat) => {
    let today = new Date()
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    try {
        console.log(long, lat)
        await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${long}&method=13`).
            then(res => res.json()).
            then(data => {
                prayer_date.innerHTML += `
            <ul>
                <li><span>Fəcr</span><span>${data.data[day - 1].timings.Fajr.slice(0, 5)}</span></li>
                <li><span>Günəş</span><span>${data.data[day - 1].timings.Sunrise.slice(0, 5)}</span></li>
                <li><span>Zöhr</span><span>${data.data[day - 1].timings.Dhuhr.slice(0, 5)}</span></li>
                <li><span>Əsr</span><span>${data.data[day - 1].timings.Asr.slice(0, 5)}</span></li>
                <li><span>Məğrib</span><span>${data.data[day - 1].timings.Maghrib.slice(0, 5)}</span></li>
                <li><span>İşa</span><span>${data.data[day - 1].timings.Isha.slice(0, 5)}</span></li>
            <ul>
            `
                gregorian.innerHTML += day + ' ' + month_names[month - 1] + ' ' + year
                hijri.innerHTML += data.data[day - 1].date.hijri.day + ' ' + hijri_months[data.data[day - 1].date.hijri.month.number - 1] + ' ' + data.data[day - 1].date.hijri.year
            })
    }
    catch (error) {
        console.log(error)
    }
}



// *Placeholder typeeffect animasyasi ucun funksiya

const addToPlaceholder = (toAdd, el) => {
    el.attr('placeholder', el.attr('placeholder') + toAdd);
    return new Promise(resolve => setTimeout(resolve, 100));
}

const clearPlaceholder = (el) => {
    el.attr("placeholder", "");
}

const printPhrase = (phrase, el) => {
    return new Promise(resolve => {
        clearPlaceholder(el);
        let letters = phrase.split('');
        letters.reduce(
            (promise, letter, index) => promise.then(_ => {
                if (index === letters.length - 1) {
                    setTimeout(resolve, 3000);
                }
                return addToPlaceholder(letter, el);
            }),
            Promise.resolve()
        );
    });
}

const printPhrases = (phrases, el) => {
    phrases.reduce(
        (promise, phrase) => promise.then(_ => printPhrase(phrase, el)),
        Promise.resolve()
    );
}

const printPhrasesRun = () => {
    let phrases = [
        "Tövhid",
        "Namaz",
        "Oruc",
        "Zəkat",
        "Həcc",
        "Zikr",
        "Dua",
        "Səcdə",
        "Tağut",
        "Şeytan",
        "İblis",
        "Cəhənnəm",
        "Cənnət",
        "İman",
        "İslam",
        "Müsəlman",
        "Mömin",
        "Müqəddəs",
        "Mələklər",
        "Kitab",
        "Quran",
        "Münafiq",
        "Müşrik",
        "Kafir",
        "Peyğəmbər",
        "Nə axtarırsan?"
    ];

    printPhrases(phrases, $('input[type="search"]'));
}



const searchWord = () => {
    let input = document.querySelector("input[type='search']")
    let word = input.value.trim()
    if (word && word.length >= 3) {
        localStorage.setItem("search", word)
        window.location.href = "search.html";
    }

    return false
}



//BACK TO TOP


let back = document.querySelector(".back-to-top")
window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {

        back.style.transform = "translateX(0)"
    }
    else {
        back.style.transform = "translateX(500%)";
    }
}
)

// BACK TO TOP BUTTON

const backToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}