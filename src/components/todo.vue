<template>
<div>
	<div v-if="!isUpdate">
		<a>
			<b-alert show  style="cursor: pointer;background-color: #FFEDE7;" v-if="importance === 1">
        <span style="padding: 0">很重要-很紧急</span>
				<img src="../images/add/2x/add.png" style="opacity:0.8; height:20px;width:20px;margin-left:20px;" @click="createItem">
        <img src="../images/finish/finished.png" style="height:20px;width:20px;opacity:0.4;margin-left:20px;" title="显示已完成" @click="isFinished = !isFinished">
        <img src="../images/sort/2x/sort.png" @click="isSort = !isSort" style="height:20px;width:20px;opacity:0.4;" title="排序" >
			</b-alert>
		</a>
    <a v-if="importance === 2">
      <b-alert show  style="cursor: pointer;background-color: #FEAE6A;">
        <span style="padding: 0" @click="createItem">重要-不紧急</span>
        <img src="../images/add/2x/add.png" style="opacity:0.8; height:20px;width:20px;margin-left:20px;" @click="createItem">
        <img src="../images/finish/finished.png" style="height:20px;width:20px;opacity:0.4;margin-left:20px;" title="显示已完成" @click="isFinished = !isFinished">
        <img src="../images/sort/2x/sort.png" @click="isSort = !isSort" style="height:20px;width:20px;opacity:0.4;" title="排序">
      </b-alert>
    </a>
    <a v-if="importance === 3">
      <b-alert show  style="cursor: pointer;background-color: rgb(167, 125, 206)">
        <span style="padding: 0" @click="createItem">不重要-紧急</span>
        <img src="../images/add/2x/add.png" style="opacity:0.8; height:20px;width:20px;margin-left:20px;" @click="createItem">
        <img src="../images/finish/finished.png" style="height:20px;width:20px;opacity:0.4;margin-left:20px;" title="显示已完成" @click="isFinished = !isFinished">
        <img src="../images/sort/2x/sort.png" @click="isSort = !isSort" style="height:20px;width:20px;opacity:0.4;" title="排序">
      </b-alert>
    </a>
    <a v-if="importance === 4">
      <b-alert show  style="cursor: pointer;background-color: #89C557;">
        <span style="padding: 0" @click="createItem">不重要-不紧急</span>
        <img src="../images/add/2x/add.png" style="opacity:0.8; height:20px;width:20px;margin-left:20px;" @click="createItem">
        <img src="../images/finish/finished.png" style="height:20px;width:20px;opacity:0.4;margin-left:20px;" title="显示已完成" @click="isFinished = !isFinished">
        <img src="../images/sort/2x/sort.png" @click="isSort = !isSort" style="height:20px;width:20px;opacity:0.4;" title="排序">
      </b-alert>
    </a>
	</div>

	<div v-if="isUpdate">
		<input class="form-control" type="text" v-model="text"  placeholder='请输入事项名称' />
		<md-datepicker v-model="selectedDate" md-immediately>
      <label>请选择执行日期</label>
    </md-datepicker>
    <md-field>
      <label>请选择所属清单</label>
      <md-select v-model="belong" name="belong" id="belong">
        <md-option v-for="(list, index) in lists" :value="list.title" :key="index">{{ list.title }}</md-option>
      </md-select>
    </md-field>
    <md-button class="md-primary md-raised" @click="isUpdate = false">取消</md-button>
    <md-button class="md-primary md-raised" @click="onAdd">确定</md-button>
	</div>
  <!--原始表格-->
	<div style="height: 100%">
		<md-table v-model="items" md-card style="width: 100%;height:260px" v-if="!isSort&&!isFinished">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="事项名称" md-sort-by="text">
          <md-checkbox v-model="item.finished" @change="change(item)"></md-checkbox>
          <span v-if="!item.isEdited">{{ item.text }}</span>
          <md-input  v-if="item.isEdited" style="width: 60px" @keyup.enter="item.isEdited = false" v-model="item.text"></md-input>
        </md-table-cell>
        <md-table-cell md-label="时间">
          {{ item.date | formatDate }}
        </md-table-cell>
        <md-table-cell md-label="是否完成">
          {{ item.finished }}
        </md-table-cell>
        <md-table-cell md-label="操作">
          <a @click="item.isEdited = true" href="#">修改</a>
        </md-table-cell>
        <md-table-cell md-label="操作">
          <a @click="deleteItem(item.text)" href="#">删除</a>
        </md-table-cell>
      </md-table-row>
	  </md-table>
    <!--排序表格-->
    <md-table v-model="sortitems" md-card style="width: 100%;height:260px" v-if="!isFinished&&isSort">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="事项名称" md-sort-by="text">
          <md-checkbox v-model="item.finished"></md-checkbox>
          <span v-if="!isedit">{{ item.text }}</span>
          <md-input  v-if="isedit" style="width: 60px" @keyup.enter="isedit = false" v-model="item.text"></md-input>
        </md-table-cell>
        <md-table-cell md-label="时间">
          {{ item.date | formatDate }}
        </md-table-cell>
        <md-table-cell md-label="是否完成">
          {{ item.finished }}
        </md-table-cell>
        <md-table-cell md-label="操作">
          <a @click="isedit = true" href="#">修改</a>
        </md-table-cell>
        <md-table-cell md-label="操作">
          <a @click="deleteItem(item.text)" href="#">删除</a>
        </md-table-cell>
      </md-table-row>
	  </md-table>
    <!--已完成事项筛选表格-->
    <md-table v-model="finisheditems" md-card style="width: 100%;height:260px" v-if="isFinished">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="事项名称" md-sort-by="text" style="text-decoration:line-through">
          <span v-if="!isedit">{{ item.text }}</span>
          <md-input  v-if="isedit" style="width: 60px" @keyup.enter="isedit = false" v-model="item.text"></md-input>
        </md-table-cell>
        <md-table-cell md-label="时间" style="text-decoration:line-through">
          {{ item.date | formatDate }}
        </md-table-cell>
        <md-table-cell md-label="是否完成" style="text-decoration:line-through">
          {{ item.finished }}
        </md-table-cell>
        <md-table-cell md-label="操作">
          <a @click="deleteItem(item.text)" href="#">删除</a>
        </md-table-cell>
      </md-table-row> 
	  </md-table>
	</div>
