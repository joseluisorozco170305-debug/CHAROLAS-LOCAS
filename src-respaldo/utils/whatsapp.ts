import { config } from '../data/config'
export const whatsappUrl = (message = 'Hola, quiero hacer un pedido en CHAROLAS LOCAS.') =>
  `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`
