document.addEventListener("DOMContentLoaded", function () {
    const containerConnexion = document.querySelector(".container-connexion");
    const errorMessage = document.querySelector(".error-message");

    containerConnexion.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                window.localStorage.setItem("token", token);

                window.location.href = "index.html";
            } else {
                errorMessage.textContent = "Email ou mot de passe incorrect";
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            errorMessage.textContent = "Une erreur s'est produite lors de la connexion";
        }
    });
});


// http://localhost:5678/api/users/login


// 1. recuperer email et pwd, 
// 2. creer un objet body en json {
//   "email": "sophie.bluel@gmail.com",
//   "password": "1234"
// }
// 3. POST appel API en await + rattacher au body 
// 4. await fetch, response json, dans le result token 
// 5. stocker token dans le local storage et check si token redirect index.html 
// et si pas bon message d'erreur
// 6. fini