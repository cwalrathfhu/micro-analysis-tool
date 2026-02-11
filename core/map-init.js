export const rasterStyle = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
        '© <a href="https://carto.com/attributions">CARTO</a>'
    }
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }]
};

export function initMap({ container = "map", center = [-104.9903, 39.7392], zoom = 10 } = {}) {
  const map = new window.maplibregl.Map({
    container,
    style: rasterStyle,
    center,
    zoom
  });
  map.addControl(new window.maplibregl.NavigationControl(), "top-right");
  return map;
}

export function setStatus(text) {
  document.getElementById("status").textContent = text;
}
