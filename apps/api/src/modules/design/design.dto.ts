import { DesignUpdateInput } from "./design.types.js";

export type GetAuthorDesignDTO = {
  id: string;
  authorId: string;
};

export type UpdateDesignDTO = {
  id: string;
  authorId: string;
  data: DesignUpdateInput;
};
