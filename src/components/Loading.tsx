import { Rings } from "react-loader-spinner"

export const Loading = () => {
  return (
    <div className="h-64 flex justify-center items-center">
      <Rings 
        height="80"
        width="80"
        color="#1C2A6D"
        radius="6"
        wrapperStyle={{}}
        wrapperClass="block mx-auto w-[80px] h-[80px]"
        visible={true}
        ariaLabel="rings-loading"
      />
    </div>
  )
}
