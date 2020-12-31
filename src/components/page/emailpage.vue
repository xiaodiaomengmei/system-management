<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 邮件
                </el-breadcrumb-item>
                <el-breadcrumb-item>邮件模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                <div class="sender">
                    <span class="onebyone">发送信息</span>
                    <el-form-item label="发送邮件">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="发送密码">
                        <el-input v-model="form.passwd"></el-input>
                    </el-form-item>
                    <el-form-item label="smtp地址">
                        <el-input v-model="form.smtpaddress"></el-input>
                    </el-form-item>
                    <el-form-item label="端口号">
                        <el-input v-model="form.port"></el-input>
                    </el-form-item>
                </div>
                <div class="receivers">
                    <span class="twobytwo">接收信息</span>
                    <el-form-item label="接收人">
                        <el-input v-model="form.recipient"></el-input>
                    </el-form-item>
                    <el-form-item label="抄送人">
                        <el-input v-model="form.copyperson"></el-input>
                    </el-form-item>
                    <el-form-item label="邮件标题">
                        <el-input v-model="form.headline"></el-input>
                    </el-form-item> 
                    <el-form-item label="发送周期">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="每天" name="type"></el-checkbox>
                            <el-checkbox label="每周" name="type"></el-checkbox>
                            <el-checkbox label="每月" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>         
                </div>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交信息</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchEmailData } from '../../api/index';
import Qs from 'qs';
export default {
    name: 'baseform',
    data() {
        return {
            query: {
                mac: '',
                pageIndex: 1,
                pageSize: 10
            },
            form: {
                email: '',
                passwd: '',
                smtpaddress: '',
                port: '',
                recipient: '',
                copyperson: '',
                headline: '',
                region: '',
                type:[],
                id: '',
                delivery: true,
                desc: '',
                body: '',
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            var daysend,weeksend,monthsend
            fetchEmailData(this.query).then(res => {
                console.log(res);
                this.form.email = res["send_address"];
                this.form.passwd = res["send_password"];
                this.form.smtpaddress = res["smtp_host"];
                this.form.port = res["smtp_port"]
                this.form.recipient = res["receiver_address"]
                this.form.copyperson = res["cc_address"]
                this.form.headline = res["subject"]
                this.form.id = res["id"]
                this.form.body = res["body"]
                daysend = res["day_send"]
                weeksend = res["week_send"]
                monthsend = res["month_send"]
                if (daysend=="YES"){
                    this.form.type.push("每天")
                };
                if(weeksend=="YES"){
                    this.form.type.push("每周")
                };
                if(monthsend=="YES"){
                    this.form.type.push("每月")
                };
            });    
        },
        onSubmit() {
            const Qs = require('qs')
            var data = {
                id: this.form.id,
                send_address: this.form.email,
                send_password: this.form.passwd,
                smtpaddress: this.form.smtpaddress,
                port: this.form.port,
                recipient: this.form.recipient,
                copyperson: this.form.copyperson,
                headline: this.form.headline,
                time_type:  this.form.type,
                body: this.form.body,
            }
            data = Qs.stringify(data)
            console.log(data)
            this.$axios({
                method: 'post',
                url: "/api/email_setting",
                data: data
            }).then((response) => {
                this.$message.success('修改成功')
            })
        },
    }
};
</script>

<style scoped>
.sender{
    border:3px;
    solid:#000;
    margin-bottom:50px;
}
.receivers{
    border:3px;
    solid:#000;
    margin-top:50px;
}
.onebyone{
    height:30px;
    text-align:center;
    display:block;
    font-size:16px;

}
.twobytwo{
    height:30px;
    text-align:center;
    display:block;
    font-size:16px;
}
</style>