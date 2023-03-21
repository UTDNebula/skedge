import { NavigateFunction, useNavigate } from "react-router-dom"
import { mockData } from "./about"

export const Home = () => {
  const navigation: NavigateFunction = useNavigate()

  const onNextPage = (): void => {
    navigation("/test", { state: [mockData, mockData, mockData] })
  }

  return (
    <div style={{ padding: 16 }}>
      <span>Home page</span>
      <button onClick={onNextPage}>About</button>
    </div>
  )
}