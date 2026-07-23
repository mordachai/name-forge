import { MODULE_ID, SETTING_LAST_SELECTION } from "../constants.mjs";
import { GENRES, getGenre, getCategory, flattenOptions } from "../data/generators.mjs";
import { generateNames } from "../services/name-service.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const DEFAULT_SELECTION = {
  genreId: "fantasy",
  categoryId: "com",
  typeValue: "Human Male",
  count: 20,
  actorType: null
};

/**
 * The GM-facing name generator window. Selectors mirror donjon.bin.sh's
 * own Genre -> Category -> Name Type layout (the taxonomy this module was
 * originally built against); generation itself is fully self-contained -
 * see scripts/data/profiles.mjs. The last-used selection is remembered
 * per-client so it's preserved between openings.
 *
 * Note: the instance field is named `selection`, not `state` - ApplicationV2
 * already exposes a read-only `state` getter (its render lifecycle state),
 * so assigning `this.state` throws.
 */
export class NameGeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    id: "name-forge-app",
    classes: ["name-forge-app"],
    tag: "div",
    window: {
      title: "NF.Title",
      icon: "fa-solid fa-signature",
      resizable: true
    },
    position: { width: 580, height: "auto" }
  };

  /** @override */
  static PARTS = {
    body: { template: `modules/${MODULE_ID}/templates/name-generator.hbs` }
  };

  constructor(options = {}) {
    super(options);
    this.selection = this._loadSelection();
  }

  /* -------------------------------------------- */
  /* Selection (persisted GM choices)              */
  /* -------------------------------------------- */

  _loadSelection() {
    const stored = game.settings.get(MODULE_ID, SETTING_LAST_SELECTION) ?? {};
    return this._validateSelection({ ...DEFAULT_SELECTION, ...stored });
  }

  _validateSelection(selection) {
    const genre = getGenre(selection.genreId) ?? GENRES[0];
    const category = getCategory(genre, selection.categoryId) ?? genre.categories[0];
    const options = flattenOptions(category);
    const typeValue = options.some(o => o.value === selection.typeValue) ? selection.typeValue : options[0]?.value;

    const actorTypes = getActorTypes();
    const actorType = actorTypes.includes(selection.actorType) ? selection.actorType : actorTypes[0];

    const count = Number.isInteger(selection.count) ? Math.clamp(selection.count, 1, 30) : 10;

    return { genreId: genre.id, categoryId: category.id, typeValue, count, actorType };
  }

  async _saveSelection() {
    this.selection = this._validateSelection(this.selection);
    await game.settings.set(MODULE_ID, SETTING_LAST_SELECTION, this.selection);
  }

  /* -------------------------------------------- */
  /* Rendering                                     */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const genre = getGenre(this.selection.genreId);
    const category = getCategory(genre, this.selection.categoryId);

    context.genres = GENRES.map(g => ({ id: g.id, label: g.label, selected: g.id === genre.id }));
    context.showCategory = genre.categories.length > 1;
    context.categories = genre.categories.map(c => ({ id: c.id, label: c.label, selected: c.id === category.id }));
    context.groups = category.groups.map(g => ({
      label: g.label,
      options: g.options.map(o => ({ ...o, selected: o.value === this.selection.typeValue }))
    }));
    context.count = this.selection.count;
    context.isGM = game.user.isGM;
    context.actorTypes = getActorTypes().map(t => ({
      value: t,
      label: actorTypeLabel(t),
      selected: t === this.selection.actorType
    }));
    return context;
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    const root = this.element;

    root.querySelector("#nf-genre")?.addEventListener("change", async ev => {
      this.selection.genreId = ev.target.value;
      const genre = getGenre(this.selection.genreId);
      this.selection.categoryId = genre.categories[0].id;
      this.selection.typeValue = flattenOptions(genre.categories[0])[0]?.value;
      await this._saveSelection();
      this.render();
    });

    root.querySelector("#nf-category")?.addEventListener("change", async ev => {
      this.selection.categoryId = ev.target.value;
      const genre = getGenre(this.selection.genreId);
      const category = getCategory(genre, this.selection.categoryId);
      this.selection.typeValue = flattenOptions(category)[0]?.value;
      await this._saveSelection();
      this.render();
    });

    root.querySelector("#nf-type")?.addEventListener("change", async ev => {
      this.selection.typeValue = ev.target.value;
      await this._saveSelection();
    });

    root.querySelector("#nf-count")?.addEventListener("change", async ev => {
      this.selection.count = Number(ev.target.value) || 10;
      await this._saveSelection();
      ev.target.value = this.selection.count;
    });

    root.querySelector("#nf-actor-type")?.addEventListener("change", async ev => {
      this.selection.actorType = ev.target.value;
      await this._saveSelection();
    });

    root.querySelector("[data-action='generate']")?.addEventListener("click", () => this._onGenerate());
  }

  /* -------------------------------------------- */
  /* Generation                                    */
  /* -------------------------------------------- */

  async _onGenerate() {
    const button = this.element.querySelector("[data-action='generate']");
    const resultsList = this.element.querySelector(".nf-results");
    if (!resultsList) return;

    button?.classList.add("nf-busy");
    button && (button.disabled = true);
    resultsList.replaceChildren();

    try {
      const names = generateNames(this.selection.typeValue, this.selection.count);
      this._renderResults(names);
      this._clampToViewport();
    } finally {
      button?.classList.remove("nf-busy");
      button && (button.disabled = false);
    }
  }

  _clampToViewport() {
    const el = this.element;
    if (!el) return;
    const margin = 8;
    const rect = el.getBoundingClientRect();
    const maxTop = window.innerHeight - rect.height - margin;
    if (rect.top > maxTop) {
      this.setPosition({ top: Math.max(margin, maxTop) });
    }
  }

  _renderResults(names) {
    const resultsList = this.element.querySelector(".nf-results");
    if (!resultsList) return;

    resultsList.replaceChildren();

    if (!names.length) {
      resultsList.style.gridTemplateColumns = "";
      resultsList.style.gridTemplateRows = "";
      const empty = document.createElement("li");
      empty.className = "nf-empty";
      empty.textContent = game.i18n.localize("NF.NoResults");
      resultsList.append(empty);
      return;
    }

    const columns = Math.min(3, Math.ceil(names.length / 10));
    const rows = Math.ceil(names.length / columns);
    resultsList.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    resultsList.style.gridTemplateRows = `repeat(${rows}, auto)`;

    const isGM = game.user.isGM;
    for (const name of names) {
      const li = document.createElement("li");
      li.className = "nf-result-row";

      const nameSpan = document.createElement("span");
      nameSpan.className = "nf-result-name";
      nameSpan.textContent = name;
      nameSpan.title = game.i18n.localize("NF.CopyHint");
      nameSpan.addEventListener("click", () => this._copyName(nameSpan, name));
      li.append(nameSpan);

      if (isGM) {
        const createBtn = document.createElement("button");
        createBtn.type = "button";
        createBtn.className = "nf-create-btn";
        createBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
        createBtn.title = game.i18n.localize("NF.CreateHint");
        createBtn.addEventListener("click", () => this._createActor(name, createBtn));
        li.append(createBtn);
      }

      resultsList.append(li);
    }
  }

  async _copyName(node, name) {
    if (node.hasAttribute("data-copied")) return;
    try {
      await navigator.clipboard.writeText(name);
    } catch (err) {
      console.warn("Name Forge | Clipboard write failed.", err);
      return;
    }
    node.setAttribute("data-copied", "true");
    const original = node.textContent;
    node.textContent = game.i18n.localize("NF.Copied");
    setTimeout(() => {
      node.textContent = original;
      node.removeAttribute("data-copied");
    }, 900);
  }

  async _createActor(name, button) {
    if (!game.user.isGM) return;
    const type = this.selection.actorType;
    button.disabled = true;
    try {
      const actor = await Actor.implementation.create({ name, type });
      actor?.sheet?.render(true);
    } catch (err) {
      console.error("Name Forge | Failed to create actor.", err);
      ui.notifications.error(game.i18n.localize("NF.ActorCreateFailed"));
    } finally {
      button.disabled = false;
    }
  }
}

function getActorTypes() {
  const types = game.documentTypes?.Actor ?? ["base"];
  const withoutBase = types.filter(t => t !== "base");
  return withoutBase.length ? withoutBase : types;
}

function actorTypeLabel(type) {
  const key = CONFIG.Actor?.typeLabels?.[type];
  if (key) {
    const localized = game.i18n.localize(key);
    if (localized && localized !== key) return localized;
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}
