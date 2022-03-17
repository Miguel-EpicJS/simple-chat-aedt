function login() {

    const username = document.getElementById("login").value;

    localStorage.setItem("username", username);

    window.location.href="index.html";

}