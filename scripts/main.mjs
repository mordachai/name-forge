import { MODULE_ID, SETTING_LAST_SELECTION, SETTING_ONLY_GENERATE_NAMES, SETTING_SHOW_DIRECTORY_BUTTON } from "./constants.mjs";
import { NameGeneratorApp } from "./apps/name-generator-app.mjs";

let appInstance = null;

function openApp() {
  appInstance ??= new NameGeneratorApp();
  appInstance.render(true);
  return appInstance;
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, SETTING_LAST_SELECTION, {
    scope: "client",
    config: false,
    type: Object,
    default: {
      genreId: "fantasy",
      categoryId: "com",
      typeValue: "Human Male",
      count: 20,
      actorType: null
    }
  });

  game.settings.register(MODULE_ID, SETTING_ONLY_GENERATE_NAMES, {
    name: "NF.Settings.OnlyGenerateNames.Name",
    hint: "NF.Settings.OnlyGenerateNames.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => appInstance?.render()
  });

  game.settings.register(MODULE_ID, SETTING_SHOW_DIRECTORY_BUTTON, {
    name: "NF.Settings.ShowDirectoryButton.Name",
    hint: "NF.Settings.ShowDirectoryButton.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => ui.actors?.render()
  });
});

Hooks.once("ready", () => {
  const api = { Open: openApp };
  const mod = game.modules.get(MODULE_ID);
  if (mod) mod.api = api;
  globalThis.nameForge = api;
});

Hooks.on("renderActorDirectory", (_app, html, _data) => {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE_ID, SETTING_SHOW_DIRECTORY_BUTTON)) return;

  const root = html instanceof HTMLElement ? html : html[0];
  if (!root) return;

  const target = root.querySelector(".directory-footer") ?? root.querySelector("footer");
  if (!target || target.querySelector(".nf-open-btn")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("nf-open-btn");
  button.innerHTML = `<i class="fa-solid fa-signature"></i> ${game.i18n.localize("NF.OpenButton")}`;
  button.addEventListener("click", () => openApp());
  target.append(button);
});
