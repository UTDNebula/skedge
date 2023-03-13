import { useLocation } from "react-router-dom"
import { Card } from "~components/Card"
import { HorizontalScores } from "~components/HorizontalScores"
import { LinkButton } from "~components/LinkButton"
import { ProfileGrades } from "~components/ProfileGrades"
import { ProfileHeader } from "~components/ProfileHeader"
import { RmpRatings } from "~components/RmpRatings"
import { RmpTag } from "~components/RmpTag"
import type { ProfessorProfileInterface } from "./about"

export const ProfessorProfile = () => {
  const { state }: { state: ProfessorProfileInterface } = useLocation();
  return (
    <div className="w-[400px] p-4 h-[1000px]">
      <ProfileHeader name={state.name} profilePicUrl={state.profilePicUrl} />
      <Card>
        <div className="my-16"></div>  {/* spacer */}
        <HorizontalScores rmpScore={state.rmpScore} diffScore={state.diffScore} wtaPercent={state.wtaScore} />
        <div className="flex flex-wrap gap-2 my-2 justify-center"> {/* RMP Tag area */}
          {state.rmpTags.sort((a, b) => b.length - a.length).map((item, index) => 
            <RmpTag key={index} text={item} />
          )}
        </div>
        <RmpRatings ratingsDistributionData={state.ratingsDistribution}/>
        <div className="my-2"></div>  {/* spacer */}
        <ProfileGrades gradeDistributionData={state.gradeDistributions} />
        <LinkButton />
      </Card>
    </div>
  )
}