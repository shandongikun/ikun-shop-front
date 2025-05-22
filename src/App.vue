<template>
  <div id="app">
    <router-link to="/">首页</router-link>
	<router-link to="/my-shop">我的店铺</router-link>
	<router-link to="/prin">按钮</router-link>
    <router-view></router-view> <!-- 必须存在 -->
  </div>
</template>