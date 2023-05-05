let id = Number(localStorage.getItem('chapter'))
let sajda = Number(localStorage.getItem('sajda'))
let ul = document.querySelector('ul')
let chapter_name = document.querySelector('.chapter-name')
let chapter_info = document.querySelector('.chapter-info')
let start = document.querySelector('.starting')


const chapterData = async () => {
  fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-chapter-info.json').
    then(res => res.json()).
    then(data => {
      console.log(data)
      let filtered = data.quran.filter(chapter => chapter.chapter == id)
      filtered.map(chapter => {
        chapter.bismillah_pre ? start.innerHTML = chapter.bismillah_pre : start.innerHTML = ``
        chapter_name.innerHTML = `${chapter.name_az} <span>(${chapter.name_ar})</span>`
        chapter_info.innerHTML = `
        <p><span>Ayə sayı:</span> ${chapter.verse_count}</p>
        <p><span>Endirilmə sırası:</span> ${chapter.revelation_order}</p>
        <p><span>Endirilmə yeri:</span> ${chapter.revelation_place == "Mecca" ? "Məkkə" : "Mədinə"}</p>
        <p><span>Yerləşdiyi səhifə:</span> ${chapter.page}</p>
        `
      })
    })
}
chapterData()


const quranArabic = () => {
  fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-ar.json').
    then(res => res.json()).
    then(data => {
      let filtered = data.quran.filter(chapter => chapter.chapter == id)
      filtered.map((chapter, index) => {
        ul.innerHTML += `<li id="verse${chapter.verse}"><span>${chapter.verse}.</span><div  class="chapter-text"><p>${chapter.text}</p><div class="audio"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div></div> </li>`
      })
      quranData()
      audio()
    })
}



const quranData = async () => {
  fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-az.json').
    then(res => res.json()).
    then(data => {
      let verses_place = document.querySelectorAll('li .chapter-text ')
      let verses = data.quran.filter(chapter => chapter.chapter == id)
      verses_place.forEach((verse, index) => {
        if (index + 1 == sajda) {
          verse.innerHTML += `<p>${verses[index].text} (Səcdə Ayəsi)</p>`
        }
        else {
          verse.innerHTML += `<p>${verses[index].text}</p>`
        }
      })
    })
}

quranArabic()


const audio = async () => {
  fetch(`http://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).
    then(res => res.json()).
    then(data => {
      console.log(data)
      let verses_place = document.querySelectorAll('li .audio')
      verses_place.forEach((verse, index) => {
        verse.innerHTML = `
        <audio controls>
                <source src="${data.data.ayahs[index].audio}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
      `
      })
    })
}
