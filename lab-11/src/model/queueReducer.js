/**
 * Ред'юсер черги замовлень.
 *
 * Стан:
 *   {
 *     orders: { ids: [...], byId: { [id]: { id, number, status, customerId, items } } },
 *     customers: { ids: [...], byId: { [id]: { id, name } } },
 *     lastNumber
 *   }
 * Початкові замовлення надходять у вкладеному форматі з src/data/orders.js,
 * а ред'юсер зберігає гостей окремо й посилається на них через customerId.
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти читають замовлення через selectColumn і selectOrder унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Нормалізує початкові замовлення й запам'ятовує останній виданий номер. */
export function createInitialState(orders) {
  const orderIds = []
  const ordersById = {}
  const customerIds = []
  const customersById = {}

  for (const order of orders) {
    orderIds.push(order.id)
    ordersById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }

    if (!Object.hasOwn(customersById, order.customer.id)) {
      customerIds.push(order.customer.id)
      customersById[order.customer.id] = { ...order.customer }
    }
  }

  return {
    orders: { ids: orderIds, byId: ordersById },
    customers: { ids: customerIds, byId: customersById },
    lastNumber: Math.max(0, ...orders.map((order) => order.number)),
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const { id, customer, items } = action.order
      const order = {
        id,
        number: state.lastNumber + 1,
        status: 'new',
        customerId: customer.id,
        items: items.map((item) => ({ ...item, done: false })),
      }
      const customerExists = Object.hasOwn(state.customers.byId, customer.id)

      return {
        ...state,
        orders: {
          ids: [...state.orders.ids, id],
          byId: { ...state.orders.byId, [id]: order },
        },
        customers: customerExists
          ? state.customers
          : {
              ids: [...state.customers.ids, customer.id],
              byId: {
                ...state.customers.byId,
                [customer.id]: { ...customer },
              },
            },
        lastNumber: order.number,
      }
    }
    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state

      const itemExists = order.items.some((item) => item.id === action.itemId)
      if (!itemExists) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }
    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      if (!order || !nextStatus[order.status]) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: { ...order, status: nextStatus[order.status] },
          },
        },
      }
    }
    case 'order_cancelled': {
      if (!Object.hasOwn(state.orders.byId, action.orderId)) return state

      const ordersById = { ...state.orders.byId }
      delete ordersById[action.orderId]

      return {
        ...state,
        orders: {
          ids: state.orders.ids.filter((id) => id !== action.orderId),
          byId: ordersById,
        },
      }
    }
    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      if (!customer) return state

      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: { ...customer, name: action.name },
          },
        },
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      customer: state.customers.byId[order.customerId],
      items: order.items,
    }))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined

  return {
    id: order.id,
    number: order.number,
    status: order.status,
    customer: state.customers.byId[order.customerId],
    items: order.items,
  }
}
