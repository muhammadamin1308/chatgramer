export default function renderAboutPage(): void {
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!app) throw new Error("App element not found");
    app.innerHTML = `
    <div class="about-page">
      <h1>About Chatgramer</h1>
        <p>Chatgrammer is a simple chat application built with TypeScript.</p>
        <p>It allows users to send and receive messages in real-time.</p>
        <p>Built with love by the Muhammadamin</p>
        <p>For more information, visit my <a href='https://github.com/muhammadamin1308'>GitHub page.</a></p>
        <p>Go back to <a href="#/main">Main Page</a></p>
        <p>Go back to <a href="#/auth">Login Page</a></p>
    </div>
    `;
    const aboutPage = document.querySelector<HTMLDivElement>(".about-page");
    aboutPage?.style.setProperty("text-align", "center");
    aboutPage?.style.setProperty("margin", "0 auto");
    aboutPage?.style.setProperty("padding", "20px");
    aboutPage?.style.setProperty("max-width", "600px");
    aboutPage?.style.setProperty("font-family", "Arial, sans-serif");
    aboutPage?.style.setProperty("font-size", "16px");
    aboutPage?.style.setProperty("line-height", "2");
  
  }