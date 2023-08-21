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
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

.container {
  max-width: 800px;
  margin: 25px auto;
}

.title {
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.table {
  width: 100%;
  border-spacing: 0;
  box-sizing: border-box;
}

.table__cell,
.table__header {
  padding: 0.5rem;
  text-align: left;
}

.table__header {
    text-transform: capitalize;
    font-weight: bold;
    text-align: left;
}

.table__cell {
  font-size: 1.2rem;
  padding-inline: .5rem;
}

.table__row:nth-child(even) {
  background-color: #dee2e6;
}

</style>