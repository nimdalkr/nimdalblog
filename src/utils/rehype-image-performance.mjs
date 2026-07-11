export function rehypeImagePerformance() {
  return function applyImagePerformance(node) {
    if (node?.type === "element" && node.tagName === "img") {
      node.properties ??= {};
      node.properties.loading ??= "lazy";
      node.properties.decoding ??= "async";
    }

    if (Array.isArray(node?.children)) {
      node.children.forEach(applyImagePerformance);
    }
  };
}
