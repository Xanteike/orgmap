const popup = document.getElementById('authPopup');
const openPopupBtn = document.getElementById('openPopup');
const closePopupBtn = document.getElementById('closePopup');

openPopupBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener('click', async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "" || password === "") {
        return; 
    }

    try {
        const hash = await argon2.hash({pass: password, salt: "salttoolong"});
        const hashHexs = hash.hashHex

       const response = await fetch('https://mvp.einsof.tech/auth/login', {
            method: 'POST',
            headers: {
                'username':  username,
                'password': hashHexs
            },
            body: {}
        })
        localStorage.setItem("token", await response.text())

        window.location.href = "/profile.html"
    } catch (err) {
        alert(err)
    }
});
