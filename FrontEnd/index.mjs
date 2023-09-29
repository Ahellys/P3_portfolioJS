//fetch works array from the API
let response= await fetch("http://localhost:5678/api/works");
let works= await response.json();
let divGallery = document.querySelector(".gallery");
console.log(works);
let buttonTous = document.getElementById("buttonTous");
let buttonObjets = document.getElementById("buttonObjets");
let buttonAppartements = document.getElementById("buttonAppartements");
let buttonHotels = document.getElementById("buttonHotels");

// Fonction de base pour afficher tous les travaux
function getWorks(filter){
    divGallery.innerHTML="";
    if (filter == null || filter === "Tous"){
        for (let work of works){
            let workImage = document.createElement("img");
            workImage.src = work.imageUrl;
            workImage.alt = work.title;
            let workTitle = document.createElement("figcaption");
            workTitle.innerText = work.title;
            let figure = document.createElement("figure");
            figure.appendChild(workImage);
            figure.appendChild(workTitle);
            divGallery.appendChild(figure);
        }
    } else {
        for (let work of works){
            if (work.category.name === filter){
                let workImage = document.createElement("img");
                workImage.src = work.imageUrl;
                workImage.alt = work.title;
                let workTitle = document.createElement("figcaption");
                workTitle.innerText = work.title;
                let figure = document.createElement("figure");
                figure.appendChild(workImage);
                figure.appendChild(workTitle);
                divGallery.appendChild(figure);
            }
        }
    }
}
buttonTous.addEventListener("click", ()=>{
    getWorks("Tous");
});

buttonObjets.addEventListener("click", ()=>{
    getWorks("Objets");
});

buttonAppartements.addEventListener("click", ()=>{
    getWorks("Appartements");
});

buttonHotels.addEventListener("click", ()=>{
    getWorks("Hotels & restaurants");
});


getWorks();
