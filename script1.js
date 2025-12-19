let places = [];
let modalMode = "add"
let editingID = null;
let searchInput = '';
let sortMode = '';

const placesForm = document.getElementById( "placeForm");
const placeName = document.getElementById("name");
const placeLoc = document.getElementById("location");
const placeDesc = document.getElementById("description");
const placePrice = document.getElementById("price");
const placeRate = document.getElementById("rating");
const placeImg = document.getElementById("linkurl");

const placeDet = document.getElementById("placeDetail");
const placeFav = document.getElementById("favoritePlace");

const modalLabel = document.getElementById("staticBackdropLabel");

const addbutton = document.getElementById("addModal");
const sortingButton = document.getElementById("sorting")
const search = document.getElementById('search');
const placeModalElement = document.getElementById("staticBackdrop");
const placeModal = new bootstrap.Modal(placeModalElement);
const detailModalElement = document.getElementById("detailModal")
const detailModal = new bootstrap.Modal(detailModalElement)

const detailLabel = document.getElementById("detailPlaceLabel");
const detailImg = document.getElementById('detailImage');
const detailLocation = document.getElementById('detailLocation');
const detailPrice = document.getElementById('detailPrice');
const detailDesc = document.getElementById('detailDesc');
const detailRate = document.getElementById('detailRate');

function addPlaceElement(placeObj, container){
    const placeElement = document.createElement("div");
    placeElement.classList.add("placeList", "col-md-4");

    const placeCard = document.createElement("div");
    placeCard.className = "card"
    placeCard.style.cssText = "width: 15rem";

    placeCard.innerHTML = `<img src="${placeObj.imageUrl}" alt="${placeObj.name}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${placeObj.name}</h5>
                                    <h6>${placeObj.location}</h6>
                                    <h6>${formatCurrency(placeObj.price)}</h6>
                                    <p class="card-text">${renderStars(placeObj.rating)}</p>
                                </div>`     
    
    const cardBtn = document.createElement("div");
    cardBtn.className = "card-button"                            
    
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary btn-sm btn-light btn-custom"
    editBtn.innerHTML = "<i class='fa-solid fa-pen'></i>"

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-primary btn-sm btn-light btn-custom"
    deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>"

    const favBtn = document.createElement("button");
    favBtn.className = "btn btn-primary btn-sm btn-light btn-custom"
    favBtn.innerHTML = "<i class='fa-regular fa-star'></i>"

    editBtn.addEventListener("click", function(){
        openEditModal(placeObj.id)
    })

    deleteBtn.addEventListener("click", function(){
        deletePlace(placeObj.id)
    })

    favBtn.addEventListener("click", function(){
        addFavorites(placeObj.id)
    })

    cardBtn.appendChild(editBtn)
    cardBtn.appendChild(deleteBtn)
    cardBtn.appendChild(favBtn)

    placeCard.querySelector(".card-body").appendChild(cardBtn)

    placeCard.addEventListener('click', function(event){
        if(event.target.closest('.card-button')){
            return
        }

        openDetailModal(placeObj.id)

    })

    placeElement.appendChild(placeCard)
    
    container.appendChild(placeElement);
}

function formatCurrency(value, locale = "id-ID", currency = "IDR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0
  }).format(value);
}

function renderStars(rating){
    if(rating === 0){
        return 'No Rating'
    }
    let stars = '';
    for(let i = 0; i<rating; i++){
        stars += '⭐'
    }

    return stars
}

function openEditModal(placeID){
    modalMode = "edit";
    editingID = placeID;

    const placeData = places.find((place) => place.id === editingID);

    placeName.value = placeData.name;
    placeLoc.value = placeData.location;
    placeDesc.value = placeData.description;
    placeImg.value = placeData.imageUrl;
    placePrice.value = placeData.price;
    placeRate.value = placeData.rating;

    modalLabel.innerText = "Edit Destination"

    placeModal.show();
}

