import { Request, Response } from "express";
import { DesignService } from "./design.service.js";
import { InvalidRequest } from "@/error/index.js";

const authorId = "9ac10786-624a-4106-965f-8d01ff0f3bd1";

export class DesignController {
  constructor(private service: DesignService) {}

  CreateDesignController = async (req: Request, res: Response) => {
    const { prompt } = (req.body as { prompt: string }) || {};
    if (!prompt) throw new InvalidRequest("prompt", "Prompt is Required");
    const design = await this.service.createDesign({ prompt, authorId });

    res.status(200).send({
      message: "Design Created Successfully",
      data: { id: design.id },
    });
  };
}
