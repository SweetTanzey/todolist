<template>
<div>
	<div v-if="isLogin" class="col-menu" :class="{active:Stylechange}">
		<div class="separator" @click="logout">
			<md-avatar>
				<img src="../images/user.png" alt="People" title="用户注销" >
			</md-avatar>
		</div>

		<div class="main-menu">
			<a href="#">
				<img src="../images/event/2x/event.png" @click="toItems('all')" />
				<md-tooltip md-direction="right">所有清单事项</md-tooltip>
			</a>
			<a href="#" v-for="list in lists">
				<md-avatar>
						<img src="../images/list/2x/list.png" @click="toItems(list.title)" />
						<md-tooltip md-direction="right">{{ list.title }}</md-tooltip>
				</md-avatar>
			</a>
			<a href="#">
				<img src="../images/add/2x/add.png" @click="showDialog = true" />
				<md-tooltip md-direction="right">添加清单</md-tooltip>
			</a>
			<a href="#">
				<img src="../images/search/2x/search.png" @click="showSearch = true" />
				<md-tooltip md-direction="right">搜索待办事项</md-tooltip>
			</a>
		</div>
	</div>

	<md-dialog :md-active.sync="showItem">
		<md-dialog-title>清单事项</md-dialog-title>
		<md-table v-model="items" md-card style="width: 100%;height:280px">
			<md-table-row slot="md-table-row" slot-scope="{ item }">
				<md-table-cell md-label="事项名称" md-sort-by="recordtext" >
					{{item.text}}
				</md-table-cell>
				<md-table-cell md-label="完成日期" md-sort-by="recorddate">
					{{ item.date | formatDate }}
				</md-table-cell>
				<md-table-cell md-label="是否完成" md-sort-by="ischecked">
					{{item.finished}}
				</md-table-cell>
			</md-table-row>
		</md-table>
	</md-dialog>

	<md-dialog :md-active.sync="showDialog" style="padding: 20px;width: 400px;">
		<md-dialog-title>新建清单</md-dialog-title>
		<input type="test" v-model="title" placeholder='请输入清单名称' />
		<md-dialog-actions>
	  		<md-button class="btn btn-primary" @click="addList">创建</md-button>
	  	</md-dialog-actions>
  	</md-dialog>
    <!--搜索事项的对话框-->
	<md-dialog :md-active.sync="showSearch" style="padding: 10px">
		<md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
			<md-table-toolbar>
				<div class="md-toolbar-section-start">
					<h1 class="md-title">搜索事项</h1>
				</div>
				<md-field md-clearable class="md-toolbar-section-end">
					<md-input placeholder="Search for..." v-model="search" @input="searchOnTable" />
				</md-field>
			</md-table-toolbar>

			<md-table-empty-state md-label="没发现该条事项" :md-description="`没发现 '${search}' 事项，请返回添加事项！`">
			</md-table-empty-state>

			<md-table-row slot="md-table-row" slot-scope="{ item }">
				<md-table-cell md-label="事项名称">{{ item.text }}</md-table-cell>
				<md-table-cell md-label="完成日期">{{ item.date | formatDate}}</md-table-cell>
				<md-table-cell md-label="所在清单">{{ item.belong }}</md-table-cell>
				<md-table-cell md-label="是否完成">{{ item.finished }}</md-table-cell>
			</md-table-row>
		</md-table>
	</md-dialog>

	<div  class="my-content" >
		<div class="md-layout md-gutter" v-if="isLogin">
			<!--更改样式的盒子-->
			<div class="title">
				<div class="title-l">ToDo</div>
				<div class="title-r">
					<img src="../images/style/2x/style.png" @click="changStyle()" >
					<md-tooltip md-direction="left">更改样式</md-tooltip>
				</div>
			</div>	
			<div class="top">
		    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
		    	<todo :importance="1"></todo>
		    </div>
		    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
		    	<todo :importance="2"></todo>
		    </div>
			</div>
			<div class="bottom">
		    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
		    	<todo :importance="3"></todo>
		    </div>
		    <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
		    	<todo :importance="4"></todo>
		    </div>
			</div>
		</div>
  </div>
</div>
</template>

<script>
import {formatDate} from '../assets/date.js' 
import todo from './todo'

const toLower = text => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.text).includes(toLower(term)))
  }
  return items
}


export default {
	data() {
		return {
			title: '',
			showDialog: false,
			showItem: false,
			toName: '',
			showSearch: false,
			search: '',
			searched: [],
			Stylechange:false
		}
	},
	created() { 
	    this.searched = this.items;
	},
	components: {
		todo
	},
	computed: {
		lists() {
			return this.$store.getters.lists;
		},
		items() {
			if(this.toName==='all'){
				return this.$store.getters.items;
			}
			else return this.$store.getters.getItemsbyname(this.toName)
		},
		allitems() {
			return this.$store.getters.items;
		},
		isLogin() {
	      return this.$store.getters.islogin;
	    }
	},
	methods: {
		addList() {
			this.$store.commit('addList', {title: this.title});
			this.showDialog = false,
			this.title = ''
		},
		toItems(name) {
			this.toName = name;
			this.showItem = true;
		},
		searchOnTable () {
	      this.searched = searchByName(this.allitems, this.search)
		},
		changStyle(){
			this.Stylechange=!this.Stylechange;
		},
		logout() {
			this.$store.commit('setLogin', false);
			this.$router.push('/');
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

.col-menu {
  float: left;
  width: 80px;
  height: 793px;
  color: #a0a9ad;
  background-color: #4d5558;
  text-align: center;
  padding-top: 15px;
}
.active{
	background: linear-gradient(to bottom, rgba(22, 67, 151),rgb(144, 212, 223));
}
.my-content {
    margin-left:80px;
    margin-right: 0;
    padding-bottom: 25px;
    position: relative;
    min-height: 100%;
    height: 793px;
    width: 94%;
	background-color: white;
}

.main-menu {
  padding-top: 10px;
  margin-top: 20px;
  box-sizing: border-box;
}
.main-menu a {
    display: block;
    margin: 15px;
}
.title{
	width:100%;
	height:50px;
}
.title-l{
	font-size:30px;
	margin-top: 18px;
	padding-left:32px;
	float: left;
}
.title-r{
	margin-top: 15px;
	padding-right:42px;
	float: right;
}
.md-layout{
	width:100%;
	height:100%;
	position: relative;
	left:20px;
}
.md-layout-item{
	width:650px;
	height: 350px;
	float:left;
	padding: 10px;
}
.top{
	width:100%;
	margin-left:25px;
}
.bottom{
	width:100%;
	margin-left:25px;
	margin-top: 10px;
}
</style>
