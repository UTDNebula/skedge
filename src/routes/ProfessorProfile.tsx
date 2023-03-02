import { Card } from "~components/Card"
import { HorizontalScores } from "~components/HorizontalScores"
import { LinkButton } from "~components/LinkButton"
import { ProfileGrades } from "~components/ProfileGrades"
import { ProfileHeader } from "~components/ProfileHeader"
import { RmpTag } from "~components/RmpTag"

export const ProfessorProfile = () => {
  return (
    <div className="w-[400px] p-4 h-[1000px]">
      <ProfileHeader name="John Deere" />
      <Card>
        <div className="m-16"></div>  {/* spacer */}
        <HorizontalScores rmpScore={4.3} diffScore={3.45} wtaPercent={92} />
        <RmpTag text="GREAT LECTURES" />
        <ProfileGrades />
        <LinkButton />
      </Card>
    </div>
  )
}