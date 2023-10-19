<template>
  <div class="layer">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@mixin flex($direction: row, $align: flex-start, $justify: flex-start) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}

.layer {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 59, 59, 0.722);
}
.loader {
  z-index: 10000;
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid var(--primary-color);
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: fixed;
  top: 45%;
  left: 0;
  right: 0;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  @include flex(column, center, center);
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 450px) {
  .loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid var(--primary-color);
    width: 50px;
    height: 50px;
  }
}
</style>
