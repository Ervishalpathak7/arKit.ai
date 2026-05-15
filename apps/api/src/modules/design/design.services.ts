import type { QueueService } from "../queue/queue.services.js";
import type { DesignInitDto } from "./design.dto.js";
import type { DesignRepository } from "./design.repo.js";

export class DesignService {
  constructor(
    private repository: DesignRepository,
    private queueService: QueueService,
  ) {}

  async initService(data: DesignInitDto) {
    const design = await this.repository.init(data);
    this.queueService.enqueue("design", design.id).catch((err) => {
      console.error("Failed to enqueue design job", err);
    });
    return design;
  }
}
