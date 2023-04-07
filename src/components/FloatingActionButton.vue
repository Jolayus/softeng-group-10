<script>
import MenuIcon from './Icons/MenuIcon.vue';
import UploadIcon from './Icons/UploadIcon.vue';
import AddIcon from './Icons/AddIcon.vue';
import EditIcon from './Icons/EditIcon.vue';
import TrashIcon from './Icons/TrashIcon.vue';

export default {
  name: 'FloatingActionButton',
  components: {
    MenuIcon,
    UploadIcon,
    AddIcon,
    EditIcon,
    TrashIcon
  },
  data() {
    return {
      showMenu: false,
      menuItems: [
        { icon: 'AddIcon', text: 'Add' },
        { icon: 'EditIcon', text: 'Edit' },
        { icon: 'TrashIcon', text: 'Delete' }
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  },
  props: ['isForTripRates'],
  mounted() {
    // If this component is used for trip rates
    if (Boolean(this.isForTripRates)) {
      const uploadObj =  { icon: 'UploadIcon', text: 'Upload', targetModal: "uploadFileModal" };
      this.menuItems.unshift(uploadObj);
    }
  }
};
</script>

<template>
  <div class="fab-container">
    <button style="list-style-type: none" class="fab" @click="toggleMenu">
      <MenuIcon />
    </button>
    <transition name="fade">
      <div class="menu p-0" v-if="showMenu">
        <ul class="list-style-none mb-0">
          <li v-for="(item, index) in menuItems" :key="index">
            <button type="button" class="list-item px-3 py-2 border w-100" data-bs-toggle="modal" :data-bs-target="`#${item.targetModal}`">
              <component :is="item.icon" /> {{ item.text }}
            </button>
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
  color: #fff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  border: none;
  outline: none;
}

.menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: #ffffff;
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

.list-style-none {
  list-style: none;
  padding: 0;
}

.list-item {
  display: flex;
  min-width: 80px;
  gap: 10px;
  cursor: pointer;
}

.list-item:hover {
  background-color: #4c7273;
  color: white;
}

button {
  border-radius: none;
}
</style>
