export default function Avatar({ person, size = 64 }) {
  return (
    <div>
      <img
        className="avatar"
        src={person.photo}
        alt={person.name}
        width={size}
        height={size}
      />
    </div>
  )
}
