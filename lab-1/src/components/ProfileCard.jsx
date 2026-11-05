import { useState } from 'react'
import './ProfileCard.css'

function ProfileCard({ name, group, technologies }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <p className="profile-card__eyebrow">Про мене</p>
      <h1 className="profile-card__name">{name}</h1>
      <p className="profile-card__group">
        Група: <span>{group}</span>
      </p>

      <h2 className="profile-card__section-title">
        Технології, які хочу опанувати
      </h2>
      <ul className="profile-card__technologies">
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>

      <button
        className="profile-card__like-button"
        type="button"
        onClick={() => setLikes((count) => count + 1)}
      >
        Подобається <span aria-live="polite">{likes}</span>
      </button>
    </article>
  )
}

export default ProfileCard
