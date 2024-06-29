import Card from "../card/Card"
import { Separator } from "../ui/separator"


const PropertyCard = ( {post} ) => {
  return (
    <div className="rounded-xl hover:bg-slate-100">
        <li className="list-none p-4" key={post.$id}>
            <Card item={post} />
        </li>
        <Separator />
    </div>
  )
}

export default PropertyCard
