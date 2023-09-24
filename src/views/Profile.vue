<template>
  <div>
    Profile
  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";

export default {
  mounted() {
    // const auth = getAuth();
    // updateProfile(auth.currentUser, {
    //   displayName: "Bruno"
    // }).then(() => {
    //   console.log('Profile updated!')
    //   // Profile updated!
    //   // ...
    // }).catch((error) => {
    //   console.log('Error updating profile')
    //   // An error occurred
    //   // ...
    // });
  }
}
</script>

<style lang="scss" scoped>

</style>