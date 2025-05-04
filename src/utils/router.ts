import { renderAppView } from "../views/chat";
import { renderAuthView } from "../views/auth";

type RouteHandler = (container: HTMLElement) => void;

const routes: Record<string, RouteHandler> = {
  "/": renderAppView,
  "/auth": renderAuthView,
};

export function initRouter(containerId: string): void {
  function renderRoute(): void {
    const container = document.getElementById(containerId) as HTMLElement;
    const path = window.location.pathname;
    const routeHandler = routes[path];
    if (routeHandler) {
      routeHandler(container);
    } else {
      container.innerHTML = '<h2>404 Page Not Found</h2>';
    }
  }

  window.addEventListener("popstate", renderRoute);
  window.addEventListener("load", renderRoute);
}
