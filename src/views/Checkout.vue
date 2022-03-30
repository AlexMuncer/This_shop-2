<template>
    <div class="Page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice }}</td>
                        </tr>
                    </tfoot>

                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Delivery details</h2>

                <p class="has-test-grey mb-4"> *required fields</p>
                

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name *</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name *</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail *</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Phone *</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>

                        <div class="field">
                            <label>Address *</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Post code *</label>
                            <div class="control">
                                <input type="text" class="input" v-model="post_code">
                            </div>
                        </div>
                    </div>

                    <div class="notification is-danger mt-4" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>
                </div>

                <hr>
                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>
                    <button class="button is-dark" @click="submitForm">Confirm Order</button>
                </template>            
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
export default {
    name: 'Checkout',
   
    data() {
        return {
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            post_code: '',
            errors: []
        }
        
    },
    mounted() {
        document.title = 'Checkout | Store'

        this.cart = this.$store.state.cart

        
        if (this.cartTotalLength > 0) {
            this.stripe = Stripe('sk_test_51KikRpC2dtMtsh3Qqrd9K6ZdXjeNYHpJkwnCTHLpYH22L1rs9Ev1rqbMl5KfSMdt4PIITJCasaLDa8zO0KOTTJdB00JOjPIEk7')
            const elements = this.stripe.elements();
            this.card = elements.create('card', {hidePostalCode: true})

            this.card.mount('#card-element')
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        submitForm() {
            this.errors = []

            if (this.first_name === '') {
                this.errors.push('The First name field is empty!')
            }
            if (this.last_name === '') {
                this.errors.push('The Last name field is empty!')
            }
            if (this.email === '') {
                this.errors.push('The E-mail field is empty!')
            }
            if (this.phone === '') {
                this.errors.push('The Phone field is empty!')
            }
            if (this.address === '') {
                this.errors.push('The Address field is empty!')
            }
            if (this.post_code === '') {
                this.errors.push('The Post code field is empty!')

            }

            if(!this.errors.length) {
                

                this.stripe.createToken(this.card).then(result => {
                    if (result.error) {
                        

                        this.errors.push('Something went wrong.')

                        console.log(result.error.message)
                    } else {
                        this.stripeTokenHandler(result.token)
                    }
                })
            }
        },
        async stripeTokenHandler(token) {
            const items = []

            for (let i= 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }
                items.push(obj)
            }

            const data = {
                'first_name': this.first_name,
                'last_name': this.last_name,
                'email': this.email,
                'address': this.address,
                'post_code': this.post_code,
                'items': items,
                'stipe_token': token.id
            }
            await axios 
                .post('/api/v1/checkout/', data)
                .then(response => {
                    this.$store.commit('clearCart')
                    this.$router.push('/cart/success')
                })
                .catch(error => {
                    this.errors.push('Something went wrong.')
                    console.log(error)
                })

                this.$store.commit('setIsLoading', false)
        }

    },
    computed: {
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        },
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        }
    } 
}
</script>