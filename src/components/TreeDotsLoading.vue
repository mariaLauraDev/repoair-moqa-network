<template>
  <div class="spinner"></div>
</template>

<script>
export default {}
</script>

<style lang="scss">
$dot-width: 8px;
$dot-height: 8px;
$dot-radius: $dot-width/2;

$dot-color: #b2b2b6;
$dot-bg-color: $dot-color;
$dot-before-color: $dot-color;
$dot-after-color: $dot-color;

$dot-spacing: $dot-width + $dot-width/2;

@mixin dot(
  $width: $dot-width,
  $height: $dot-height,
  $radius: $dot-radius,
  $bg-color: $dot-bg-color,
  $color: $dot-color
) {
  width: $width;
  height: $height;
  border-radius: $radius;
  background-color: $bg-color;
  color: $color;
}

.spinner {
  position: relative;

  @include dot;

  animation: dot-flashing 0.5s infinite linear alternate;
  animation-delay: 0.25s;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -$dot-spacing;

    @include dot($bg-color: $dot-before-color);

    animation: dot-flashing 0.5s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: $dot-spacing;

    @include dot($bg-color: $dot-after-color);

    animation: dot-flashing 0.5s infinite alternate;
    animation-delay: 0.5s;
  }
}

@keyframes dot-flashing {
  0% {
    background-color: $dot-color;
  }

  50%,
  100% {
    background-color: lighten($dot-color, 20%);
  }
}
</style>
