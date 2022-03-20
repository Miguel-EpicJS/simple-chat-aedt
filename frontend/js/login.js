function login() {

    const username = document.getElementById("login").value;

    localStorage.setItem("username", username.replace(/\s+/g, "."));

    window.location.href="index.html";

}