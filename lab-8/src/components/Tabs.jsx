/**
 * Вкладки — складений компонент (compound component): `Tabs` і його частини
 * `Tabs.List`, `Tabs.Tab` і `Tabs.Panel`. Вміст кожної частини приходить між
 * її тегами як `children`, а яка вкладка обрана, частини дізнаються з
 * контексту, який створює `Tabs`.
 *
 * Використання:
 *   <Tabs defaultValue="brew">
 *     <Tabs.List aria-label="Про каву">
 *       <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
 *       <Tabs.Tab value="reviews">Відгуки</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="brew">…</Tabs.Panel>
 *     <Tabs.Panel value="reviews">…</Tabs.Panel>
 *   </Tabs>
 *
 * Вимоги — у тестах tests/Tabs.children.test.jsx і tests/Tabs.a11y.test.jsx.
 */
import { createContext, use, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)

  if (!context) {
    throw new Error('Tabs components must be rendered inside <Tabs>.')
  }

  return context
}

function TabsList({ children, className = '', ...props }) {
  useTabsContext()

  return (
    <div {...props} className={`tab-list ${className}`.trim()}>
      {children}
    </div>
  )
}

function TabsTab({ value, children, className = '', onClick, ...props }) {
  const { selectedValue, setSelectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <button
      {...props}
      type="button"
      className={`${className} ${isSelected ? 'active' : ''}`.trim()}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setSelectedValue(value)
      }}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, children, ...props }) {
  const { selectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <div {...props} hidden={!isSelected}>
      {children}
    </div>
  )
}

function Tabs({ defaultValue, children }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const context = { selectedValue, setSelectedValue }

  return (
    <TabsContext value={context}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel

export default Tabs
