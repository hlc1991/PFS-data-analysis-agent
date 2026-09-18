const STORAGE_KEY = "pfs_theme";
const BACKGROUND_STORAGE_KEYS = Object.freeze({
  light: "pfs_theme_background_light",
  dark: "pfs_theme_background_dark",
});
const CUSTOM_BACKGROUND_STORAGE_KEYS = Object.freeze({
  light: "pfs_theme_background_light_custom",
  dark: "pfs_theme_background_dark_custom",
});
const BACKGROUND_PALETTES = Object.freeze({
  blue: { preview: "#eaf2fb", light: "#f4f8fd", dark: "#0f1421" },
  violet: { preview: "#e9e2f7", light: "#f7f5fb", dark: "#1d192b" },
  teal: { preview: "#dff3ef", light: "#f1f8f5", dark: "#13231f" },
  green: { preview: "#e5f2e7", light: "#f3f8f2", dark: "#15231b" },
  rose: { preview: "#fae9ed", light: "#fdf5f6", dark: "#281820" },
  orange: { preview: "#f8eddf", light: "#fcf7f0", dark: "#2a2016" },
});
const BACKGROUND_VARIABLES = Object.freeze([
  "--color-bg",
  "--color-surface",
  "--color-surface-1",
  "--color-surface-2",
  "--color-surface-3",
  "--color-border",
  "--color-border-soft",
  "--color-sidebar-bg",
  "--color-sidebar-bg-2",
  "--color-sidebar-divider",
  "--color-sidebar-hover",
  "--pfs-paper-rule",
]);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function normalizeMode(mode) {
  return mode === "dark" ? "dark" : "light";
}

function normalizeBackground(background) {
  return background === "custom" || Object.hasOwn(BACKGROUND_PALETTES, background)
    ? background
    : "blue";
}

function readCustomBackgroundColor(mode) {
  const normalizedMode = normalizeMode(mode);
  const value = localStorage.getItem(CUSTOM_BACKGROUND_STORAGE_KEYS[normalizedMode]);
  if (HEX_COLOR.test(value || "")) return value.toLowerCase();
  return BACKGROUND_PALETTES.blue[normalizedMode];
}

function backgroundVariables(color, mode) {
  const isDark = mode === "dark";
  const surface = isDark
    ? `color-mix(in srgb, ${color} 94%, white)`
    : `color-mix(in srgb, ${color} 12%, white)`;
  const surface2 = isDark
    ? `color-mix(in srgb, ${color} 89%, white)`
    : `color-mix(in srgb, ${color} 96%, black)`;
  const surface3 = isDark
    ? `color-mix(in srgb, ${color} 83%, white)`
    : `color-mix(in srgb, ${color} 90%, black)`;
  const border = isDark
    ? `color-mix(in srgb, ${color} 72%, white)`
    : `color-mix(in srgb, ${color} 76%, #9aa7b8)`;
  const borderSoft = isDark
    ? `color-mix(in srgb, ${color} 82%, white)`
    : `color-mix(in srgb, ${color} 88%, #c5ceda)`;
  const sidebar = isDark
    ? `color-mix(in srgb, ${color} 90%, black)`
    : `color-mix(in srgb, ${color} 54%, white)`;
  const sidebar2 = isDark
    ? `color-mix(in srgb, ${color} 86%, white)`
    : `color-mix(in srgb, ${color} 92%, black)`;
  return {
    "--color-bg": color,
    "--color-surface": surface,
    "--color-surface-1": surface,
    "--color-surface-2": surface2,
    "--color-surface-3": surface3,
    "--color-border": border,
    "--color-border-soft": borderSoft,
    "--color-sidebar-bg": sidebar,
    "--color-sidebar-bg-2": sidebar2,
    "--color-sidebar-divider": border,
    "--color-sidebar-hover": surface3,
    "--pfs-paper-rule": border,
  };
}

function applyThemeBackground(mode) {
  const normalizedMode = normalizeMode(mode);
  const background = getThemeBackground(normalizedMode);
  const html = document.documentElement;
  BACKGROUND_VARIABLES.forEach((name) => html.style.removeProperty(name));
  if (background === "blue") return;

  const color =
    background === "custom"
      ? readCustomBackgroundColor(normalizedMode)
      : BACKGROUND_PALETTES[background][normalizedMode];
  Object.entries(backgroundVariables(color, normalizedMode)).forEach(([name, value]) => {
    html.style.setProperty(name, value);
  });
}

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function getThemeBackground(mode = getTheme()) {
  const normalizedMode = normalizeMode(mode);
  return normalizeBackground(localStorage.getItem(BACKGROUND_STORAGE_KEYS[normalizedMode]));
}

export function getThemeBackgroundCustomColor(mode = getTheme()) {
  return readCustomBackgroundColor(mode);
}

export function getThemeBackgroundOptions() {
  return Object.entries(BACKGROUND_PALETTES).map(([id, background]) => ({
    id,
    preview: background.preview,
  }));
}

export function setThemeBackground(mode, background) {
  const normalizedMode = normalizeMode(mode);
  const normalizedBackground = normalizeBackground(background);
  localStorage.setItem(BACKGROUND_STORAGE_KEYS[normalizedMode], normalizedBackground);
  if (normalizedMode === getTheme()) applyThemeBackground(normalizedMode);
  document.dispatchEvent(
    new CustomEvent("themeBackgroundChange", {
      detail: { mode: normalizedMode, background: normalizedBackground },
    }),
  );
}

export function setThemeBackgroundCustomColor(mode, color) {
  const normalizedMode = normalizeMode(mode);
  if (!HEX_COLOR.test(color || "")) return;
  localStorage.setItem(CUSTOM_BACKGROUND_STORAGE_KEYS[normalizedMode], color.toLowerCase());
  setThemeBackground(normalizedMode, "custom");
}

export function applyTheme(theme) {
  const normalizedTheme = normalizeMode(theme);
  const html = document.documentElement;
  if (normalizedTheme === "dark") html.setAttribute("data-theme", "dark");
  else html.removeAttribute("data-theme");
  applyThemeBackground(normalizedTheme);

  const button = document.getElementById("theme-toggle");
  if (!button) return;

  const label =
    normalizedTheme === "dark"
      ? globalThis.t?.("theme.to_light") || "Light mode"
      : globalThis.t?.("theme.to_dark") || "Dark mode";
  button.dataset.theme = normalizedTheme;
  button.title = label;
  button.setAttribute("aria-label", label);
}

export function setTheme(theme) {
  const normalizedTheme = normalizeMode(theme);
  localStorage.setItem(STORAGE_KEY, normalizedTheme);
  applyTheme(normalizedTheme);
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export const theme = Object.freeze({
  getTheme,
  setTheme,
  toggleTheme,
  applyTheme,
  getThemeBackground,
  getThemeBackgroundCustomColor,
  getThemeBackgroundOptions,
  setThemeBackground,
  setThemeBackgroundCustomColor,
});

applyTheme(getTheme());
document.addEventListener("langchange", () => applyTheme(getTheme()));
