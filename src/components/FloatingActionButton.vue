<script>
import MenuIcon from './Icons/MenuIcon.vue';
import EditIcon from './Icons/EditIcon.vue';
import TrashIcon from './Icons/TrashIcon.vue';

export default {
    name: "FloatingActionButton",
    components:{
        MenuIcon,
        EditIcon,
        TrashIcon
    },
    data() {
        return {
            showMenu: false,
            menuItems: [
                { icon: 'Icon', text: 'Add' },
                { icon: 'EditIcon', text: 'Edit' },
                { icon: 'TrashIcon', text: 'Delete' },
            ],
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
        <button style="list-style-type: none" class="fab" @click="toggleMenu">
            <MenuIcon />
        </button>
        <transition name="fade">
            <div class="menu" v-if="showMenu">
                <ul>
                    <li v-for="(item, index) in menuItems" :key="index">
                        <component :is="item.icon" /> {{ item.text }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fab-container {
    position: fixed;
    bottom: 50px;
    right: 30px;
}

.fab {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #041421;
    color: #FFF;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
    border: none;
    outline: none;
}

.menu {
    position: absolute;
    bottom: 70px;
    right: 0;
    background-color: #FFFFFF;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
    padding: 10px;
    border-radius: 10px;
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
