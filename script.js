// Inicializar mapa
var map = L.map('map').setView([14.571075, -90.473761], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Marcador de emergencia
var alertCoord = [14.571075, -90.473761];
var alertMarker = L.marker(alertCoord).addTo(map)
  .bindPopup("🚨 SOS Detectado - 8:10 PM");

// Lista de unidades con coordenadas simuladas
var units = [
  { name: "Tomás", phone: "555-0143", status: "Disponible", coord: [14.570, -90.474] },
  { name: "Adrián", phone: "555-0190", status: "En ruta", coord: [14.572, -90.470] },
  { name: "Samuel", phone: "555-0125", status: "En incidente", coord: [14.569, -90.475] }
];

// Mostrar unidades en el mapa
units.forEach(unit => {
  L.marker(unit.coord, {icon: L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/68/68550.png",
    iconSize: [25, 25]
  })}).addTo(map).bindPopup(`${unit.name} - ${unit.status}`);
});

// Función para centrar mapa en la alerta
function centerMap() {
  map.setView(alertCoord, 16);
}

// Función para notificar unidades
function notifyUnits() {
  let nearest = findNearestUnit(alertCoord);
  alert(`Unidad más cercana: ${nearest.name} (${nearest.phone})\nNotificando todas las unidades...`);
  addToHistory(nearest.name);
}

// Función para registrar nueva unidad
function registerUnit() {
  let name = prompt("Nombre de la unidad:");
  let phone = prompt("Número de celular:");
  if(name && phone) {
    let list = document.getElementById("units-list");
    let li = document.createElement("li");
    li.textContent = `${name} - ${phone} (Disponible)`;
    list.appendChild(li);

    // Agregar al array y al mapa
    units.push({ name, phone, status: "Disponible", coord: alertCoord });
    L.marker(alertCoord).addTo(map).bindPopup(`${name} - Disponible`);
  }
}

// Calcular unidad más cercana
function findNearestUnit(coord) {
  let nearest = null;
  let minDist = Infinity;
  units.forEach(unit => {
    let dist = Math.sqrt(
      Math.pow(coord[0] - unit.coord[0], 2) +
      Math.pow(coord[1] - unit.coord[1], 2)
    );
    if(dist < minDist) {
      minDist = dist;
      nearest = unit;
    }
  });
  return nearest;
}

// Agregar notificación al historial
function addToHistory(unitName) {
  let history = document.getElementById("history-list");
  let li = document.createElement("li");
  let now = new Date().toLocaleTimeString();
  li.textContent = `${now} - ${unitName} notificado`;
  history.prepend(li);
}
