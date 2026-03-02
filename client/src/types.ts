export const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"] as const;

export type ApplicationStatus = (typeof statuses)[number];

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  jobUrl: string | null;
  notes: string | null;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  total: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  wishlist: number;
};

export type CreateApplicationPayload = Omit<
  JobApplication,
  "id" | "createdAt" | "updatedAt"
>;
