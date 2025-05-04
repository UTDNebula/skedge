export type GradesData = {
  _id: string;
  grade_distribution: number[];
}[];
export type GradesType = {
  mean_gpa: number;
  gpa: number;
  total: number;
  grade_distribution: number[];
  grades: GradesData;
};
