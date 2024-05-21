import { MapContainer, TileLayer } from "react-leaflet"
import "./map.scss"
import "leaflet/dist/leaflet.css"
import Pin from "../pin/Pin"


const Map = ({ items }) => {
  return (
    <MapContainer center={[25.065, 55.171]} zoom={10} scrollWheelZoom={true} className="map">
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((item)=>(
          <Pin item={item} key={item.id} />
        ))}
    </MapContainer>
    // var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}', {
    //   minZoom: 0,
    //   maxZoom: 20,
    //   attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   ext: 'png'
    // });
  )
}

export default Map
