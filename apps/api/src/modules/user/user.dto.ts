export type CreateUserDTO = {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  clerkId: string;
};

export type UpdateUserDTO = {
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};
