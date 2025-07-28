declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      entryNo: string;
      department: string;
      academicYear: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    entryNo?: string;
    department?: string;
    academicYear?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture: string;
    entryNo: string;
    department: string;
    academicYear: string;
  }
}
