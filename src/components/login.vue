<template>
	<div class="log">
		<div class="login">
			<md-field>
				<label>用户名：</label>
				<md-input v-model="username"></md-input>
	    	</md-field>
			<md-field>
				<label>密码：</label>
				<md-input v-model="password" type="password" @keyup.enter="checkLogin"></md-input>
			</md-field>
	    	<md-button class="md-raised" @click="checkLogin">登陆</md-button>
		</div>
	</div>
</template>


<script>

export default{
	data() {
		return {
			name: 'fjy',
			username: '',
			password: '',
			isLogin: false
		}
	},
	computed: {
		users() {
			return this.$store.getters.users;
		}
	},
	methods: {
		checkLogin() {
			var user = this.$store.getters.users.find(user => {
				return (this.username === user.username)&&(this.password === user.password);
			});
			if (!user) {
				this.$store.commit('setLogin', false)
			}else {
				this.$store.commit('setLogin', true)
				this.$router.push('/todo');
			}
	  }
	},
	created() {
		var user = {
	      username: 'fjy',
	      password: '222'
	    };
	  this.$store.commit('addUser', user);
	}
}

</script>

<style>
body {
	background:url(../images/login.jpg) no-repeat fixed top;
}

.log{
	padding-top:300px;

}
.login {
	margin: auto;
	width: 450px;
	padding: 25px;
	background-color: aliceblue;
	opacity: 0.5;
}
.md-raised{
	margin-left:140px;
}
</style>
