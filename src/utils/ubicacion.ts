export interface Coords {
  lat: number;
  lng: number;
}

export const googleMapsLink = ({ lat, lng }: Coords) =>
  `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
