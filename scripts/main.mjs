import { MODULE_ID, SETTING_LAST_SELECTION } from "./constants.mjs";
import { NameGeneratorApp } from "./apps/name-generator-app.mjs";

let appInstance = null;

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, SETTING_LAST_SELECTION, {
    scope: "client",
    config: false,
    type: Object,
    default: {
      genreId: "fantasy",
      categoryId: "com",
      typeValue: "Human Male",
      count: 10,
      actorType: null
    }
  });
});

Hooks.on("renderActorDirectory", (_app, html, _data) => {
  if (!game.user.isGM) return;

  const root = html instanceof HTMLElement ? html : html[0];
  if (!root) return;

  const target = root.querySelector(".directory-footer") ?? root.querySelector("footer");
  if (!target || target.querySelector(".nf-open-btn")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("nf-open-btn");
  button.innerHTML = `<i class="fa-solid fa-signature"></i> ${game.i18n.localize("NF.OpenButton")}`;
  button.addEventListener("click", () => {
    appInstance ??= new NameGeneratorApp();
    appInstance.render(true);
  });
  target.append(button);
});
