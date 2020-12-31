<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> SSID权限
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                :data="tableData"
                border
                class="ssid_table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" width="200" label="ID" v-if='show'></el-table-column>
                <el-table-column prop="ssid" width="200" label="SSID"></el-table-column>
                <el-table-column prop="mode" width="100" label="角色"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="dialogTableVisible = true">添加</el-button>
        </div>

        <!-- 添加ssid弹框 -->
        <el-dialog
            title="添加SSID"
            @close="addDialogClose"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
        >
            <!-- 添加ssid的表单 -->
            <el-form ref="addFormRef" :rules="rulesAddssid" :model="addssid" label-width="100px">
                <el-form-item prop="ssid" label="SSID">
                  <el-input v-model="addssid.ssid"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="resources">
                        <el-radio label="员工"></el-radio>
                        <el-radio label="访客"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="dialogTableVisible = false">取消</el-button>
                  <el-button type="primary" @click="onAddssid">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="SSID">
                    <el-input v-model="form.ssid"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="resource">
                        <el-radio label="员工"></el-radio>
                        <el-radio label="访客"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchssidData } from '../../api/index.js';
import Qs from 'qs';
export default {
    name: 'ssid_table',
    data() {
        return {
            query:{},
            dialogTableVisible:false,
            addssid:{},
            tableData:[],
            form:{},
            resource: '',
            resources: '',
            editVisible: false,
            show: false,
            rulesAddssid: {
                ssid: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                authority: [
                    { required: true, message: '请输入角色', trigger: 'blur' }
                ],
            }
        };
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            fetchssidData(this.query).then(res => {
                console.log(res);
                //res=JSON.stringify(res)
                //res=JSON.parse(res)
                res.forEach((item) => {
                    if (item.mode=="0") {
                        item.mode = "访客"
                    } else {
                        item.mode = "员工"
                    }
                })
                this.tableData = res;
            });
        },
        // 关闭弹框的回调
        addDialogClose() {
            this.$refs.addFormRef.resetFields() // 清空表单
        },
        onAddssid() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return null  // 如果验证失败就不往下继续执行
                const Qs = require('qs')
                var data = {
                    flag : "1",
                    ssid: this.addssid.ssid,
                    mode: this.resources,
                }
                var dates = {
                    ssid: this.addssid.ssid,
                    mode: this.resources,
                }
                this.tableData.push(dates)
                if (data.mode=="员工"){
                    data.mode = "1"
                }else{
                    data.mode = "0"
                }
                data = Qs.stringify(data)
                console.log(data)
                this.$axios({
                    method: 'post',
                    url: "/api/ssid_setting",
                    data: data
                }).then((response) => {
                    this.$message.success('添加成功')
                    this.dialogTableVisible = false  // 关闭弹框
                    this.$refs.addFormRef.resetFields() // 清空表单
                
                })
            })
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    var data = { ssid : this.tableData[index].ssid}
                    this.$axios({
                        method: 'delete',
                        url: "/api/ssid_setting",
                        params: data
                    }).then((response) => {
                            console.log(response)
                        })  
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            if (this.form.mode=="员工"){
                this.resource="员工"
            }else{
                this.resource="访客"
            }
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            if (this.resource=="员工"){
                this.form.mode="员工"
            }else{
                this.form.mode="访客"
            }
            var data = {
                flag : "2",
                id : this.form.id,
                ssid : this.form.ssid,
                mode: this.form.mode,
            }
            if (this.resource=="员工"){
                data.mode="1"
            }else{
                data.mode="0"
            }
            data = Qs.stringify(data)
            console.log(data)
            this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: "/api/ssid_setting",
                    data: data
                }).then((response) => {
                    this.$message.success('编辑成功')
                    this.editVisible = false  // 关闭弹框               
                })

        },
    }
};
</script>

<style scoped>

</style>