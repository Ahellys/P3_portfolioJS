const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const login = {
        email : document.getElementById("email").value,
        password : document.getElementById("password").value
    }
    const loginBody = JSON.stringify(login);
    try{
        fetch("http://localhost:5678/api/users/login",{
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : loginBody
        })
        .then((response) => response.json())
        .then((response) => window.sessionStorage.setItem("token", response.token))
        .then(()=> window.open("index.html"));
    } catch (error){
        console.log("ça ne marche pas :" + error)
        document.getElementById("email").classList.toggle("wrong", true);
        document.getElementById("password").classList.toggle("wrong", true);
        window.alert("Identifiants incorrects");
    };

});
