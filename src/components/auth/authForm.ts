import { socket } from "../../utils/socket";
// import { handleMessages } from "../../utils/socket";

export function authForm() {
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");
    app.innerHTML = "";
    const form = document.createElement("form");
    form.className = "auth-form";
    form.innerHTML = `
        <h2>Login</h2>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Login</button>
    `;
    app.appendChild(form);

    const authForm = document.querySelector<HTMLFormElement>(".auth-form");
    if (!authForm) throw new Error("Auth form not found");
    authForm.addEventListener("submit", (e) => {

        e.preventDefault();
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        const loginData = {
            id: null,
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login: username,
                    password: password,
                }
            }
        }

        if (username && password) {
            if (socket) {
                socket.send(JSON.stringify(loginData));
                sessionStorage.setItem("password", JSON.stringify(password), );
            } else {
                console.error("Socket is null. Unable to send login data.");
            }
        }
        const root = document.querySelector<HTMLDivElement>("#app") as HTMLDivElement;
        const handleLoginResponse = (response: any) => {
            if (response.type === "USER_LOGIN" && response.payload?.user?.login) {
                
                const user = response.payload.user.login;
                sessionStorage.setItem("user", JSON.stringify(user), );
                window.location.hash = "#/main";
                root.innerHTML = "";
            } else if (response.type === "ERROR") {
                alert("Login failed. Please check your username and password.");
            }
        } 
        if (socket) {
            socket.addEventListener("message", (event) => {
                const response = JSON.parse(event.data);
                handleLoginResponse(response);
            });
        } else {
            console.error("Socket is null. Unable to add event listener.");
        }

        // handleMessages((message: string) => {
        //     const response = JSON.parse(message);
        //     handleLoginResponse(response);
        // });
 
    });
}




