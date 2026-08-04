(() => {
  const rawHash = window.location.hash || "";
  const separator = rawHash.indexOf("?");
  if (separator < 0) return;

  const route = rawHash.slice(0, separator) || "#/";
  if (!route.startsWith("#/")) return;

  const incoming = new URLSearchParams(rawHash.slice(separator + 1));
  const url = new URL(window.location.href);
  incoming.forEach((value, key) => url.searchParams.set(key, value));
  url.hash = route;
  window.history.replaceState(window.history.state, "", url.href);
})();
