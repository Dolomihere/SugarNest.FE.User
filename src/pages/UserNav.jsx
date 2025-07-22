
export function UserNav({ links, setMode }) {
  return(
    <nav className="text-center">

      {links.map((option, i) => (
        <div key={i} onClick={() => setMode(i)} className="cursor-pointer hover:bg-amber-200 pt-2 rounded-md">
          {option.label}
        </div>
      ))}

    </nav>
  )
}
