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

const loading = () => {
    loading_div.style.display = 'flex'
    setTimeout(() => {
        loading_div.style.display = 'none'
    }, 1000);
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const loadPage = () => {
    loading()
    chapterNames()
    setInterval(updateTime, 1000);
    today_date()
    daily_verse()
}


const chapterNames = async () => {
    fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-chapter-info.json').
        then(res => res.json()).
        then(data => data.quran.map(chapter => chapters.innerHTML +=
            `<a onclick="navigatePage(this)" data-id=${chapter.chapter}>
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
        )
}


const navigatePage = (btn) => {
    localStorage.setItem('chapter', btn.dataset.id)
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

const today_date = async () => {
    let today = new Date()
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    if (localStorage.getItem('city') == null || localStorage.getItem('country') == null) {
        await current_city()
        prayer_times(localStorage.getItem('city'), localStorage.getItem('country'), year, month, day)
    }
    else {
        prayer_times(localStorage.getItem('city'), localStorage.getItem('country'), year, month, day)
    }
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

const current_city = async () => {
    console.log("called")
    navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=3e490cfc89ac4cce88823ab10ffd4c59`).
            then(res => res.json()).
            then(data => {
                localStorage.setItem('city', data.results[0].components.city)
                localStorage.setItem('country', data.results[0].components.country)
            })
    })
}

const prayer_times = async (city, country, year, month, day) => {
    fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=13`).
        then(res => res.json()).
        then(data => {
            console.log(data.data)

            prayer_date.innerHTML += `
            <ul>
                <li><span>Fəcr</span><span>${data.data[day-1].timings.Fajr.slice(0, 5)}</span></li>
                <li><span>Günəş</span><span>${data.data[day-1].timings.Sunrise.slice(0, 5)}</span></li>
                <li><span>Zöhr</span><span>${data.data[day-1].timings.Dhuhr.slice(0, 5)}</span></li>
                <li><span>Əsr</span><span>${data.data[day-1].timings.Asr.slice(0, 5)}</span></li>
                <li><span>Məğrib</span><span>${data.data[day-1].timings.Maghrib.slice(0, 5)}</span></li>
                <li><span>İşa</span><span>${data.data[day-1].timings.Isha.slice(0, 5)}</span></li>
            <ul>
            `
            gregorian.innerHTML += day + ' ' + month_names[month - 1] + ' ' + year
            hijri.innerHTML += data.data[day-1].date.hijri.day + ' ' + hijri_months[data.data[day-1].date.hijri.month.number - 1] + ' ' + data.data[day-1].date.hijri.year
        })

}




