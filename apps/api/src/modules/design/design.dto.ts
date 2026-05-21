import { DesignUpdateInput } from "./design.types.js";

export type GetAuthorDesignDTO = {
  id: string;
  authorId: string;
};

export type CreateDesignDTO = {
  prompt : string,
  authorId : string,
  requestHash : string
  idempotencyKey : string
}

export type UpdateDesignDTO = {
  id: string;
  authorId: string;
  data: DesignUpdateInput;
};
