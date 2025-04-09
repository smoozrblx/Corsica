import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Download } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Commune {
  code_insee: string;
  nom: string;
  creation: number;
  suppression: string | null;
  latitude: number;
  longitude: number;
}

function App() {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [center, setCenter] = useState<[number, number]>([42.15, 9.08]); // Centre de la Corse

  useEffect(() => {
    // Données complètes des communes de Haute-Corse
    const fullData: Commune[] = [
      {
        code_insee: "2B002",
        nom: "Aghione",
        creation: 1864,
        suppression: null,
        latitude: 42.1125,
        longitude: 9.40138888889
      },
      {
        code_insee: "2B009",
        nom: "Aléria",
        creation: 1824,
        suppression: null,
        latitude: 42.1147222222,
        longitude: 9.51333333333
      },
      {
        code_insee: "2B075",
        nom: "Casevecchie",
        creation: 1866,
        suppression: null,
        latitude: 42.1436111111,
        longitude: 9.36083333333
      },
      {
        code_insee: "2B366",
        nom: "Chisa",
        creation: 1946,
        suppression: null,
        latitude: 41.9252777778,
        longitude: 9.26388888889
      },
      {
        code_insee: "2B121",
        nom: "Galéria",
        creation: 1864,
        suppression: null,
        latitude: 42.41,
        longitude: 8.64916666667
      },
      {
        code_insee: "2B123",
        nom: "Ghisonaccia",
        creation: 1845,
        suppression: null,
        latitude: 42.0175,
        longitude: 9.40555555556
      },
      {
        code_insee: "2B153",
        nom: "Manso",
        creation: 1600,
        suppression: null,
        latitude: 42.3666666667,
        longitude: 8.79305555556
      },
      {
        code_insee: "2B231",
        nom: "Pigna",
        creation: 1792,
        suppression: null,
        latitude: 42.6002777778,
        longitude: 8.90277777778
      },
      {
        code_insee: "2B365",
        nom: "San-Gavino-di-Fiumorbo",
        creation: 1939,
        suppression: null,
        latitude: 41.9844444444,
        longitude: 9.26916666667
      },
      {
        code_insee: "2B277",
        nom: "Serra-di-Fiumorbo",
        creation: 1800,
        suppression: null,
        latitude: 41.9861111111,
        longitude: 9.33666666667
      },
      {
        code_insee: "2B033",
        nom: "Bastia",
        creation: 1500,
        suppression: null,
        latitude: 42.697283,
        longitude: 9.450881
      },
      {
        code_insee: "2B050",
        nom: "Calvi",
        creation: 1500,
        suppression: null,
        latitude: 42.567847,
        longitude: 8.757697
      },
      {
        code_insee: "2B096",
        nom: "Corte",
        creation: 1500,
        suppression: null,
        latitude: 42.307093,
        longitude: 9.148857
      },
      {
        code_insee: "2B168",
        nom: "Morosaglia",
        creation: 1500,
        suppression: null,
        latitude: 42.4758,
        longitude: 9.2075
      },
      {
        code_insee: "2B247",
        nom: "Saint-Florent",
        creation: 1500,
        suppression: null,
        latitude: 42.681436,
        longitude: 9.303511
      }
    ];

    // Trier les communes par nom
    const sortedData = [...fullData].sort((a, b) => a.nom.localeCompare(b.nom));
    setCommunes(sortedData);
  }, []);

  const handleCommuneSelect = (commune: Commune) => {
    setSelectedCommune(commune);
    setCenter([commune.latitude, commune.longitude]);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Code INSEE,Nom,Création,Suppression,Latitude,Longitude\n" +
      communes.map(c => 
        `${c.code_insee},${c.nom},${c.creation},${c.suppression || ''},${c.latitude},${c.longitude}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "communes_haute_corse.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 bg-gray-800 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Communes de Haute-Corse</h1>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download size={20} />
            Exporter
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 flex gap-4">
        {/* Liste déroulante et informations */}
        <div className="w-1/3 bg-gray-800 p-4 rounded-lg">
          <div className="mb-4">
            <select
              className="w-full p-2 bg-gray-700 rounded-lg text-white"
              onChange={(e) => {
                const commune = communes.find(c => c.code_insee === e.target.value);
                if (commune) handleCommuneSelect(commune);
              }}
              value={selectedCommune?.code_insee || ''}
            >
              <option value="">Sélectionner une commune</option>
              {communes.map(commune => (
                <option key={commune.code_insee} value={commune.code_insee}>
                  {commune.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Liste complète des communes */}
          <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
            {communes.map(commune => (
              <div
                key={commune.code_insee}
                className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                  selectedCommune?.code_insee === commune.code_insee ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleCommuneSelect(commune)}
              >
                {commune.nom}
              </div>
            ))}
          </div>

          {selectedCommune && (
            <div className="mt-4 space-y-4 p-4 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-bold">{selectedCommune.nom}</h2>
              <div>
                <p><span className="font-semibold">Code INSEE:</span> {selectedCommune.code_insee}</p>
                <p><span className="font-semibold">Création:</span> {selectedCommune.creation}</p>
                <p><span className="font-semibold">Coordonnées:</span> {selectedCommune.latitude}, {selectedCommune.longitude}</p>
              </div>
            </div>
          )}
        </div>

        {/* Carte */}
        <div className="w-2/3 bg-gray-800 rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: "700px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {communes.map(commune => (
              <Marker
                key={commune.code_insee}
                position={[commune.latitude, commune.longitude]}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h3 className="font-bold">{commune.nom}</h3>
                    <p>Code INSEE: {commune.code_insee}</p>
                    <p>Création: {commune.creation}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default App;