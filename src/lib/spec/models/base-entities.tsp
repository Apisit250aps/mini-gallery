namespace Domain.Entity;

  model BaseEntity {
    id: string;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
  }

  model Project {
    ...BaseEntity;

    name: string;
    slug: string;
    tags: string[];
    creator: string;
    description: string | null;
    isActive: boolean;
    images: string[];
  }

  model User {
    ...BaseEntity;

    name: string;
    email: string;
    emailVerified: boolean | null;
  }
