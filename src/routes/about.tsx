import { NavigateFunction, useNavigate } from "react-router-dom"
import type { GradeDistribution } from "~components/ProfileGrades";

export interface ProfessorProfileInterface {
  name: string;
  profilePicUrl: string;
  rmpScore: number;
  diffScore: number;
  wtaScore: number;
  rmpTags: string[];
  gradeDistributions: GradeDistribution[];
  ratingsDistribution: number[]; // temp
}

/** Temporary for testing */
export const mockData: ProfessorProfileInterface = {
  name: "Johny Deere",
  profilePicUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSUe2eaB9QYVkoJORkwnG2yfpPRqpqvRyUkWXOfvLOirm1mudvx",
  rmpScore: 4.3,
  diffScore: 2.55,
  wtaScore: 100,
  rmpTags: ["GREAT LECTURES", "SKIP CLASS? YOU WON'T PASS", "FRIENDLY", "TOUGH GRADER", "LOTS OF HOMEWORK"],
  gradeDistributions: [
    {
      name: "MATH 2418.003 (18S)",
      series: [{
        name: 'Students',
        data: [30, 40, 35, 50, 49, 60, 70, 79, 80, 10, 24, 65, 12, 50]
      }]
    },
    {
      name: "MATH 2418.003 (17S)",
      series: [{
        name: 'Students',
        data: [10, 40, 35, 50, 29, 65, 70, 79, 30, 15, 24, 35, 12, 20]
      }]
    }
  ],
  ratingsDistribution: [20, 13, 20, 33, 7]
}

export const About = () => {
  const navigation: NavigateFunction = useNavigate()

  const onNextPage = (): void => {
    navigation("/about", { state: mockData })
  }

  return (
    <div style={{ padding: 16 }}>
      <span>About page</span>
      <button onClick={onNextPage}>Home</button>
    </div>
  )
}