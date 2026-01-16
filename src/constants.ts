import { Links } from "./types";

const links: Links = {
  "instagram-demo": {
    appUrl: "instagram://user?username=exemplo",
    webUrl: "https://instagram.com/exemplo",
    name: "Instagram Demo",
    appStore: "https://apps.apple.com/app/instagram/id389801252",
    playStore:
      "https://play.google.com/store/apps/details?id=com.instagram.android",
  },
  "whatsapp-demo": {
    appUrl: "whatsapp://send?phone=5511999999999",
    webUrl: "https://wa.me/5511999999999",
    name: "WhatsApp Demo",
    appStore: "https://apps.apple.com/app/whatsapp-messenger/id310633997",
    playStore: "https://play.google.com/store/apps/details?id=com.whatsapp",
  },
  geru: {
    appUrl: "geru://home",
    webUrl: "https://www.geru.com.br",
    name: "Geru",
    appStore:
      "https://apps.apple.com/br/app/geru-cr%C3%A9dito-e-pix-parcelado/id1587713422",
    playStore:
      "https://play.google.com/store/apps/details?id=com.geru.app&hl=pt_BR&gl=BR",
  },
};

export default links;
