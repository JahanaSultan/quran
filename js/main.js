let chapters = document.querySelector('.chapters');
let daily = document.querySelector('.daily-verse');
let random = Math.floor(Math.random() * 6236);
let hijri = document.querySelector('.hijri');
let gregorian = document.querySelector('.gregorian');
let clock = document.getElementById("clock")
let loading_div = document.querySelector('.loading')

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

const loading=()=>{
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
    fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran/json/quran-chapter-info.json').
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
    gregorian.innerHTML += `<p>${today.getDate()} ${month_names[today.getMonth()]} ${today.getFullYear()}</p>`
    let change_format = today.toLocaleDateString('en-GB').split('/').join('-');
    fetch(`http://api.aladhan.com/v1/gToH/${change_format}`).
        then(res => res.json()).
        then(data => hijri.innerHTML += `<p>${data.data.hijri.day} ${hijri_months[data.data.hijri.month.number - 1]} ${data.data.hijri.year}</p>`)
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

