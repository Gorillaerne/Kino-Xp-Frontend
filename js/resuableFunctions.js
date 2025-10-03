
export function loadStylesheet(href) {
    // Remove existing page-specific stylesheet if any
    const oldLink = document.getElementById("page-specific-style");
    if (oldLink) oldLink.remove();

    // Create new link element
    const link = document.createElement("link");
    link.id = "page-specific-style";
    link.rel = "stylesheet";
    link.href = href;

    document.head.appendChild(link);
}