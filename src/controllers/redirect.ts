import { Request, Response } from "express";
import links from "../constants";

class Redirect {
  static renderRedirectPage(req: Request, res: Response): void {
    const linkId = req.params.id as string;
    const link = links[linkId];

    if (!link) {
      return res.status(404).render("404", { linkId });
    }

    console.log(
      `[${new Date().toISOString()}] ${linkId} - ${
        req.useragent?.isMobile ? "Mobile" : "Desktop"
      } - ${req.useragent?.platform}`
    );

    if (req.useragent?.isMobile) {
      return res.render("redirect", {
        appUrl: link.appUrl,
        webUrl: link.webUrl,
        appStore: link.appStore,
        playStore: link.playStore,
        title: `Redirecionando para ${link.name}...`,
        isiOS: req.useragent?.isiOS,
        layout: "download",
      });
    }
    
    res.redirect(link.webUrl);
  }
}

export default Redirect;
