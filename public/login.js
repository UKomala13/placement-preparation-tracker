const token = localStorage.getItem("token");
if (token !== null) {
    window.location = "index.html"
}

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();
    const userdata = {
        email: email.value.trim(),
        password: password.value
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in....";

   
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userdata)
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            window.location = "index.html"
        }
        else {
            const data = await response.json();
            alert(data.message);
        }
    }
    catch (error) {

        alert(error.message);
    }

    finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }
});