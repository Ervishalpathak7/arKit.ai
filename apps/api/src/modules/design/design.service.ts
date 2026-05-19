import { GetAuthorDesignDTO, UpdateDesignDTO } from "./design.dto.js";
import { DesignRepository } from "./design.repository.js";
import { CreateDesignInput } from "./design.types.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class DesignService {
  constructor(private repo: DesignRepository) {}

  async createDesign(data: CreateDesignInput) {
    return this.repo.create(data);
  }

  async getAuthorDesign(data: GetAuthorDesignDTO) {
    return this.repo.findByIdAndAuthor(data);
  }

  async updateDesign({ id, authorId, data }: UpdateDesignDTO) {
    return this.repo.update(id, authorId, data);
  }

  async listAuthorDesigns(
    authorId: string,
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
  ) {
    const checkedLimit =
      limit <= 0 ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
    const checkedPage = page < 0 ? 1 : page;
    return this.repo.findByAuthor(authorId, checkedPage, checkedLimit);
  }
}
