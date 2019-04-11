Vue.component('error-el', {
    data() {
        return {
            isShown: false,
            title: '',
            message: ''
        }
    },

    methods: {
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