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
  )
}

export default Map
