import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vReveal from './directives/v-reveal'
import 'github-markdown-css/github-markdown.css';


createApp(App).directive('reveal', vReveal).mount('#app')
