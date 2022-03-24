function login() {

    const username = document.getElementById("login").value;

    localStorage.setItem("username", username.replace(/\s+/g, "-"));
    localStorage.setItem("username", username.replace(".", "-"));

    window.location.href="index.html";

}