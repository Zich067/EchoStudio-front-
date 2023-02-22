import React, { useReducer, useContext, createContext, useEffect } from 'react'
import { reducer, init } from './cartReducer'
import useLocalStorage from './useLocalstorage'

const SecondCartContext = createContext(null)

export const SecondCartProvider = ({
  children,
  initialCartItems = [],
  localStorageKey = 'cart',
}) => {
  //read from localStorage
  // if localStorage has value with this key then use it to initialCartItems
  let items = initialCartItems

  if (!items.length) {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(localStorageKey)
      // Parse stored json or if none return initialValue
      items = item ? JSON.parse(item) : []
    } catch (error) {
      items = []
      console.log(error)
    }
  }

  const [state, dispatch] = useReducer(reducer, items, init)

  const [storedValue, setValue] = useLocalStorage(localStorageKey, items)

  useEffect(() => {
    if (JSON.stringify(state.items) !== storedValue) {
      setValue(state.items)
    }
  }, [state])

  const addItem = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    })
  }
  /**
   * 給定一id值，將這商品移出陣列中
   * @param {string} id
   * @returns {void}
   */
  const removeItem = (id) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: {
        id,
      },
    })
  }
  /**
   * 給定一item物件，依照id尋找後更新其中的屬性值
   * @param {Object} item
   * @returns {void}
   */
  const updateItem = (item) => {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: item,
    })
  }
  /**
   * 清空整個購物車
   * @returns {void}}
   */
  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART',
    })
  }
  /**
   * 給定一id值，回傳是否存在於購物車中
   * @param {string} id
   * @returns {boolean}
   */
  const isInCart = (id) => {
    return state.items.some((item) => item.id === id)
  }
  /**
   * 給定一id值，有尋找到商品時，設定quantity: quantity + 1
   * @param {string} id
   * @returns {void}
   */
  const plusOne = (id) => {
    return dispatch({
      type: 'PLUS_ONE',
      payload: {
        id,
      },
    })
  }
  /**
   * 給定一id值，有尋找到商品時，設定quantity: quantity - 1，但 quantity 最小值為1
   * @param {string} id
   * @returns {void}
   */
  const minusOne = (id) => {
    return dispatch({
      type: 'MINUS_ONE',
      payload: {
        id,
      },
    })
  }

  return (
    <SecondCartContext.Provider
      value={{
        cart: state,
        items: state.items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        isInCart,
        plusOne,
        minusOne,
      }}
    >
      {children}
    </SecondCartContext.Provider>
  )
}

export const useSecondCart = () => useContext(SecondCartContext)