import React, { useMemo, useEffect, useState } from "react";
import { useMap, Marker } from "@vis.gl/react-google-maps";
import Supercluster, {
  PointFeature,
  ClusterFeature,
  AnyProps,
} from "supercluster";
import GeoJson from "./assets/manly-parking-data_1.json";

interface Properties {
  name: string;
  description: string;
  category: string;
  areaReferenceId: string;
  rawDataPointId: number;
  status: string;
  collectionTime: string;
  collectedBy: number;
  updatedAt: string;
  image: string;
}

interface FeatureCollection {
  type: string;
  features: PointFeature<Properties>[];
}
const GeoJson_data: FeatureCollection = GeoJson as FeatureCollection;

// interface Props {
//   zoom: number;
//   bounds: {
//     east: number;
//     north: number;
//     south: number;
//     west: number;
//   };
// }

const Markers = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState<number>(10);
  const [boundsLevel, setBoundsLevel] = useState<{
    east: number;
    north: number;
    south: number;
    west: number;
  }>({
    east: 151.3705459054741,
    north: -33.6915568168791,
    south: -33.90838151574463,
    west: 151.1281600412163,
  });
  const [points, setPoints] = useState<
    ClusterFeature<AnyProps>[] | PointFeature<AnyProps>[]
  >([]);

  const data = useMemo(() => GeoJson_data.features, []);

  useEffect(() => {
    let listener = null;
    let boundListener = null;
    if (map) {
      listener = map?.addListener("zoom_changed", () => {
        setZoomLevel(map.getZoom() ?? 10);
      });

      boundListener = map.addListener("bounds_changed", () => {
        const bounds = map.getBounds();
        if (!bounds) return;
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setBoundsLevel({
          east: ne.lng(),
          north: ne.lat(),
          south: sw.lat(),
          west: sw.lng(),
        });
      });
    }

    return () => {
      if (map) {
        listener?.remove();
        boundListener?.remove();
      }
    };
  }, [map]);

  useEffect(() => {
    if (map && data) {
      const index = new Supercluster({ radius: 50, maxZoom: 16 });
      index.load(data);

      const clusters = index.getClusters(
        [
          boundsLevel.west,
          boundsLevel.south,
          boundsLevel.east,
          boundsLevel.north,
        ],
        zoomLevel
      );
      console.log({ clusters });
      setPoints(clusters);
    }
  }, [data, map, boundsLevel, zoomLevel]);

  return (
    <>
      {points.map((item) => (
        <Marker
          key={item.properties.cluster_id}
          position={{
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
          }}
        />
      ))}
    </>
  );
};

export default Markers;
