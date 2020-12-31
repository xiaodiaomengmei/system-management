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
            <div class="handle-box">
                <el-input v-model="query.user_name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.phone_number" placeholder="手机号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button size='small' type="primary" @click="dialogexcelVisible = true">批量导入</el-button>
                <el-button size='small' type="primary" @click="dialogexcelmodelVisible = true">excel模板</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
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
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit2(scope.$index, scope.row)"
                        >历史轨迹</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <el-button type="primary" @click="dialogTableVisible = true">添加</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="ID" style="display:none">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.human_name"></el-input>
                </el-form-item>
                <el-form-item label="账户名">
                    <el-input v-model="form.user_name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.phone_number"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="所在部门">
                    <el-input v-model="form.department"></el-input>
                </el-form-item>
                <el-form-item label="用户权限">
                    <el-radio-group v-model="resource">
                        <el-radio label="管理员"></el-radio>
                        <el-radio label="普通用户"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="历史轨迹" :visible.sync="dialogmoreTableVisible">
            <el-table :data="moreData" >
                <el-table-column prop="user_name" label="帐户名"  width="70"></el-table-column>
                <el-table-column prop="user_humanname" label="用户名"  width="80"></el-table-column>
                <el-table-column prop="client_mac" label="客户端MAC" width="120"></el-table-column>
                <el-table-column prop="client_ip" label="客户端IP" width="150"></el-table-column>
                <el-table-column prop="ap_name" label="AP名字" width="150"></el-table-column>
                <el-table-column prop="login_time" label="登录时间" width="150"></el-table-column>
                <el-table-column prop="logout_time" label="登出时间" width="150"></el-table-column>
            </el-table>
        </el-dialog>

        <!-- 添加用户弹框 -->
            <el-dialog
              title="添加用户"
              @close="addDialogClose"
              :visible.sync="dialogTableVisible"
              :close-on-click-modal="false"
            >
            <!-- 添加用户的表单 -->
              <el-form ref="addFormRef" :rules="rulesAddUser" :model="addUser" label-width="100px">
                <el-form-item prop="realname" label="用户名">
                  <el-input v-model="addUser.realname"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="账户名">
                  <el-input v-model="addUser.username"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号码">
                  <el-input v-model="addUser.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="电子邮箱">
                  <el-input v-model="addUser.email"></el-input>
                </el-form-item>
                <el-form-item prop="department" label="所在部门">
                  <el-input v-model="addUser.department"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="dialogTableVisible = false">取消</el-button>
                  <el-button type="primary" @click="onAddUser">确定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>

        <el-dialog
        title="文件上传"
        :visible.sync="dialogexcelVisible"
        width="30%"
        class="app"
        >
           <el-upload
                ref="upload"
                name="excelFile"
                :action="uploadUrl()"
                :on-success="uploadSuccess"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                :auto-upload="false"
                class="upload"
                method="post"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv">
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传excel文件,文件数量限制为1</div>
            </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogexcelVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitUpload">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="批量导入excel模板" :visible.sync="dialogexcelmodelVisible">
            <el-table :data="excelData" >
                <el-table-column prop="username" label="账户名"  width="150"></el-table-column>
                <el-table-column prop="email" label="电子邮箱"  width="150"></el-table-column>
                <el-table-column prop="phnumber" label="手机号码" width="150"></el-table-column>
                <el-table-column prop="department" label="所在部门" width="150"></el-table-column>
                <el-table-column prop="humanname" label="用户名" width="150"></el-table-column>
            </el-table>
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
        // 自定义一个手机号验证规则
        var checkMoblie = (rule, value, callback) => {
            if (!value.trim()) {
                return callback(new Error('请输入手机号'))
             }
            if (!/^1[34578]\d{9}$/.test(value)) {
                return callback(new Error('手机号有误！请重填'))
            } else {
                callback()
                }
            }
        var validate_email = (rule, value ,callback)=>{
            if  (value==''){
                return callback(new Error('请输入邮箱'));
            }else if(validateEmail(value)){
                return callback(new Error("邮箱格式有误"));
            }else{
                callback();
            }
        }

        var validate_name = (rule, value ,callback)=>{
            this.addUser.account_name=stripscript(value)
            value=this.addUser.account_name
            var reg = /^[A-Za-z0-9]+$/
            if (value==''){
                return callback(new Error('请输入账户名'));
            }else if(!reg.test(value)){
                return callback(new Error("账户名为字母加数字"));
            }else{
                callback();
            }
        }

        return {
            query: {
                user_name: '',
                phone_number: '',
                pageIndex: 1,
                pageSize: 50,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            fileList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            resource: '',
            idx: -1,
            id: -1,
            dialogTableVisible: false, // 添加用户弹框
            dialogmoreTableVisible:false,
            dialogexcelVisible:false,
            dialogexcelmodelVisible:false,
            moreData: [],
            excelData:[
                {username:'zs',
                 email:'zs@qq.com',
                 phnumber:'13845455656',
                 department:'研发部',
                 humanname:'张三',
                },
                {username:'ls',
                 email:'ls@qq.com',
                 phnumber:'13189788956',
                 department:'事业部',
                 humanname:'李四',
                }
            ],
            // 添加用户
            addUser: {
                username: '',
                realname: '',
                mobile: '',
                email: '',
                department: '',
            },
             // 验证规则
            rulesAddUser: {
                realname: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                    { validator: validate_name, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMoblie, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validate_email, trigger: ['blur', 'change']}
                ],
                department: [
                    { required: true, message: '请输入所在部门', trigger: 'blur' }
                ],
            }
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
            fetchUserData(this.query).then(res => {
                console.log(res);
                //res=JSON.stringify(res)
                //res=JSON.parse(res)
                this.tableData = res.list;
                this.pageTotal = res.pagetotal ;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            var username,phonenumber
            var list = []
            username = this.query.user_name
            phonenumber = this.query.phone_number
            this.tableData.forEach((item) => {
                if (item.phone_number == String(phonenumber) && item.human_name == String(username)) {
                    list.push(item)
                }
            })
            this.tableData = list
        },

        // 关闭弹框的回调
        addDialogClose() {
            this.$refs.addFormRef.resetFields() // 清空表单
        },
        // 点击添加用户
        onAddUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return null  // 如果验证失败就不往下继续执行
                const Qs = require('qs')
                var data = {
                    flag : "1",
                    realname: this.addUser.realname,
                    username: this.addUser.username,
                    phoneNumber: this.addUser.mobile,
                    email: this.addUser.email,
                    department: this.addUser.department,
                }
                data = Qs.stringify(data)
                console.log(data)
                this.$axios({
                    method: 'post',
                    url: "/api/user_setting",
                    data: data
                }).then((response) => {
                    this.$message.success('添加成功')
                    this.dialogTableVisible = false  // 关闭弹框
                    this.$refs.addFormRef.resetFields() // 清空表单
                
                })
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    var data = { id : this.tableData[index].id}
                    this.$axios({
                        method: 'delete',
                        url: "/api/user_setting",
                        params: data
                    }).then((response) => {
                            console.log(response)
                        })  
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            if (this.form.role=="1"){
                this.resource="管理员"
            }else{
                this.resource="普通用户"
            }
            this.editVisible = true;
        },
        handleEdit2(index, row) {
            this.idx = index;
            this.form = row;
            this.dialogmoreTableVisible=true;
            var data = {
                user_humanname : this.tableData[index].human_name,
                client_mac : this.tableData[index].client_mac
            }
            this.$axios({
                    method: 'get',
                    url: "/api/userhistorytracebyhumannameandclientmac",
                    params: data
                }).then((response) => {
                    console.log(response)
                    response.data.list.reverse()
                    this.moreData = response.data.list;
                    this.pageTotal = response.pageTotal;
                })

        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            if (this.resource=="管理员"){
                this.form.role="1"
            }else{
                this.form.role="0"
            }
            var data = {
                flag : "2",
                id : this.form.id,
                username: this.form.user_name,
                realname: this.form.human_name,
                phoneNumber: this.form.phone_number,
                email: this.form.email,
                department: this.form.department,
                role: this.form.role,
            }
            data = Qs.stringify(data)
            console.log(data)
            this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: "/api/user_setting",
                    data: data
                }).then((response) => {
                    this.$message.success('编辑成功')
                    this.editVisible = false  // 关闭弹框               
                })

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            console.log(`每页 ${val} 条`);
        },
         
        uploadUrl() {
            var url = '/api/registerforexcel'
            return url
        },
        uploadSuccess(response) {
            if (response.status == 200) {
                alert("文件导入成功");
            } else {
                alert("文件导入失败");
            }
        },
        handlePreview(file) {
        // 上传前要处理的事
            console.log(file);
        },
        handleRemove(file, fileList) {
        //文件列表移除文件
            console.log(file, fileList);
        },
        handleChange(file,fileList){
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
        },

        submitUpload() {
            this.dialogexcelVisible = false
            this.$refs.upload.submit();
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
