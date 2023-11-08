import loading_screen from "data-base64:../../assets/loading-screen.png"
import { useEffect } from "react";

export const Title = (props: { setLandingSlide: (n: number) => void }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      props.setLandingSlide(1)
    }, 1500);
  }, []);

    return (
        <div className="h-auto">
          <img src={loading_screen} alt="" className="float-middle"/>
        </div>
    )
}
