let id = Number(localStorage.getItem('chapter'))
let ul = document.querySelector('ul')
let chapter_name = document.querySelector('.chapter-name')
let chapter_info = document.querySelector('.chapter-info')


const chapterData = async () => {
  fetch('./json/quran-chapter-info.json').
    then(res => res.json()).
    then(data => {
      let filtered = data.quran.filter(chapter => chapter.chapter == id)
      filtered.map(chapter => {
        chapter_name.innerHTML = `<h1>${chapter.name_az} (${chapter.name_ar})</h1>`
        chapter_info.innerHTML=`<p>Ayə sayı: ${chapter.verse_count}</p>`
      })
    })
}
chapterData()



const quranData = async () => {
  fetch('./json/quran-az.json').
    then(res => res.json()).
    then(data => {
      let filtered = data.quran.filter(chapter => chapter.chapter == id)
      filtered.map(chapter => {
        ul.innerHTML += `<li id="verse${chapter.verse}"><span>${chapter.verse}.</span> ${chapter.text}</li>`
      })
      quranArabic()
    })
}
quranData()


const quranArabic = async () => {
  fetch(`http://api.alquran.cloud/v1/surah/${id}`).
    then(res => res.json()).
    then(data => {
      let verses_place = document.querySelectorAll('li')
      let verses = data.data.ayahs
      verses_place.forEach((verse, index) => {
        console.log(index)
        if (index == 0) {
          verse.innerHTML += `<p>${verses[index].text.slice(40)}</p>`
        }
        else {
          verse.innerHTML += `<p>${verses[index].text}</p>`
        }
      })
      audio()
    })
}


const audio = async () => {
  fetch(`http://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).
    then(res => res.json()).
    then(data => {
      console.log(data)
      let verses_place = document.querySelectorAll('li')
      verses_place.forEach((verse, index) => {
        verse.innerHTML += `<audio controls>
                <source src="${data.data.ayahs[index].audio}" type="audio/mpeg">
                Your browser does not support the audio element.
                </audio>`
      })
    })
}
