<template>
	<div class="container">
    <template v-if="documents.length > 0">
      <Table :rows="documents" />
    </template>
    <template v-else>
      <p> {{ message }}</p>
    </template>
	</div>
</template>

<script>	
import Table from './Table.vue';

export default{
	components: {
		Table
	},
	props: {
		documents: {
			type: Array,
			default: () => []
		},
    message: {
      type: String,
      required: true
    }
	}

}
</script>

<style>
.container {
  margin: 25px auto;
  font-size: 13px;
}

.title {
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

</style>