<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户账户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                :data="tableData"
                border
                class="user_table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="序号" type="index" width="50" align="center">
                <template scope="scope"><span>{{(query.pageIndex - 1) * query.pageSize + scope.$index + 1}}</span></template>
                </el-table-column>
                <el-table-column prop="human_name" width="100" label="用户名"></el-table-column>
                <el-table-column prop="user_name" width="100" label="账户名"></el-table-column>
                <el-table-column prop="phone_number" width="200" label="手机号码"></el-table-column>
                <el-table-column prop="email" width="200" label="电子邮箱"></el-table-column>
                <el-table-column prop="department" width="200" label="所在部门"></el-table-column>
                
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit()"
                        >修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog title="修改密码" :visible.sync="setPasswordVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="新密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="再次输入">
                    <el-input v-model="form.second_password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setPasswordVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
import { fetchUserData , Adduser } from '../../api/index';
import { validateEmail , stripscript } from '../../utils/validate.js'
import Qs from 'qs';
export default {
    name: 'useraccount_table',
    data() {
        return {
            query: {
                user_name: '',
                phone_number: '',
                pageIndex: 1,
                pageSize: 50,
            },
            tableData: [],
            setPasswordVisible: false,
            form: {},
        };
    },
    created() {
        this.getData();
        console.log(this.tableData);
    },
    methods: {
        // 获取 easy-mock 的模拟数据，不用json转换
        // 真实的后台数据需要json格式转换
        getData() {
            var ms_username = localStorage.getItem('ms_username')
            var data = {username : ms_username}
            this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: "/api/user_setting",
                    params: data
                }).then((response) => {
                    console.log(response)
                    var arr=[];
                    arr.push(response.data)
                    this.tableData=arr               
                })
        },

        // 修改密码
        handleEdit(index, row) {
            this.setPasswordVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.setPasswordVisible = false;
            var ms_username = localStorage.getItem('ms_username')
            var data = {
                password : this.form.password,
                second_password : this.form.second_password,
                username : ms_username
            }
            data = Qs.stringify(data)
            console.log(data)
            if (this.form.password == this.form.second_password){
                this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: "/api/setpassword",
                    data: data
                }).then((response) => {
                    this.$message.success('修改成功')
                    this.setPasswordVisible = false  // 关闭弹框     
                    this.form = ''          
                })
            }else{
                this.$message.success("两次密码不一致")
            }

        },     
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 220px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 50px 30px;
  text-align: center;
}
</style>