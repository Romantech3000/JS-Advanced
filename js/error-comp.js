Vue.component('error-el', {
    data() {
        return {
            isShown: false,
            title: '',
            message: ''
        }
    },

    methods: {
        // wanted to pass title, isShown, and message text as props, but the necessity to change isShown 
        // led to this function. I wonder if there's a better way to do it
        showBox(caption, error) {
            this.title = caption;
            this.message = error;
            this.isShown = true;
        }
    },

    template: `
    <div id="modal_bg" class="modal-bg" v-if="isShown">
        <div class="modal-central-pane">
            <h3 class="modal-title">{{title}}</h3>
            <p class="modal-text">{{message}}</p>
            <div class="modal-btn-wrap"><button class="btn modal-btn" @click="isShown = false">OK</button></div>
        </div>
        
    </div>
    `
});