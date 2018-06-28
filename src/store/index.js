import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

const STOR_LISTS = 'lists'
const STOR_ITEMS = 'items'
const LIST_NUM = 'num'
const IS_LOGIN = 'islogin'
const USERS = 'users'
const USER_NUM = 'usernum'

const state = {
    lists: JSON.parse(window.localStorage.getItem(STOR_LISTS) || '[]'),
    items: JSON.parse(window.localStorage.getItem(STOR_ITEMS) || '[]'),
    num: window.localStorage.getItem(LIST_NUM),
    users: JSON.parse(window.localStorage.getItem(USERS) || '[]'),
    islogin: window.localStorage.getItem(IS_LOGIN),
    usernum: JSON.parse(window.localStorage.getItem(USER_NUM) || '[]')
}
const getters = {
  lists: state => state.lists,
  items: state => state.items,
  users: state => state.users,
  usernum: state => state.usernum,
  islogin: state => state.islogin,
  getItem: (state) => (importance) => {
    var todos = state.items.filter(item => {
        if (item.importance == importance) return true;
        return false;
      });
    return todos;
  },
  getItemsbyname: (state) => (name) => {
    var todos = state.items.filter(item => {
        if (item.belong == name){
          return true;
        }
        return false;
      });
    return todos;
  }
}
const mutations = {
  addList(state, obj) {
    var list = {
      id: state.num++,
      title: obj.title,
      count: 0,
      isDelete: false
    }
    state.lists.push(list);
  },
  addItem(state, obj) {
    var item = {
      text: obj.text,
      finished: false,
      importance: obj.importance,
      date: obj.date,
      belong: obj.belong,
      isEdited:false
    }
    state.items.push(item);
  },
  deleteItem(state, text) {
    state.items.splice(state.items.findIndex(item => item.text == text), 1)
  },
  addUser(state, obj) {
    var username = obj.username;
    var password = obj.password;
    state.users.push({username: username, password: password})
  },
  setLogin (state, islogin) {
    state.islogin = islogin;
  },
  edit(state,item){
    
  }
}
const localStoragePlugin = store => {
  store.subscribe((mutation, { lists,items,num,islogin,usernum,users }) => {
    window.localStorage.setItem(STOR_LISTS, JSON.stringify(lists))
    window.localStorage.setItem(STOR_ITEMS, JSON.stringify(items))
    window.localStorage.setItem(LIST_NUM, num)
    window.localStorage.setItem(IS_LOGIN, islogin)
    window.localStorage.setItem(USERS, JSON.stringify(users))
    window.localStorage.setItem(USER_NUM, usernum)
  })
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [localStoragePlugin]
})
