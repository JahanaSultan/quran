let word = localStorage.getItem("search")
let result_box = document.querySelector(".chapter")



const highlightWord = (sentence) => {
    const highlighted = sentence.replace(new RegExp(word, "gi"), '<mark>$&</mark>');
    return highlighted;
}


const search = async () => {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-az.json');
        const data = await response.json();
        const searchWord = word;
        let filtered = data.quran.filter(chapter => chapter.text.includes(searchWord));
        let chapterNumbers = filtered.map(chapter => chapter.chapter);
        if (filtered.length) {
            filtered.forEach(chapter => {
                result_box.innerHTML += `<li><span>${chapter.verse}.</span><div  class="chapter-text"><p class="name"></p><p>${highlightWord(chapter.text, searchWord)}</p></li>`;
            });
        } else {
            result_box.innerHTML = `<div class="not-found"><h1><span>"${searchWord}"</span> sözünə uyğun</h1><h1> nəticə tapılmadı!</h1></div>`;
        }
        await loadChapterName(chapterNumbers);
    } catch (error) {
        console.error(error);
    }
}

const loadChapterName = async(chapterNumbers)=> {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/JahanaSultan/quran@latest/json/quran-chapter-info.json');
        const data = await response.json();
        const name = document.querySelectorAll(".name");
        chapterNumbers.forEach((chapterNumber, index) => {
            const filteredChapter = data.quran.find(chapter => chapter.chapter === chapterNumber);
            name[index].innerHTML = `<a data-id="${filteredChapter.chapter}" data-sajda="${filteredChapter.sajda_verse}" onclick="navigatePage(this)">${filteredChapter.name_az} surəsi  <i class="ri-arrow-right-double-line"></i></a>`;
        });
    } catch (error) {
        console.error(error);
    }
}

search();





