const token = localStorage.getItem("token");
if (token !== null) {
    window.location = "index.html";
}

const registerbtn = document.getElementById("registerForm");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

registerbtn.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userdata = {
        name=name.value,
        email=email.value,
        password=password.value
    }

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userdata)
    })

    const data = await response.json();

    if (response.ok) {
        alert(data.message);
        window.location = "login.html";
    } else {
        alert(data.message);
    }
})