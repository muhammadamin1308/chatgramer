import { socket } from "../../utils/socket";
import { sendMessage } from "../../utils/socket";
const main = document.createElement("main");

export function appHeader() {
    // root element
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");

    // app content
    const header = document.createElement("header");
    header.className = "header";
    header.id = "app-header";
    app.appendChild(header);

    // logo
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


    // user name
    const User = sessionStorage.getItem("user");

    const userName = document.createElement("div") as HTMLDivElement;
    userName.className = "user-name";
    userName.id = "user-name";
    userName.innerText = `Welcome ${User?.slice(1, -1)}` || "Who are you?";
    header.appendChild(userName);


    const rightSideOfNav = document.createElement("div") as HTMLDivElement;
    rightSideOfNav.className = "right-side-nav";
    header.appendChild(rightSideOfNav);

    const about = document.createElement("div") as HTMLDivElement;
    about.className = "about";
    about.id = "about";
    about.innerText = "About";
    rightSideOfNav.appendChild(about);

    const aboutHandle = document.querySelector("#about") as HTMLDivElement;
    aboutHandle.addEventListener("click", () => {
        window.location.hash = "#/about";
    })

    // logout 
    const logOut = document.createElement("button") as HTMLButtonElement;
    logOut.className = "log-out";
    logOut.id = "log-out";
    logOut.innerText = "Log Out";
    rightSideOfNav.appendChild(logOut);

    const logOutHandle = document.querySelector("#log-out") as HTMLButtonElement;
    logOutHandle.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("password");
        socket?.send(JSON.stringify(logoutData));
        window.location.hash = "#/auth";
    })
    const UserPassword = sessionStorage.getItem("password");
    const logoutData = {
        id: null,
        type: 'USER_LOGOUT',
        payload: {
            user: {
                login: User?.slice(1, -1),
                password: UserPassword?.slice(1, -1),
            }
        }
    }
}






export function appBody() {

    // root element
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");

    // app content
    main.innerHTML = "";
    main.id = "app-content";
    app.appendChild(main);

    userSidebar();
    mainChat();
}


function userSidebar() {

    const usersListCont = document.createElement("div") as HTMLDivElement;
    usersListCont.className = "users-list-cont";
    usersListCont.id = "users-list-cont";
    main.appendChild(usersListCont);

    function searchBar() {
        const searchBar = document.createElement("input") as HTMLInputElement;
        searchBar.setAttribute("autocomplete", "off");
        searchBar.className = "search-bar";
        searchBar.id = "search-bar";
        searchBar.type = "text";
        searchBar.placeholder = "Search";
        usersListCont.appendChild(searchBar);
    }

    function usersList(users: { login: string; isLogined: boolean }[]): void {

        let usersList = document.querySelector(".users-list") as HTMLDivElement;
        if (!usersList) {
            usersList = document.createElement("div");
            usersList.className = "users-list";
            const usersListCont = document.querySelector("#users-list-cont") as HTMLDivElement;
            usersListCont.appendChild(usersList);

        }

        usersList.innerHTML = "";

        users.forEach((user) => {

            const userDiv = document.createElement("div");
            userDiv.className = "user";
            usersList.appendChild(userDiv);

            const userImg = document.createElement("div") as HTMLDivElement;
            userImg.className = "user-img";
            userImg.id = user.login;
            userImg.innerText = user.login.slice(0, 2).toUpperCase();
            userDiv.appendChild(userImg);

            const nameDesc = document.createElement("div") as HTMLDivElement;
            userDiv.appendChild(nameDesc);

            const userName = document.createElement("p") as HTMLParagraphElement;
            userName.className = "user-name";
            userName.innerText = user.login;
            nameDesc.appendChild(userName);

            const userStatus = document.createElement("p") as HTMLParagraphElement;
            userStatus.className = "user-status";
            if(user.isLogined){
                userStatus.id = user.login + "-status";
                userStatus.innerText = "Online";
            } else{
                userStatus.id = user.login + "-status";
                userStatus.innerText = "Offline";
            }



            nameDesc.appendChild(userStatus);

            userDiv.addEventListener("click", () => {
                const mainChat = document.querySelector("#main-chat") as HTMLDivElement;
                mainChat.innerHTML = "";

                const userName = user.login;
                const userStatus = document.querySelector("#user-status") as HTMLParagraphElement;
                const chatHeader = document.createElement("div") as HTMLDivElement;
                chatHeader.className = "chat-header";
                chatHeader.id = "chat-header";
                mainChat.appendChild(chatHeader);

                chatHeader.innerHTML = `
                <div class="user" id="user2">
                    <div class="user-img" id="user-img2">${userImg.innerText = user.login.slice(0, 2).toUpperCase()}</div>
                    <div>
                        <p class="user-name">${userName}</p>
                    </div>
                </div>`

                const form = document.createElement('form');
                form.className = 'chat-form';

                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.placeholder = 'Write a message...';
                inputField.className = 'chat-input';
                form.appendChild(inputField);

                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.className = 'chat-submit';
                submitButton.innerText = 'Send';
                form.appendChild(submitButton);

                mainChat.appendChild(form);
            })
        });
    }

    sendMessage({
        id: null,
        type: "USER_ACTIVE",
        payload: null,
    });
    sendMessage({
        id: null,
        type: "USER_INACTIVE",
        payload: null,
    });

    if (socket) {
        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "USER_ACTIVE") {
                const users = data.payload.users;
                usersList(users);
            } else if (data.type === "USER_INACTIVE") {
                const users = data.payload.users;
                usersList(users);

            } else if (data.type === "USER_EXTERNAL_LOGIN") {
                const user = data.payload.user.login;
                console.log("Other user logged in:", user);
            }
        });
    } else {
        console.error("Socket is null. Unable to add event listener.");
    }
    searchBar();
}


function mainChat() {
    const mainChat = document.createElement("div") as HTMLDivElement;
    mainChat.className = "main-chat";
    mainChat.id = "main-chat";
    main.appendChild(mainChat);

    const emptyChat = document.createElement("div") as HTMLDivElement;
    emptyChat.className = "empty-chat";
    emptyChat.innerHTML = `<p>Select a user to start chatting</p>`;
    document.querySelector("#main-chat")?.appendChild(emptyChat);

    const chatSubmit = document.querySelector(".chat-submit") as HTMLButtonElement;
    if (chatSubmit) {
        chatSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            const inputField = document.querySelector(".chat-input") as HTMLInputElement;
            const message = inputField.value;
            const user2 = document.querySelector("#user2")?.id;
            const chatMessage = {
                id: null,
                type: "MSG_SEND",
                payload: {
                  message: {
                    to: user2,
                    text: message,
                  }
                }
              }
            socket?.send(JSON.stringify(chatMessage));
            inputField.value = "";
        })
    }

}





export function appFooter() {
    // root element
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");

    // app content
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.id = "app-footer";
    app.appendChild(footer);

    footer.innerHTML = `
            <a href='https://rs.school/' class="footer-text">RSSchool</a>
            <a href='#' class="footer-text">Chatgrammer &copy; 2025</a>
            <a href="https://github.com/muhammadamin1308" class="footer-text">GitHub</a>
    `;
}