// ============================================
// CONFIGURATION (SUDAH LENGKAP)
// ============================================
const IMGBB_API_KEY = "c30ecdbbfbeb7855dd7edb64d276e2b8";
const EMAILJS_SERVICE = "service_a8iwzll";
const EMAILJS_TEMPLATE = "template_o7auf65";

// ============================================
// ACCOUNT SYSTEM
// ============================================
window.addEventListener("load", function () {

    let loader = document.getElementById("loader");
    if (loader) {
        setTimeout(function () {
            loader.style.display = "none";
        }, 2000);
    }

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
        </div>`;
    }

});

function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    if (pass.length < 15 || !/\d/.test(pass)) {
        alert("Password minimal 15 karakter + angka!");
        return;
    }
    localStorage.setItem("user", user);
    window.location.href = "index.html";
}

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

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function switchAccount() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ============================================
// SUBMIT TO DEVELOPER (imgbb + EmailJS)
// ============================================
function submitToDeveloper(source) {
    var user = localStorage.getItem("user");

    if (!user) {
        alert("Please login first to submit your character!");
        window.location.href = "login.html";
        return;
    }

    var imageData = "";

    if (source === "upload") {
        var preview = document.getElementById("uploadPreview");
        var wrapper = document.getElementById("previewWrapper");
        if (!preview.src || wrapper.style.display === "none") {
            alert("Please upload an image first!");
            return;
        }
        imageData = preview.src;
    } else {
        imageData = canvas.toDataURL("image/png");
    }

    var allBtns = document.querySelectorAll(".submit-btn");
    allBtns.forEach(function (btn) {
        btn.classList.add("loading");
        btn.innerHTML = "⏳ UPLOADING & SENDING...";
    });

    uploadToImgbb(imageData)
        .then(function (imageUrl) {
            return sendEmail(user, imageUrl);
        })
        .then(function () {
            alert("Thank you " + user + "! Your character has been submitted to the developer!");
        })
        .catch(function (error) {
            console.error("Error:", error);
            alert("Failed to submit character. Please try again.\n\nError: " + error);
        })
        .finally(function () {
            allBtns.forEach(function (btn) {
                btn.classList.remove("loading");
                btn.innerHTML = "📨 SUBMIT TO DEVELOPER";
            });
        });
}

// ============================================
// UPLOAD GAMBAR KE IMGBB
// ============================================
function uploadToImgbb(base64String) {
    return new Promise(function (resolve, reject) {
        var base64Data = base64String.split(",")[1];

        var formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", base64Data);

        fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.success) {
                    resolve(result.data.url);
                } else {
                    reject("Upload failed: " + result.error.message);
                }
            })
            .catch(function (error) {
                reject("Cannot connect to imgbb: " + error);
            });
    });
}

// ============================================
// KIRIM EMAIL VIA EMAILJS
// ============================================
function sendEmail(userName, imageUrl) {
    return new Promise(function (resolve, reject) {
        var templateParams = {
            from_name: userName,
            character_image: imageUrl
        };

        emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
            .then(function (response) {
                if (response.status === 200) {
                    resolve();
                } else {
                    reject("EmailJS status: " + response.status);
                }
            })
            .catch(function (error) {
                reject("EmailJS error: " + (error.text || error));
            });
    });
}
