import { loginUser } from "../../utils/socket";
import socket from "../../utils/socket";
import { waitForWebSocketReady } from "../../utils/socket";

export function authForm() {
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");
    app.innerHTML = "";
    const form = document.createElement("form");
    form.className = "login-form";
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
        <button id='submit' type="submit">Login</button>
    `;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        // const storedUser = sessionStorage.getItem("user");
        // const userId = storedUser ? JSON.parse(storedUser).id : generateID();

        if (username && password) {
            waitForWebSocketReady(socket).then(() => {
            loginUser(username, password);
            })
        } else {
            alert("Please fill in both username and password");
        }
    });
    app.appendChild(form);
}