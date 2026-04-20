export const incendiosMock = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-70.6483, -33.4569] },
      properties: { nombre: "Incendio Sector Norte", nivel: "crítico" }
    },
    {
      type: "Feature", 
      geometry: { type: "Point", coordinates: [-71.2000, -33.0000] },
      properties: { nombre: "Incendio Sector Sur", nivel: "moderado" }
    }
  ]
}

export const usuariosMock = [
  { id: 1, nombre: "Keiton", rol: "funcionario" },
  { id: 2, nombre: "Sergio", rol: "brigadista" },
  { id: 3, nombre: "Matías", rol: "ciudadano" }
]