<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户登录汇总数据
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.user_name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.client_mac" placeholder="终端MAC" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="usertracebrief_table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column label="序号" type="index" width="50" align="center">
                <template scope="scope"><span>{{(query.pageIndex - 1) * query.pageSize + scope.$index + 1}}</span></template>
                </el-table-column>
                <el-table-column prop="human_name" width="100" label="用户名"></el-table-column>
                <el-table-column prop="user_name" width="100" label="账户名"></el-table-column>
                <el-table-column label="当前状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='在线'?'success':(scope.row.state==='离线'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ap_name" width="150" label="AP名称"></el-table-column>
                <el-table-column prop="ap_address" width="200" label="AP位置"></el-table-column>
                <el-table-column prop="client_mac" width="130" label="终端MAC"></el-table-column>
                <el-table-column prop="client_ip" width="150" label="终端IP"></el-table-column>
                <el-table-column prop="uptime" width="180" label="登录时间"></el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
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
        </div>
    
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

        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow" >确 定</el-button>
            </span>
        </el-dialog>
    
    </div>
</template>

<script>
import { fetchUserNowTraceData,fetchUserHistoryTraceData } from '../../api/index';
import Qs from 'qs';
export default {
    name: 'usernowtrace_table',
    data() {
        return {
            query: {
                user_name: '',
                client_mac: '',
                pageIndex: 1,
                pageSize: 50
            },
            tableData: [],
            moreData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            dialogmoreTableVisible:false,
            delVisible: false,
            arr: [],
            list:[],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchUserNowTraceData(this.query).then(res => {
                console.log(res);
                if (res.list != null){
                    this.tableData = res.list;
                    this.pageTotal = res.pagetotal;
                }else{
                    let list = []
                    this.tableData = list
                }
            });
        },
        
        // 触发搜索按钮
        handleSearch() {
            var username,clientmac
            var list = []
            username = this.query.user_name
            clientmac = this.query.client_mac
            this.tableData.forEach((item) => {
                if (item.client_mac == String(clientmac) && item.human_name == String(username)) {
                    list.push(item)
                }
            })
            this.tableData = list
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
                        url: "/api/usernowtrace",
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
            console.log(this.multipleSelection)
        },
        delAllSelection() {
            this.delVisible = true;//显示删除弹框
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
                this.delList.push(this.multipleSelection[i].id)
            }
            this.multipleSelection = [];
            console.log(this.delList)
        },
        deleteRow(){
            var arr,index
            const length=this.delList.length
            var data = {}
            for (let i=0;i<length;i++) {
                data[String(i)] = this.delList[i]
            }
            this.$axios({
                method: 'get',
                url: '/api/delbatch',
                params:data,
        
            }).then(res=>{
                this.getData()
                this.$message.success('删除成功')
            })
            this.delVisible = false         
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            //指定跳转地址
            //this.$router.replace('/usertraceverbose_table')
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
</style>

