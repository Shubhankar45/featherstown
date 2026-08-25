import { Link } from "react-router-dom";

export default function BreedCard({ parrot }) {
  const whatsappLink = `https://wa.me/919876543210?text=Hi, I'm interested in ${parrot.name}`;

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden group">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={parrot.image}
          className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
        />

        {/* STATUS */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold
          ${parrot.status === "available"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"}
        `}>
          {parrot.status === "available" ? "Available" : "Out of Stock"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-lg">{parrot.name}</h3>

        {/* PRICE */}
        <p className="text-emerald-600 font-semibold mt-1">
          {parrot.price}
        </p>

        {/* NEW LINE ADDED */}
        <p className="text-xs text-gray-500 italic">
          *Price varies based on quality & training
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {parrot.description}
        </p>

        {parrot.status === "available" && (
          <p className="text-xs text-orange-500 mt-2">
            🔥 Limited stock available
          </p>
        )}

        <div className="flex justify-between items-center mt-4">

          <Link to={`/breed/${parrot.id}`}>
            <button className="text-emerald-600 font-semibold">
              Details →
            </button>
          </Link>

          <a href={whatsappLink} target="_blank">
            <button
              disabled={parrot.status !== "available"}
              className={`text-sm px-4 py-2 rounded-lg
                ${parrot.status === "available"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"}
              `}
            >
              {parrot.status === "available" ? "WhatsApp" : "Unavailable"}
            </button>
          </a>

        </div>
      </div>
    </div>
  );
}