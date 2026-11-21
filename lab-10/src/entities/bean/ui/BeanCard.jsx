import { useId } from 'react'
import { paths } from '../../../shared/lib/index.js'
import { FavoriteButton, Link } from '../../../shared/ui/index.js'

export default function BeanCard({ bean, children }) {
  const titleId = useId()

  return (
    <article className="bean-card" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <Link to={paths.bean(bean.id)}>{bean.name}</Link>
      </h3>
      <p>{bean.notes.join(', ')}</p>
      <p className="price">{bean.price} грн</p>
      <FavoriteButton productId={bean.id} name={bean.name} />
      {children}
    </article>
  )
}