function openDetailModal(placeID){

    const placeData = places.find((place) => place.id === placeID);

    detailLabel.textContent = placeData.name;
    detailImg.src = placeData.imageUrl;
    detailLocation.textContent = placeData.location;
    detailPrice.innerHTML = formatCurrency(placeData.price);
    detailDesc.textContent = placeData.description
    detailRate.innerHTML = renderStars(placeData.rating)


    detailModal.show();
}

function deletePlace(placeID){
    places = places.filter((place) => place.id !== placeID);
    saveLocalStorage();
    renderAll()
}

function addFavorites(placeID){
    const favorite = places.find((place) => place.id === placeID)
    favorite.isFavorites = !favorite.isFavorites

    saveLocalStorage()
    renderAll()
}

function saveLocalStorage(){
    localStorage.setItem("places", JSON.stringify(places))
}

function loadLocalStorage(){
    const saveData = localStorage.getItem("places");

    if (saveData === null) {
        return [];
    }

    return JSON.parse(saveData)
}

function render(list, container) {
    container.innerHTML = ''

    for (let place of list){
        addPlaceElement(place, container)
    }
}

function renderAll(){

    let filteredplace = places

    if(searchInput){
        filteredplace = filteredplace.filter((place) => place.name.toLowerCase().includes(searchInput.toLowerCase()))
    }

    if(sortMode === 'price-asc'){
        filteredplace =[...filteredplace].sort((a,b) => a.price - b.price)
    }
    if(sortMode === 'price-des') {
        filteredplace =[...filteredplace].sort((a,b) => b.price - a.price)
    }
    if(sortMode === 'rating-asc'){
        filteredplace =[...filteredplace].sort((a,b) => a.rating - b.rating)
    }
    if(sortMode === 'rating-des'){
        filteredplace =[...filteredplace].sort((a,b) => b.rating - a.rating)
    }

    render(filteredplace, placeDet);

    const favorite = places.filter((place) => place.isFavorites)
    render(favorite, placeFav);
}



document.addEventListener("DOMContentLoaded", function (){
    let userInput = "";

    while (userInput === "" || userInput === null) {
        userInput = prompt("Please Put Your Name Here:");
    }

    document.getElementById('welcome').innerHTML = `Halo <b>${userInput}</b>, Selamat dtg di dunia pixelart yang penuh nostalgia! Di sini, Anda akan menemukan rekomendasi tempat-tempat unik dengan gaya retro. Jelajahi dunia 8-bit yang tak terlupakan.`

    places = loadLocalStorage();
    renderAll();
})

addbutton.addEventListener("click", function(){
    modalMode = "add";
    editingID = null;

    placesForm.reset();

    modalLabel.innerText = "New Destination"

    placeModal.show();
    
})

search.addEventListener('input', function(){
    searchInput = this.value;
    renderAll()
})

sortingButton.addEventListener('change', function(){
    sortMode = this.value;
    renderAll()
})

placesForm.addEventListener("submit", function(event) {
    event.preventDefault()

    if(modalMode === "add"){
        const nama = placeName.value;
        const loc = placeLoc.value;
        const desc = placeDesc.value;
        const imgUrl = placeImg.value;
        const price = placePrice.value;
        const rate = placeRate.value;

        const newPlace = {
            id: Date.now(),
            name: nama,
            location: loc,
            description: desc,
            price: price,
            rating: rate,
            imageUrl: imgUrl,
            isFavorites: false
        };

        places.push(newPlace);
        search.value = '';
        filterPlace = null;
    }

    if(modalMode === "edit"){
        for(let place of places){
            if (place.id === editingID){
                place.name = placeName.value;
                place.location = placeLoc.value;
                place.description = placeDesc.value;
                place.price = placePrice.value;
                place.rating = placeRate.value;
                place.imageUrl = placeImg.value;
                break
            }
        }
    }
    

    saveLocalStorage();

    renderAll();

    placesForm.reset();
    placeModal.hide();
})
