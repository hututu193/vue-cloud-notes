<template>
  <div id="login">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="main"></div>
          <div class="form">
            <!-- 创建账户 -->
            <h3 @click="showRegister">创建账户</h3>
            <transition name="slide">
              <div v-bind:class="{show: isShowRegister}" class="register">
                <input type="text" 
                v-model="registerForm.username" 
                placeholder="用户名"/>

                <input type="password" 
                v-model="registerForm.password" 
                @keyup.enter="onRegister" 
                placeholder="密码"/>

                <p v-bind:class="{error: registerForm.isError}"> {{registerForm.notice}}</p>
                <div class="button" @click="onRegister">创建账号</div>
              </div>
            </transition>
            <!-- 登录 -->
            <h3 @click="showLogin">登录</h3>
            <transition name="slide">
              <div v-bind:class="{show: isShowLogin}" class="login">
                
                <input type="text" 
                v-model="loginForm.username" 
                placeholder="输入用户名"/>
                <input type="password" 
                v-model="loginForm.password" 
                @keyup.enter="onLogin"  
                placeholder="密码"/>

                <p v-bind:class="{error: loginForm.isError}"> {{loginForm.notice}}</p>
                <div class="button" @click="onLogin"> 登录</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    </div>
 
</template>

<script setup>
  import {reactive, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter() // 在 setup 中获取 router 实例
const userStore = useUserStore() // 使用 store
  // Auth.getInfo()
  //   .then(data => console.log(data))
  defineOptions({
    name: 'Login'
  })

  const isShowLogin = ref(true)
  const isShowRegister = ref(false)
  const loginForm = reactive({
          username: '',
          password: '',
          notice: '输入用户名和密码',
          isError: false
        })
  
  const registerForm = reactive({
          username: '',
          password: '',
          notice: '创建账号后，请记住用户名和密码',
          isError: false
        })
  
  const showRegister = () =>{
    isShowLogin.value = false
    isShowRegister.value = true
  }

  const showLogin = () =>{
    isShowLogin.value = true
    isShowRegister.value = false
  }

  const onRegister = async () =>{
    if(!/^[\w\u4e00-\u9fa5]{3,15}$/.test(registerForm.username)){
      registerForm.isError = true
      registerForm.notice = '用户名3~15个字符，仅限于字母数字下划线中文'
      return
    }
    if(!/^.{6,16}$/.test(registerForm.password)){
      registerForm.isError = true
      registerForm.notice = '密码长度为6~16个字符'
      return
    }
    
    try {
      userStore.register({
        username: registerForm.username,
        password: registerForm.password})

      registerForm.isError = false
      registerForm.notice = ''
      router.push({ path: '/notebooks' })
    } catch (error) {
      registerForm.isError = true
    registerForm.notice = error.response?.data?.msg || '注册失败'
    } 
  }

  const onLogin =async () =>{
    if(!/^[\w\u4e00-\u9fa5]{3,15}$/.test(loginForm.username)){
          loginForm.isError = true
          loginForm.notice = '用户名3~15个字符，仅限于字母数字下划线中文'
          return
        }
        if(!/^.{6,16}$/.test(loginForm.password)){
          loginForm.isError = true
          loginForm.notice = '密码长度为6~16个字符'
          return
        }
    
        try {
    // 调用 userStore 的 login 方法
          await userStore.login({
            username: loginForm.username,
            password: loginForm.password
          })
          
          loginForm.isError = false
          loginForm.notice = ''
          // router.push({ path: '/notebooks' })

          const redirect = route.query.redirect || '/notebooks'
router.push(redirect)

        } catch (error) {
          loginForm.isError = true
          loginForm.notice = error.response?.data?.msg || '登录失败'
        }
}
  

</script>

<style lang="less">
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .7);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 800px;
  height: 500px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;
  .main {
    flex: 1;
    background: #36bc64 url(../assets/cheese.svg) center center no-repeat;
    background-size: contain;
  }
  .form {
    width: 270px;
    border-left: 1px solid #ccc;
    overflow: hidden;
    h3 {
      padding: 10px 20px;
      margin-top: -1px;
      font-weight: normal;
      font-size: 16px;
      border-top: 1px solid #eee;
      cursor: pointer;
      &:nth-of-type(2){
        border-bottom: 1px solid #eee;
      }
    }
    .button {
      background-color: #2bb964;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      border-radius: 4px;
      margin-top: 18px;
      cursor: pointer;
    }
    .login,.register {
      padding: 0px 20px;
      border-top: 1px solid #eee;
       height: 0;
       overflow: hidden;
       transition: height .4s;
       &.show {
        height: 193px;
       }
      input {
        display: block;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        margin-top: 10px;
      }
      input:focus {
        border: 3px solid #9dcaf8;
      }
      p {
        font-size: 12px;
        margin-top: 10px;
        color: #444;
      }
      .error {
        color: red;
      }
    }
    .login {
      border-top: 0;
    } 
  }
}
</style>