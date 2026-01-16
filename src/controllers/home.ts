import { Request, Response } from "express";

class Home {
  static render(req: Request, res: Response): void {
    res.render("home", {
      isMobile: req.useragent?.isMobile ? "Sim" : "Não",
      isDesktop: req.useragent?.isDesktop ? "Sim" : "Não",
      platform: req.useragent?.platform,
      browser: req.useragent?.browser,
      title: "OneLink POC - Página Inicial",
    });
  }
}

export default Home;
