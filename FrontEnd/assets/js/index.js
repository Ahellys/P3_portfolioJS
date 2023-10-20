// 
const divGallery = document.querySelector(".gallery");
const buttonTous = document.getElementById("buttonTous");
const buttonObjets = document.getElementById("buttonObjets");
const buttonAppartements = document.getElementById("buttonAppartements");
const buttonHotels = document.getElementById("buttonHotels");
let works;
let modal = null;
const form = document.querySelector(".modal_wrapper form");
let token = window.sessionStorage.getItem("token");
let userId = window.sessionStorage.getItem("userId");

const loginFunc = function (e){
    e.preventDefault();
    window.open("login.html", "_self")
}
const logoutFunc = function (e){
    e.preventDefault();
    window.sessionStorage.clear();
    window.location.reload();
}
async function worksGallery(filter){
    works = await fetch("http://localhost:5678/api/works")
    .then((response)=>response.json())
    .then((response)=>works=response)
    .catch();
    
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

// All filters fonctions
buttonTous.addEventListener("click", ()=>{
    worksGallery("Tous");
    buttonTous.classList.toggle("active",true);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",false);
});

buttonObjets.addEventListener("click", ()=>{
    worksGallery("Objets");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",true);
});

buttonAppartements.addEventListener("click", ()=>{
    worksGallery("Appartements");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",true);
    buttonHotels.classList.toggle("active",false);
    buttonObjets.classList.toggle("active",false);
});

buttonHotels.addEventListener("click", ()=>{
    worksGallery("Hotels & restaurants");
    buttonTous.classList.toggle("active",false);
    buttonAppartements.classList.toggle("active",false);
    buttonHotels.classList.toggle("active",true);
    buttonObjets.classList.toggle("active",false);
});



//********* MODAL
async function modalGallery() {
    document.querySelector(".modal_wrapper h3").innerHTML = "Galerie photo";
    form.innerHTML = "";
    form.classList.toggle("inactive",true);
    let addPic = document.querySelector(".modal_wrapper input");
    addPic.value="ajouter une photo";
    addPic.id="addPic";
    addPic.classList.toggle("inactive", false);
    let returnArrow = document.querySelector("#returnArrow");
    returnArrow.classList.toggle("inactive",true);

    let modalGallery = document.querySelector(".modal_gallery");
    modalGallery.innerHTML="";
    for (let work of works){
        let workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        workImage.alt = work.title;
        let deleteBin = document.createElement("span");
        deleteBin.classList.add("material-symbols-outlined");
        deleteBin.innerHTML = "delete";
        deleteBin.id = work.id;
        let figure = document.createElement("figure");
        figure.appendChild(workImage);
        figure.appendChild(deleteBin);
        modalGallery.appendChild(figure);
    }
    document.querySelector("#addPic").addEventListener("click", addFileForm);
    document.getElementById("closeCross").addEventListener("click", closeModal);
    deleteWork();
    
}

const openModal = async function (e){
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    modal = target;
    modalGallery();
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js_modal_stop").addEventListener("click", stopPropagation);
}

const closeModal = async function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none" ;
    modal.removeEventListener("click", closeModal);
    modal.removeEventListener("click", stopPropagation);
    modal = null;
}

//********ADD IMAGE FORM
const postWork = function () {
    let formData = new FormData(form);
    
    fetch("http://localhost:5678/api/works", {
        method : "POST",
        headers :  {
            "Authorization" : `Bearer ${token}`
        },
        body : formData
    })
    .then(response => {
        if (response.status === 201){
            worksGallery();
            alert("Ajout réussi");
        } else if (response.status === 400){
            alert("Le formulaire n'est pas rempli correctement");
        } else if(response.status === 500){
            alert("Une erreur inconnue est survenue. Si le problème persiste, veuillez contacter l'administration du site");
        }
    })
}

