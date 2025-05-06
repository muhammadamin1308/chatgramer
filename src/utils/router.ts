import { renderAppView } from "../views/chat";
import { renderAuthView } from "../views/auth";
import renderAboutPage from "../components/about";

type RouteHandler = (container: HTMLElement) => void;

const routes: Record<string, RouteHandler> = {
  "": renderAppView,
  auth: renderAuthView,
  main: renderAppView,

  about: renderAboutPage,
};

export function initRouter(containerId: string): void {
  function renderRoute(): void {
    const container = document.getElementById(containerId) as HTMLElement;

    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    container.innerHTML = "";

    const route = window.location.hash.slice(2);
    const routeHandler = routes[route] || routes["main"];
    if (routeHandler) {
      routeHandler(container);
    } else {
      container.innerHTML = '<h2>404 Page Not Found</h2>';
    }
  }

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("load", renderRoute);
}
