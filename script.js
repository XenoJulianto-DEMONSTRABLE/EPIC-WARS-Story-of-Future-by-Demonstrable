window.addEventListener("load", function () {

    // 🔥 LOADING SCREEN
    let loader = document.getElementById("loader");

    if (loader) {
        setTimeout(function () {
            loader.style.display = "none";
        }, 2000);
    }


    // 🔥 ACCOUNT SYSTEM
    let user = localStorage.getItem("user");
    let area = document.getElementById("account-area");
    let avatar = localStorage.getItem("avatar") || "https://i.imgur.com/4Z7b7E9.png";

    if (user && area) {

        area.innerHTML = `
<div class="account">
    <div class="avatar-wrapper">
        <img src="${avatar}" class="avatar">
        <span class="online"></span>
    </div>
    <div class="dropdown">
        <p>${user}</p>
        <button onclick="logout()">Logout</button>
        <button onclick="switchAccount()">Ganti Akun</button>
    </div>
</div>
`;

    }

});

//////////////////////////////////////

function login() {

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    // VALIDASI
    if (pass.length < 15 || !/\d/.test(pass)) {
        alert("Password minimal 15 karakter + angka!");
        return;
    }

    localStorage.setItem("user", user);

    window.location.href = "index.html";

}

//////////////////////////////////////

function socialLogin(platform) {

    let avatar = "";

    if (platform === "Google") {
        avatar = "https://cdn-icons-png.flaticon.com/512/281/281764.png";
    } else if (platform === "Facebook") {
        avatar = "https://cdn-icons-png.flaticon.com/512/124/124010.png";
    } else if (platform === "Microsoft") {
        avatar = "https://cdn-icons-png.flaticon.com/512/732/732221.png";
    }

    localStorage.setItem("user", platform + " User");
    localStorage.setItem("avatar", avatar);

    window.location.href = "index.html";

}

//////////////////////////////////////
function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function switchAccount() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

//////////////////////////////////////