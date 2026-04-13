export interface IJob {
    _id: string;
    company: string;
    role: string;
    status: "Applied" | "Interview" | "Offer" | "Rejected";
    dateApplied: string;
    jobLink?: string;
    notes?: string;
  }
  
  export interface IUser {
    id: string;
    name: string;
    email: string;
  }
  
  export interface AuthContextType {
    user: IUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
  }