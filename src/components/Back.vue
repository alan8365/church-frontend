<template>
  <div class="back" @click="back">
    <img src="../assets/arrow.png" width="40px" />
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="scss" scoped>
.back {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding-top: 10px;
  background-color: #ffeecd;
  z-index: 500;
  text-align: center;
  cursor: pointer;
}

.back:hover {
  background-color: #ffd88b;
}
</style>
