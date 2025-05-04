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