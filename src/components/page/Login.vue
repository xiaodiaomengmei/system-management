<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">拟态安全WAC管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import Qs from 'qs';
import sha1 from 'sha1';
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (!valid){
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
                const Qs = require('qs')
                var data = {
                    username:this.param.username,
                    password:sha1(this.param.password),
                },
                data = Qs.stringify(data)
                console.log(data)
                this.$axios({
                    method: 'post',
                    url: "/api/admin_login",
                    data: data
                }).then((response) => {
                    console.log(response)
                    localStorage.setItem('ms_username', this.param.username);
                    if (response.data.code == '2000'){
                        this.$message.success('登录成功');
                        localStorage.setItem('token', '123456');
                        if (this.param.username == 'redmatrix'){
                            this.$router.push('/');
                        }else{
                            this.$router.push('/private');
                        }
                    }
                    if (response.data.code == '2001'){
                        this.$message.success('用户不存在');
                    }
                })
            })
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 500px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
    font-size: 25px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 45px;
    margin-bottom: 10px;
    font-size: 25px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>