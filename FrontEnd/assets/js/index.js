const divGallery = document.querySelector(".gallery");
const buttonTous = document.getElementById("buttonTous");
const buttonObjets = document.getElementById("buttonObjets");
const buttonAppartements = document.getElementById("buttonAppartements");
const buttonHotels = document.getElementById("buttonHotels");
console.log(window.sessionStorage);
if (window.sessionStorage.getItem("token") == "undefined"){
    document.getElementById("logged").classList.add("inactive");
} else {
    document.getElementById("anon").classList.add("inactive");
};
let works;

fetch("http://localhost:5678/api/works")
.then((response)=>response.json())
.then((response)=>works=response)
.then(()=>getWorks())
.catch();

// Fonction pour afficher tous les travaux. Filtre passé par les EventListener
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
    buttonTous.classList.toggle("active",true);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",false);
});

buttonObjets.addEventListener("click", ()=>{
    getWorks("Objets");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",true);
});

buttonAppartements.addEventListener("click", ()=>{
    getWorks("Appartements");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",true);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",false);
});

buttonHotels.addEventListener("click", ()=>{
    getWorks("Hotels & restaurants");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",true);
    buttonObjets.classList.toggle("active",false);
});