</div>

</template>

<script>

import {formatDate} from '../assets/date.js' 

const sortbyDate = (items) => {
  items.sort((a, b) => {
    return a.date > b.date
  });
  return items;
}

export default {
  props: {
    'importance': {
    type: Number,
    required: true
    }
  },

  data(){
    return {
      text: '',
      isUpdate: false,
      selectedDate: '',
      belong: '',
      isSort: false,
      isFinished:false
    }
  },
  computed: {
    items() {
      return this.$store.getters.getItem(this.importance);
    },
    lists() {
      return this.$store.getters.lists;
    },
    sortitems() {
      var newItems = this.items;
      newItems = sortbyDate(newItems);
      return newItems;
    },
    finisheditems(){
      var newItems=[];
      newItems = this.items.filter(item => {
        if(item.finished===true)
          return true;
        else
          return false;
      });
      return newItems;
    }
  },
  methods: {
  	createItem() {
  		this.isUpdate = true;
  	},
  	onAdd() {
  		var item = {
  			text: this.text,
      	date: (this.selectedDate).getTime(),
        importance: this.importance,
        belong: this.belong,
        isEdited:false
  		};
      this.$store.commit('addItem', item);
      this.text = '';
      this.selectedDate = '';
  		this.isUpdate = false;
  	},
    deleteItem(text) {
      this.$store.commit('deleteItem', text);
    },
    sortItem() {
      this.items = sortbyDate(this.items);
    },
    change(item){
      this.$store.commit('edit',item)
    }
  },
  filters:{
      formatDate(time){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd');
      }
  }
}
</script>

<style>


</style>
