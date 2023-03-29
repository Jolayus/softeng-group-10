<script>
import MenuIcon from './Icons/MenuIcon.vue';

export default {
    name: "FloatingActionButton",
    components:{
        MenuIcon
    },
    data() {
        return {
            showMenu: false,
        };
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
    },
};
</script>

<template>
    <div class="fab-container">
        <button class="fab" @click="toggleMenu">
            <MenuIcon />
        </button>
        <transition name="fade">
            <div class="menu" v-if="showMenu">
                <ul>
                    <li><a href="#">Option 1</a></li>
                    <li><a href="#">Option 2</a></li>
                    <li><a href="#">Option 3</a></li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<style>
.fab-container {
    position: fixed;
    bottom: 40px;
    right: 20px;
}

.fab {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #2196F3;
    color: #FFF;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
    border: none;
    outline: none;
}

.menu {
    position: absolute;
    bottom: 80px;
    right: 0;
    background-color: #FFF;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
    padding: 10px;
    border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
