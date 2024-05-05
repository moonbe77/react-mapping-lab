import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Markers from "./Markers";

const API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
const HOME = { lat: -33.7927817, lng: 151.2837509 };
// const BOUND = {
//   east: 151.3705459054741,
//   north: -33.6915568168791,
//   south: -33.90838151574463,
//   west: 151.1281600412163,
// };

const App = () => {
  console.log("RENDERING APP COMPONENT");
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={HOME}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        // onZoomChanged={(data) => {
        //   setZoom(data.detail.zoom);
        // }}
        // onBoundsChanged={(data) => {
        //   setBounds(data.detail.bounds);
        // }}
      >
        <Markers />
        <div style={{ position: "absolute", top: 0, left: 0, padding: 10 }}>
          <button
            onClick={() => {
              console.log("clicked");
            }}
          >
            Click me
          </button>
        </div>
      </Map>
    </APIProvider>
  );
};

export default App;
