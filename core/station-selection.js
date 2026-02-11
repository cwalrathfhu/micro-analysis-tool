import { createHalfMileBuffer, unionFeatures, bboxStringFromFeature as bboxFromFeature } from "./geometry.js";

export function createStationSelection(map) {
  let points = [];
  let buffers = [];

  function pointsGeoJSON() {
    return { type: "FeatureCollection", features: points };
  }

  function buffersGeoJSON() {
    return { type: "FeatureCollection", features: buffers };
  }

  function updateCoordsPanel() {
    document.getElementById("nStations").textContent = String(points.length);
    const lines = points.map((f, i) => {
      const [lon, lat] = f.geometry.coordinates;
      return `${i + 1}\t${lat.toFixed(6)}\t${lon.toFixed(6)}`;
    });
    document.getElementById("coords").textContent = "idx\tlat\tlon\n" + lines.join("\n");
  }

  function renderStationLayers() {
    const ptsSrc = "stations";
    const ptsLayer = "stations-layer";
    const bufSrc = "buffers";
    const bufFillLayer = "buffers-fill";
    const bufLineLayer = "buffers-line";

    if (!map.getSource(bufSrc)) {
      map.addSource(bufSrc, { type: "geojson", data: buffersGeoJSON() });
      map.addLayer({
        id: bufFillLayer,
        type: "fill",
        source: bufSrc,
        paint: { "fill-color": "#2b6cb0", "fill-opacity": 0.2 }
      });
      map.addLayer({
        id: bufLineLayer,
        type: "line",
        source: bufSrc,
        paint: { "line-color": "#2b6cb0", "line-width": 2, "line-opacity": 0.6 }
      });
    } else {
      map.getSource(bufSrc).setData(buffersGeoJSON());
    }

    if (!map.getSource(ptsSrc)) {
      map.addSource(ptsSrc, { type: "geojson", data: pointsGeoJSON() });
      map.addLayer({
        id: ptsLayer,
        type: "circle",
        source: ptsSrc,
        paint: {
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-color": "#2b6cb0",
          "circle-stroke-color": "#ffffff"
        }
      });
    } else {
      map.getSource(ptsSrc).setData(pointsGeoJSON());
    }

    updateCoordsPanel();
  }

  function addStationPoint(lon, lat) {
    const idx = points.length + 1;
    points.push({
      type: "Feature",
      properties: { name: `Station ${idx}`, stationIdx: idx },
      geometry: { type: "Point", coordinates: [lon, lat] }
    });

    buffers.push(createHalfMileBuffer(lon, lat, idx));
    renderStationLayers();
  }

  function clearStations() {
    points = [];
    buffers = [];
    renderStationLayers();
  }

  function undoLastStation() {
    if (points.length === 0) return false;
    points.pop();
    buffers.pop();
    renderStationLayers();
    return true;
  }

  return {
    renderStationLayers,
    addStationPoint,
    clearStations,
    undoLastStation,
    getPoints: () => points,
    getBuffers: () => buffers,
    bufferUnionPolygon: () => unionFeatures(buffers),
    bboxStringFromFeature: bboxFromFeature
  };
}

