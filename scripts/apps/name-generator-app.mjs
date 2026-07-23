import { MODULE_ID, SETTING_LAST_SELECTION, SETTING_ONLY_GENERATE_NAMES } from "../constants.mjs";
import { GENRES, getGenre, getCategory, flattenOptions } from "../data/generators.mjs";
import { generateNames } from "../services/name-service.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const DEFAULT_SELECTION = {
  genreId: "fantasy",
  categoryId: "com",
  typeValue: "Human Male",
  count: 20,
  actorType: null,
  compound: false
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
    const compound = !!selection.compound;

    return { genreId: genre.id, categoryId: category.id, typeValue, count, actorType, compound };
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
    context.typeLabel = flattenOptions(category).find(o => o.value === this.selection.typeValue)?.label ?? "";
    context.count = this.selection.count;
    context.showCompound = genre.id === "historical";
    context.compound = this.selection.compound;
    context.isGM = game.user.isGM;
    context.onlyGenerateNames = game.settings.get(MODULE_ID, SETTING_ONLY_GENERATE_NAMES);
    context.showActorControls = context.isGM && !context.onlyGenerateNames;
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
      await this.render();
      this._onGenerate();
    });

    root.querySelector("#nf-category")?.addEventListener("change", async ev => {
      this.selection.categoryId = ev.target.value;
      const genre = getGenre(this.selection.genreId);
      const category = getCategory(genre, this.selection.categoryId);
      this.selection.typeValue = flattenOptions(category)[0]?.value;
      await this._saveSelection();
      await this.render();
      this._onGenerate();
    });

    this._setupTypeCombo(root);

    root.querySelector("#nf-compound")?.addEventListener("change", async ev => {
      this.selection.compound = ev.target.checked;
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

  /**
   * The Name Type picker is a custom combobox, not a native <select>: for
   * categories like "World / By Country" the list spans dozens of
   * region-grouped countries, and a native <select>'s popup has no room
   * for a search box - typing only jumps to the next option starting with
   * that letter, which doesn't help when you're hunting by region/culture
   * name. This renders a button that opens a panel with a search input
   * (filtering by substring, collapsing empty region groups) and a
   * click/keyboard-selectable option list.
   */
  _setupTypeCombo(root) {
    const combo = root.querySelector("#nf-type-combo");
    const trigger = root.querySelector("#nf-type-trigger");
    const panel = root.querySelector("#nf-type-panel");
    const search = root.querySelector("#nf-type-search");
    const list = root.querySelector("#nf-type-list");
    if (!combo || !trigger || !panel || !search || !list) return;

    trigger.addEventListener("click", () => {
      if (panel.hidden) this._openTypeCombo(panel, trigger, search, list);
      else this._closeTypeCombo(panel, trigger);
    });

    search.addEventListener("input", () => this._filterTypeOptions(search.value, list));

    search.addEventListener("keydown", ev => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        this._closeTypeCombo(panel, trigger);
        trigger.focus();
      } else if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        this._moveTypeHighlight(list, ev.key === "ArrowDown" ? 1 : -1);
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        const target = list.querySelector(".nf-combo-option.nf-combo-highlight") ?? list.querySelector(".nf-combo-option:not([hidden])");
        if (target) this._selectType(target, panel, trigger);
      }
    });

    // mousedown, not click: the search input's blur (focusout, below) fires
    // between mousedown and click, which closes/hides the panel first and
    // swallows the click before it ever reaches this listener.
    list.addEventListener("mousedown", ev => {
      const option = ev.target.closest(".nf-combo-option");
      if (!option || option.hidden) return;
      ev.preventDefault();
      this._selectType(option, panel, trigger);
    });

    combo.addEventListener("focusout", ev => {
      if (!combo.contains(ev.relatedTarget)) this._closeTypeCombo(panel, trigger);
    });
  }

  _openTypeCombo(panel, trigger, search, list) {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    search.value = "";
    this._filterTypeOptions("", list);
    search.focus();

    const selected = list.querySelector(".nf-combo-option[aria-selected='true']");
    if (selected) {
      selected.classList.add("nf-combo-highlight");
      selected.scrollIntoView({ block: "center" });
    }
  }

  _closeTypeCombo(panel, trigger) {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  async _selectType(option, panel, trigger) {
    this.selection.typeValue = option.dataset.value;
    await this._saveSelection();

    const list = option.closest(".nf-combo-list");
    list?.querySelectorAll(".nf-combo-option[aria-selected]").forEach(o => o.removeAttribute("aria-selected"));
    option.setAttribute("aria-selected", "true");

    const valueEl = trigger.querySelector(".nf-combo-value");
    if (valueEl) valueEl.textContent = option.dataset.label;

    this._closeTypeCombo(panel, trigger);
    this._onGenerate();
  }

  /**
   * Filters the option list by substring match, hiding whole region/culture
   * group headings once none of their options match.
   */
  _filterTypeOptions(query, list) {
    const needle = query.trim().toLowerCase();
    const items = [...list.children];

    for (const li of items) {
      if (li.classList.contains("nf-combo-option")) {
        li.hidden = !(!needle || li.dataset.label.toLowerCase().includes(needle));
        li.classList.remove("nf-combo-highlight");
      }
    }

    let currentGroup = null;
    let groupHasVisible = false;
    for (const li of items) {
      if (li.classList.contains("nf-combo-group")) {
        if (currentGroup) currentGroup.hidden = !groupHasVisible;
        currentGroup = li;
        groupHasVisible = false;
      } else if (!li.hidden) {
        groupHasVisible = true;
      }
    }
    if (currentGroup) currentGroup.hidden = !groupHasVisible;
  }

  _moveTypeHighlight(list, delta) {
    const visible = [...list.querySelectorAll(".nf-combo-option:not([hidden])")];
    if (!visible.length) return;

    const currentIndex = visible.findIndex(o => o.classList.contains("nf-combo-highlight"));
    let nextIndex = currentIndex + delta;
    nextIndex = Math.max(0, Math.min(visible.length - 1, nextIndex));

    visible.forEach(o => o.classList.remove("nf-combo-highlight"));
    visible[nextIndex].classList.add("nf-combo-highlight");
    visible[nextIndex].scrollIntoView({ block: "nearest" });
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
      const names = generateNames(this.selection.typeValue, this.selection.count, { compound: this.selection.compound });
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

    const isGM = game.user.isGM && !game.settings.get(MODULE_ID, SETTING_ONLY_GENERATE_NAMES);
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
