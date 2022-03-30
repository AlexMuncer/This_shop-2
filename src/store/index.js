import { createStore } from 'vuex'

export default createStore({
  state: { // contains information and vairables
    cart: { // create a object to act as shopping basket
      items: [], // is a list of items in basket
    },
    isAuthenticated: false,
    token:'',
    isLoading: false
  },
  
  mutations: { //synchronus to the state vairables as can't change them directly 
    initializeStore(state) { // enable to store things in the local browser
      if (localStorage.getItem('cart')) { // checks if there is a item in local storage called 'cart'
        state.cart = JSON.parse(localStorage.getItem('cart')) // if cart exists retrive that object
      } else { // if 'cart' doesn't exist create it
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }
    },
    addToCart(state, item) { //enables items to be added to the cart and adds the current item to cart
      const exists = state.cart.items.filter(i => i.product.id === item.product.id) // vairable helps check if the item is currently in the cart

      if (exists.length) {
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity) // if item is already in cart add to the quantity
      } else {
        state.cart.items.push(item) // if it's not already in the cart push the item there
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart(state) {
      state.cart = { items: [] }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    }
  },
  actions: {
  },
  modules: {
  }
})
