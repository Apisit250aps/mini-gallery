namespace Domain.Entity;

  model BaseEntity {
    id: string;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  model User {
    ...BaseEntity;

    name: string;
    email: string;
    emailVerified: boolean | null;
  }