const addFileForm = function (){
    document.querySelector(".modal_wrapper h3").innerHTML = "Ajout photo";
    document.querySelector(".modal_wrapper input").classList.add("inactive");
    form.classList.toggle("inactive",false);
    let returnArrow = document.querySelector("#returnArrow");
    returnArrow.classList.toggle("inactive",false);
    let gallery = document.querySelector(".modal_gallery");
    gallery.innerHTML="";
    addFileInput();
    addTitleInput();
    addCategoryInput();
    submitImage();
    
    document.querySelector("#fileInput").addEventListener("change", (e)=>{
        e.preventDefault();
        previewPicture();
    });
    returnArrow.addEventListener("click", modalGallery);
}



const addFileInput = function () {
    
    let addFileLabel = document.createElement("label");
    addFileLabel.id = "addFile";
    addFileLabel.for = "fileInput";
    let label = `
                    <div id="zoneImage">
                        <span id="addPicture" class="material-symbols-outlined">imagesmode</span>
                        <span id="addFileButton">+ Ajouter photo</span>
                        <p>jpg, png : 4mo max</p>
                    </div> `;

    let addFileInput = document.createElement("input");
    addFileInput.id ="fileInput";
    addFileInput.name = "image";
    addFileInput.type = "file";
    addFileInput.accept= ".png, .jpg";

    addFileInput.required = true ;
    addFileLabel.innerHTML=label;
    form.appendChild(addFileLabel);
    form.appendChild(addFileInput);

    return true;
}

const addTitleInput = function (){
    let titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.innerHTML = "Titre";
    titleLabel.setAttribute("class", "formLabel")  ;
    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.id = "title";
    titleInput.required = true;
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    return true;
}

const addCategoryInput = function (){
    let categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for","category");
    categoryLabel.innerHTML = "Catégorie";
    categoryLabel.setAttribute("class","formLabel") ;

    let categorySelect = document.createElement("select");
    categorySelect.name = "category";
    categorySelect.id = "category";
    categorySelect.required = true;

    let selectHTML = `
                    <select>
                        <option value=""></option>
                        <option value="2">Appartements</option>
                        <option value="3">Hôtels & restaurants</option>
                        <option value="1">Objets</option>
                    </select>
                `;
    categorySelect.innerHTML = selectHTML;
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);
    return true;
}

const submitImage = function (){
    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Valider";
    submit.id = "validate"
    form.appendChild(submit);

    submit.addEventListener("click", (e)=>{
        e.preventDefault();
        postWork()});
}



const previewPicture = async function () { 
    let previewArea = document.querySelector("#zoneImage");
    let previewImage = document.createElement("img");
    const fileInput = document.querySelector("#fileInput");
        if (fileInput.files){
            previewImage.file = fileInput.files[0];
            let reader = new FileReader();
            
            reader.readAsDataURL(previewImage.file);
            reader.onload = () => {
                previewImage.src = reader.result;
            }
            previewArea.innerHTML = "";
            previewArea.appendChild(previewImage);
        }
} 


const stopPropagation = function (e){
    e.stopPropagation();
}

//*********  DELETE WORK
const deleteWork = function (){
    const target = document.querySelectorAll(".modal_gallery span")
    for (let span of target){
        span.addEventListener("click",(event)=>{
            for (let i = 0; i < works.length; i++){
                if (works[i].id == event.target.id){
                    deleteFromAPI(works[i].id);
                    works.splice(i,1);
                }
            }
            modalGallery();
            worksGallery();
        })
    }
}

const deleteFromAPI = function (i){
    fetch(`http://localhost:5678/api/works/${i}`, {
        method : "DELETE",
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
}

//********* END MODAL 


//************  
const loggedCheck = function (){
    let login = document.getElementById("login");
    let logout = document.getElementById("logout");
    if (window.sessionStorage.getItem("token") == null){
        logout.setAttribute("class","inactive");
        document.querySelector(".js_modal").classList.add("inactive");
        login.addEventListener("click", loginFunc);
    } else {
        login.setAttribute("class","inactive");
        document.getElementById("filtres").classList.add("inactive");
        document.getElementById("logout").addEventListener("click",logoutFunc);
    };
}

loggedCheck();
worksGallery();

document.querySelector(".js_modal").addEventListener('click', openModal);