<template>
    <div class="Page-success">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Success!</h1>

                <p>Your order is being prepared.</p>
            </div>
        </div>
    </div>
</template>
  


<script>
export default {
    name: 'Success',
    mounted() {
        document.title = 'Success | Shop'
    },
    methods:{

    }
}
</script>