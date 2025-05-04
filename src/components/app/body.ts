// import { sendMessage } from "../../utils/socket";
import socket from "../../utils/socket";
import { MessageEvent } from "../../interface/interfaces";
import { getAllUsers } from "../../utils/socket";

const main = document.createElement("main");

export function appBody() {

    // root element
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");

    // app content
    main.className = "";
    main.id = "app-content";
    app.appendChild(main);

    userSidebar();
    mainChat();
}


function userSidebar() {
    getAllUsers()
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

    function usersList(users: { login: string }[]): void {

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
            userStatus.id = user.login + "-status";
            userStatus.innerText = "Online";
            nameDesc.appendChild(userStatus);
        });
    }

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "USER_ACTIVE") {
            const users = data.payload.users;
            console.log(data)
            console.log("Active users:", users);
            usersList(users);
        } else if (data.type === "USER_EXTERNAL_LOGIN") {
            const user = data.payload.user.login;
            console.log("Other user logged in:", user);
        }
    });

    searchBar();    
}


function mainChat() {
    const mainChat = document.createElement("div") as HTMLDivElement;
    mainChat.className = "main-chat";
    mainChat.id = "main-chat";
    main.appendChild(mainChat);

    function chatHeader() {
        const chatHeader = document.createElement("div") as HTMLDivElement;
        chatHeader.className = "chat-header";
        chatHeader.id = "chat-header";
        mainChat.appendChild(chatHeader);

        chatHeader.innerHTML = `
        <div class="user" id="user2">
            <div class="user-img" id="user-img2"></div>
            <div>
                <p class="user-name">User 2</p>
                <p class="user-status">Online</p>
            </div>
        </div>`
    }

    chatHeader();

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


    async function sendMessage(event: MessageEvent): Promise<void> {
        event.preventDefault();
        const input = document.querySelector(".chat-input") as HTMLInputElement
        if (input.value) {
            socket.send(input.value)
            input.value = ""
        }
        input.focus()
    }





    const messages = document.getElementById('main-chat') as HTMLElement;


    socket.onmessage = (event) => {
        const message = document.createElement('div');
        message.textContent = event.data;
        messages.appendChild(message);
    };



    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = inputField.value;
        if (message) {
            await sendMessage(event);
            console.log('Message sent:', message);
        }
    });

    mainChat.appendChild(form);
}