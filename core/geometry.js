export function createHalfMileBuffer(lon, lat, stationIdx) {
  const pt = window.turf.point([lon, lat]);
  const circle = window.turf.circle(pt, 0.5, { units: "miles", steps: 64 });
  return { ...circle, properties: { stationIdx } };
}

export function unionFeatures(features) {
  if (!features || features.length === 0) return null;
  let unioned = features[0];
  for (let i = 1; i < features.length; i++) {
    unioned = window.turf.union(unioned, features[i]);
  }
  return unioned;
}

export function bboxStringFromFeature(feature) {
  return window.turf.bbox(feature).join(",");
}
