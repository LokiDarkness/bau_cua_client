export default function TopBar({ title, chips }){
  return (
    <div className="fixed top-0 left-0 right-0 z-20
                    bg-red-600 text-white
                    flex justify-between items-center
                    px-4 py-3 shadow-lg">
      <b>{title}</b>
      <span id="chipHud">💰 {chips}</span>
    </div>
  )
}
