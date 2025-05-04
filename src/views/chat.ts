import { appBody } from "../components/app/body";
import { appFooter } from "../components/app/footer";
import { appHeader } from "../components/app/header";

export function renderAppView() {
    appHeader();
    appBody();
    appFooter();
}
  