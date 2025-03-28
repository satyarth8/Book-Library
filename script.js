async function fetchBookData(pageNo) {
  let page= pageNo 
  const url =`https://api.freeapi.app/api/v1/public/books?page=${page}&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // console.log(data);
    // Create a Map of objects that I require
    const impData = data.data.data.map((item) => ({
      imgUrl: item.volumeInfo.imageLinks.thumbnail,
      name: item.volumeInfo.title || "Name Unknown",
      refLink: item.volumeInfo.infoLink,
      releaseDate: item.volumeInfo.publishedDate || "Release Date Unknown",
      authorName: item.volumeInfo.authors || "Author Name Not Available",
      publisher: item.volumeInfo.publisher || "Publisher Unknown",
    }));

    // console.log(impData);

    return impData
    
  } catch (error) {
    const bookCard = document.getElementById("bookCards");
    bookCard.innerText= "API didn't respond"
    bookCard.style.color ='white'
    console.error(error);
  }
}


function createGridCards(reqData) {
  const bookCard = document.getElementById("bookCards");
  const tempCard = document.createElement("div");
  tempCard.classList.add("card");

  tempCard.innerHTML = `<img src="${reqData.imgUrl}" alt="">
                <div class="cardText">
                    <h3 id="bookName">${reqData.name}</h3>
                    <p id="authorName"><b>Author:</b> ${reqData.authorName}</p>
                    <p id="publisher"><b>Publisher:</b> ${reqData.publisher}</p>
                    <p id="releaseDate"><b>Release Date:</b> ${reqData.releaseDate}</p>
                    <a id="bookLink" href="${reqData.refLink}">Book Link</a>
                </div>`;
  bookCard.appendChild(tempCard);
}

const searchBtn = document.getElementById("searchButton")
const searchInput = document.getElementById("searchInput")
const select = document.getElementById("select")
const prevPageBtn = document.getElementById("prevPage")
const nextPageBtn = document.getElementById("nextPage")
const pageNo = document.getElementById("pageNo")
const toggleListBtn = document.getElementById("toggleButton")
let currentPage=1



toggleListBtn.addEventListener('click' , ()=> {
    let cardDiv = document.getElementsByClassName("card")
    // Convert HTMLCollection to an array and iterate
    Array.from(cardDiv).forEach(card => {
      card.classList.toggle("list");
    });

})


// Check if enter button is pressed to 
searchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault() 
    searchBtn.click() // click on seacrhBtn
  }
})

searchBtn.addEventListener('click', ()=> {
  const searchQuery = searchInput.value.trim()
  if(searchQuery){

    const bookCard = document.getElementById("bookCards"); // Clear the cards so that i can show only mathching one
    bookCard.innerText=''
    console.log("Seached for ",searchQuery);
    
     showCards(fetchData,searchQuery)
    //fucntion call to search
  }
})


select.addEventListener('change' , (e)=> {
  const selectedValue = e.target.value
  console.log(selectedValue);
  const tempFetchData = [...fetchData]
  if(selectedValue=== 'atoz'){
    tempFetchData.sort((a,b) => a.name.localeCompare(b.name))
  }else if(selectedValue === 'ztoa'){
    tempFetchData.sort((a,b) => b.name.localeCompare(a.name)) 
  }else if(selectedValue === 'publishDate'){
    tempFetchData.sort((a,b) => a.releaseDate.localeCompare(b.releaseDate) )
  }
  const bookCard = document.getElementById("bookCards"); // Clear the cards so that i can show only mathching one
  bookCard.innerText=''
  showCards(tempFetchData)
})

prevPageBtn.addEventListener('click',async ()=>{
  if(currentPage > 1){
    //more than 1 that is 2 3 4 etc then decrease it by 1 that is feasible
    currentPage-=1      
  }else{
    currentPage =1
  }
  console.log(currentPage);
  //refresh the list 
  //fetch the date for reduced current page
  const pagefetchData =await fetchBookData(currentPage)
  //clear the current cards
  const bookCard = document.getElementById("bookCards"); // Clear the cards so that i can show only mathching one
    bookCard.innerText=''
  //show cards of the prev page
  showCards(pagefetchData)
  updatePageNo()
})


nextPageBtn.addEventListener('click',async ()=>{
  if(currentPage >= 1){
    currentPage+=1      
  }
  console.log(currentPage);
  
  //refresh the list 
  //fetch the date for increased current page
  const pagefetchData = await fetchBookData(currentPage)
  if(pagefetchData.length===0){
    alert(`You've Reached the Last Page`)
    prevPageBtn.click()
  }
  console.log(pagefetchData);
  
  //clear the current cards
  const bookCard = document.getElementById("bookCards"); // Clear the cards so that i can show only mathching one
    bookCard.innerText=''
  //show cards of the next page
  showCards(pagefetchData)
  updatePageNo()
})


function updatePageNo(){
  pageNo.innerText=`Page Number: ${currentPage}`
}

function showCards(fetchData , searchQuery=''){

  fetchData.forEach((element) => {
    // console.log(element.name," type ",typeof element.name);
    if(element.name.includes(searchQuery) || element.authorName.join(" ").includes(searchQuery))
      createGridCards(element);
  });
}

const fetchData = await fetchBookData(currentPage)
console.log(fetchData);


showCards(fetchData)

