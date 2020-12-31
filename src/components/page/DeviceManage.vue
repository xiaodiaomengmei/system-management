<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.wan_mac" placeholder="WAN MAC地址" class="handle-input mr10"></el-input> 
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="序号" type="index" width="50" align="center">
                <template scope="scope"><span>{{(query.pageIndex - 1) * query.pageSize + scope.$index + 1}}</span></template>
                </el-table-column>
                <el-table-column prop="name" width="150" label="名称"></el-table-column>
                <el-table-column prop="address" width="200" label="安装位置"></el-table-column>
                <el-table-column label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='在线'?'success':(scope.row.state==='离线'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="wan_mac" width="130" label="WAN MAC"></el-table-column>
                <el-table-column prop="wan_ip" width="120" label="WAN IP"></el-table-column>
                <el-table-column prop="lan_mac" width="130" label="LAN MAC"></el-table-column>
                <el-table-column prop="lan_ip" width="120" label="LAN IP"></el-table-column>
                <el-table-column prop="uptime" width="200" label="上线时长(秒)">
                    <template slot-scope="scope">
                        <span> {{scope.row.uptime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')}}</span>
                    </template>
                    
                </el-table-column>
                
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
                        <el-button
                            type="text"
                            icon="el-icon-star-off"
                            class="black"
                            @click="handleconfig(scope.$index, scope.row)"
                        >配置下发</el-button>
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
            <el-form ref="form" :model="form" label-width="80px">
                 <el-form-item label="ID" style="display:none">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="WAN MAC">
                    <el-input v-model="form.wan_mac"></el-input>
                </el-form-item>
                <el-form-item label="部署位置">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="制造厂家">
                    <el-input v-model="form.manufacture"></el-input>
                </el-form-item>
                <el-form-item label="型号">
                    <el-input v-model="form.model"></el-input>
                </el-form-item>
                <el-form-item label="序列号">
                    <el-input v-model="form.ens"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">.
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加设备弹框 -->
            <el-dialog
              title="添加设备"
              @close="addDialogClose"
              :visible.sync="dialogTableVisible"
              :close-on-click-modal="false"
            >
            <!-- 添加设备的表单 -->
              <el-form ref="addFormRef" :rules="rulesAddDevice" :model="addDevice" label-width="100px">
                <el-form-item prop="name" label="名称">
                  <el-input v-model="addDevice.name"></el-input>
                </el-form-item>
                <el-form-item prop="wan_mac" label="WAN MAC">
                  <el-input v-model="addDevice.wan_mac"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="部署位置">
                  <el-input v-model="addDevice.address"></el-input>
                </el-form-item>
                <el-form-item prop="manufacture" label="制造厂家">
                  <el-input v-model="addDevice.manufacture"></el-input>
                </el-form-item>
                <el-form-item prop="model" label="型号">
                  <el-input v-model="addDevice.model"></el-input>
                </el-form-item>
                <el-form-item prop="ens" label="序列号">
                  <el-input v-model="addDevice.ens"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="dialogTableVisible = false">取消</el-button>
                  <el-button type="primary" @click="onAddDevice">确定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>

             <!-- 配置下发弹出框 -->
        <el-dialog title="配置下发" :visible.sync="configurationVisible" width="30%">
            <el-form ref="form" :model="configuration" label-width="80px">
                <el-form-item label="WAN IP" >
                    <el-input v-model="configuration.wan_ip" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="LAN IP">
                    <el-input v-model="configuration.lan_ip"></el-input>
                </el-form-item>
                <el-form-item label="SSID">
                    <el-input v-model="configuration.ssid"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">.
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveConfigruation">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchDeviceData } from '../../api/index';
import Qs from 'qs';
export default {
    name: 'ApDevice_table',
    data() {
        return {
            query: {
                wan_mac: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            configuration: {},
            form2: {},
            idx: -1,
            id: -1,
            dialogTableVisible: false,
            configurationVisible: false,
            addDevice: {
                name: '',
                wan_mac: '',
                address: '',
                manufacture: '',
                model:'',
                ens:'',
            },
            rulesAddDevice: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                wan_mac: [
                    { required: true, message: '请输入物理地址', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入部署位置', trigger: 'blur' },
                ],
                manufacture: [
                    { required: true, message: '请输入制造厂家', trigger: 'blur' }
                ],
                model: [
                    { required: true, message: '请输入型号', trigger: 'blur' }
                ],
                ens: [
                    { required: true, message: '请输入序列号', trigger: 'blur' }
                ],
                }
            }
        },
    created() {
        this.getData();
    },
    methods: {
        // 关闭弹框的回调
        addDialogClose() {
            this.$refs.addFormRef.resetFields() // 清空表单
        },
        // 点击添加用户
        onAddDevice() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return null  // 如果验证失败就不往下继续执行
                const Qs = require('qs')
                var data = {
                    flag : "1",
                    name: this.addDevice.name,
                    wan_mac: this.addDevice.wan_mac,
                    address: this.addDevice.address,
                    manufacture: this.addDevice.manufacture,
                    model: this.addDevice.model,
                    ens: this.addDevice.ens,
                }
                data = Qs.stringify(data)
                console.log(data)
                this.$axios({
                    method: 'post',
                    url: "/api/ap_setting",
                    data: data
                }).then((response) => {
                    this.$message.success('添加成功')
                    this.dialogTableVisible = false  // 关闭弹框
                    this.$refs.addFormRef.resetFields() // 清空表单
                })
            })
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchDeviceData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pagetotal;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            var wan_mac
            var list = []
            wan_mac = this.query.wan_mac
            this.tableData.forEach((item) => {
                if (item.wan_mac == String(wan_mac)) {
                    list.push(item)
                }
            })
            this.tableData = list
        },
        handleconfig(index,row) {
            this.configurationVisible = true
            this.form2 = row
            this.configuration.wan_ip = this.form2.wan_ip
            console.log(this.configuration.wan_ip)
        },
        //配置下发
        saveConfigruation() {
            var data = {
                wan_ip : this.configuration.wan_ip,
                ssid : this.configuration.ssid,
                lan_ip : this.configuration.lan_ip
            }
            data = Qs.stringify(data)
            console.log(data)
            this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: "/api/apconfig",
                    data: data
                }).then((response) => {
                    this.$message.success('配置下发成功')
                    this.configurationVisible = false  // 关闭弹框               
                })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    console.log(this.tableData[index].id)
                    var data = { id : this.tableData[index].id}
                    this.$axios({
                        method: 'delete',
                        url: "/api/ap_setting",
                        params: data
                    }).then((response) => {
                            console.log(response)
                        })  
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
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
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            var data = {
                flag : "2",
                id: this.form.id,
                name: this.form.name,
                wan_mac: this.form.wan_mac,
                address: this.form.address,
                manufacture: this.form.manufacture,
                model: this.form.model,
                ens: this.form.ens,
            }
            data = Qs.stringify(data)
            console.log(data)
            this.$axios({
                    headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: "/api/ap_setting",
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
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
