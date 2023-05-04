let chapters = document.querySelector('.chapters');
let daily = document.querySelector('.daily-verse');
let random = Math.floor(Math.random() * 6236);
let hijri = document.querySelector('.hijri');
let gregorian = document.querySelector('.gregorian');

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

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const func = async () => {
    fetch('../../../json/quran-chapter-info.json').
        then(res => res.json()).
        then(data => {
            data.quran.map(chapter => chapters.innerHTML += `<a onclick="navigatePage(this)" data-id=${chapter.chapter}>
        <li><p><span>${chapter.chapter}</span> ${chapter.name_az}</p> <p>${chapter.name_ar} <span>${chapter.verse_count} ayə</span></p> </li>
        </a>`)
        })
}


func()


const func2 = async () => {
    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/aze-alikhanmusayev.json').
        then(res => res.json()).
        then(data => {
            let verse = data.quran[random]
            daily.innerHTML += `<p>${capitalize(verse.text)} (${verse.verse}:${verse.chapter})</p>`
        }
        )
}

func2()


// get islamic date from api

const func3 = async () => {
    let today = new Date().toLocaleDateString('en-GB').split('/').join('-');
    fetch(`http://api.aladhan.com/v1/gToH/${today}`).
        then(res => res.json()).
        then(data => hijri.innerHTML += `<p>${data.data.hijri.day} ${hijri_months[data.data.hijri.month.number - 1]} ${data.data.hijri.year}</p>`
        )
}
func3()




function updateTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var dayOfWeek = currentTime.getDay();
    var dayName = days[dayOfWeek - 1];

    // Saat, dakika ve saniyeyi iki basamaklı hale getirme
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    // Zamanı ekranda gösterme
    document.getElementById("clock").innerHTML = `<p>${hours}:${minutes}:${seconds}</p><p>${dayName}</p>`;
}

setInterval(updateTime, 1000);

const func4 = () => {
    var tarih = new Date();
    var gun = tarih.getDate();
    var ay = tarih.getMonth() + 1;
    var yil = tarih.getFullYear();

    var tarihMetni = gun + " " + month_names[ay - 1] + " " + yil;
    gregorian.innerHTML += `<p>${tarihMetni}</p>`
}

func4()



const navigatePage = (btn) => {
    localStorage.setItem('chapter', btn.dataset.id)
    window.location.href = "chapter.html";
};
