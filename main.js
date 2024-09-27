const CITYS = [
  {
    name: "Barranquilla",
    coord: [10.97947702532239, -74.80640387980903],
  },
  {
    name: "Soledad",
    coord: [10.912897588276424, -74.78762984566961],
  },
  {
    name: "Santo Tomas",
    coord: [10.76225371162029, -74.75554937782876],
  },
  {
    name: "Palmar",
    coord: [10.741799856938014, -74.75437058152926],
  },
  {
    name: "Baranoa",
    coord: [10.793124304503216, -74.91589617157095],
  },
  {
    name: "Puerto Colombia",
    coord: [10.988923163618477, -74.95402546248228],
  },
  {
    name: "Sabanagrande",
    coord: [10.78960233087306, -74.75432125456742],
  },
  {
    name: "Galapa",
    coord: [10.898669964859748, -74.88588314024032],
  },
];

// INIT MAP
const map = L.map("map").setView([10.987519695229325, -74.8096751996253], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// FORM

const form = document.querySelector("form");

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  routeValidate();
}

function routeValidate() {
  const route = document.querySelector("#route");
  const inputs = document.querySelectorAll("#city-input");
  const routeTitle = document.querySelector("#route-title");
  const resultBoard = document.querySelector(".bfs__data-general");

  const cityOrigin = inputs[0].value.toLowerCase();
  const cityDestiny = inputs[1].value.toLowerCase();

  const isCityOriginValid = CITYS.some(
    (city) => city.name.toLowerCase() === cityOrigin
  );
  const isCityDestinyValid = CITYS.some(
    (city) => city.name.toLowerCase() === cityDestiny
  );

  if (!isCityOriginValid && !isCityDestinyValid) {
    routeTitle.style.display = "none";
    resultBoard.style.display = "flex";
    route.textContent = "Ambos municipios no existen en el grafo.";
    route.style.fontSize = "1.1em";
  } else if (!isCityOriginValid) {
    routeTitle.style.display = "none";
    resultBoard.style.display = "flex";
    route.textContent = `El municipio ${inputs[0].value} no es válido.`;
    route.style.fontSize = "1.1em";
  } else if (!isCityDestinyValid) {
    routeTitle.style.display = "none";
    resultBoard.style.display = "flex";
    route.textContent = `El municipio ${inputs[1].value} no es válido.`;
    route.style.fontSize = "1.1em";
  } else {
    const OUTPUT = ["Sabanagrande", "Soledad", "Galapa", "Baranoa"]; // array para especificar la ruta, string para decir que no existe
    routeTitle.style.display = "block";
    resultBoard.style.display = "flex";
    route.style.display = "block";
    route.style.fontSize = "1.4em";
    const isRoute =
      typeof OUTPUT === "string"
        ? OUTPUT
        : OUTPUT.toString().replaceAll(",", " -> ");
    route.textContent = isRoute;
    drawRouteMap(OUTPUT);
  }
}

function drawRouteMap(OUTPUT) {
  const waypointsCitys = CITYS.filter((city) => OUTPUT.includes(city.name));
  const waypointsSort = waypointsCitys.sort((a, b) => {
    return OUTPUT.indexOf(a.name) - OUTPUT.indexOf(b.name);
  });
  const waypoints = waypointsSort.map((city) => L.latLng(city.coord));
  const firstCityOutput = CITYS.filter((city) => city.name === OUTPUT[0]);
  const isRoute =
    typeof OUTPUT === "string"
      ? [10.987519695229325, -74.8096751996253]
      : firstCityOutput[0].coord;

  map.setView(isRoute, map.getZoom());
  L.Routing.control({
    waypoints: waypoints,
    routeWhileDragging: false,
    draggableWaypoints: false,
  }).addTo(map);

  waypoints.forEach((point, index) => {
    const label = L.divIcon({
      className: "waypoint-label",
      html: (index + 1).toString(),
      iconSize: [50, 50],
    });

    L.marker(point, { icon: label }).addTo(map);
  });
}
