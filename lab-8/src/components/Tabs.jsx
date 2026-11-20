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
import { createContext, use, useId, useState } from 'react'

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
    <div {...props} role="tablist" className={`tab-list ${className}`.trim()}>
      {children}
    </div>
  )
}

function TabsTab({
  value,
  children,
  className = '',
  onClick,
  onKeyDown,
  ...props
}) {
  const { id, selectedValue, setSelectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const key = event.key
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return

    event.preventDefault()
    const tabList = event.currentTarget.closest('[role="tablist"]')
    if (!tabList) return

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'))
    const currentIndex = tabs.indexOf(event.currentTarget)
    if (currentIndex === -1 || tabs.length === 0) return

    let nextIndex
    if (key === 'Home') {
      nextIndex = 0
    } else if (key === 'End') {
      nextIndex = tabs.length - 1
    } else if (key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    const nextTab = tabs[nextIndex]
    nextTab.focus()
    setSelectedValue(nextTab.getAttribute('data-value'))
  }

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={`${id}-tab-${value}`}
      data-value={value}
      aria-selected={isSelected}
      aria-controls={`${id}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setSelectedValue(value)
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, children, ...props }) {
  const { id, selectedValue } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <div
      {...props}
      role="tabpanel"
      id={`${id}-panel-${value}`}
      aria-labelledby={`${id}-tab-${value}`}
      tabIndex={0}
      hidden={!isSelected}
    >
      {children}
    </div>
  )
}

function Tabs({ defaultValue, children }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const id = useId()
  const context = { id, selectedValue, setSelectedValue }

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
