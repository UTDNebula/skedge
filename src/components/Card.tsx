export const Card = (props) => {
  return (
    <div className="rounded-2xl p-4 shadow-md">
      {props.children}
    </div>
  )
}