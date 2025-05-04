
export function appHeader() {
    // root element
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");

    // app content
    const header = document.createElement("header");
    header.className = "header";
    header.id = "app-header";
    app.appendChild(header);

    function logo() {
        const logoCont = document.createElement("div") as HTMLDivElement;
        logoCont.className = "logo-cont";
        header.appendChild(logoCont);

        const logo = document.createElement("img") as HTMLImageElement;
        logo.className = "logo";
        logo.id = "logo";
        logo.src = "../assets/logos.png";
        logoCont.appendChild(logo);  

        const logoText = document.createElement("p") as HTMLParagraphElement;
        logoText.className = "logo-text";
        logoText.innerText = "Chatgramer";
        logoCont.appendChild(logoText);

    }

    const User = sessionStorage.getItem("user");

    function userName() {
        const userName = document.createElement("div") as HTMLDivElement;
        userName.className = "user-name";
        userName.id = "user-name";
        userName.innerText = User ? JSON.parse(User).login : "Who are you?";
        header.appendChild(userName);
    }

    logo();
    userName();

    const rightSideOfNav = document.createElement("div") as HTMLDivElement;
    rightSideOfNav.className = "right-side-nav";
    header.appendChild(rightSideOfNav);

    function about() {
        const about = document.createElement("div") as HTMLDivElement;
        about.className = "about";
        about.id = "about";
        about.innerText = "About";
        rightSideOfNav.appendChild(about);
    }

    function LogOut() {
        const logOut = document.createElement("button") as HTMLButtonElement;
        logOut.className = "log-out";
        logOut.id = "log-out";
        logOut.innerText = "Log Out";
        rightSideOfNav.appendChild(logOut);
    }

    about();
    LogOut();
    handleLogout();
    const storedUser = sessionStorage.getItem("user");
    const userNameElement = document.getElementById("user-name") as HTMLDivElement;
}


function handleLogout() {
    const logOutButton = document.getElementById("log-out") as HTMLButtonElement;
    logOutButton.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        window.location.href = "/auth";

    });
}