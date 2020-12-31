<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <div class='sub'>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                        </div>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
            <div class='version'>当前版本:V1.0.6</div>
        </el-menu>
        
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-peoplefill',
                    index: 'useraccount_table',
                    title: '账户管理',
                },
                {
                    icon: 'el-icon-lx-peoplefill',
                    index: 'usernowtrace_table',
                    title: '登录信息'
                },
                {
                    icon: 'el-icon-lx-wifi',
                    index: '2',
                    title: '设备管理',
                    subs: [
                        {
                            index: 'device_table',
                            title: '设备配置'
                        },
                        {
                            index: 'global_configuration',
                            title: '全局配置'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: 'email_table',
                    title: '邮件参数'
                },
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
.version {
    width: 200px;
    font-size: 14px;
    height: 100px;
    color: #efefef;
    text-align: left;
    line-height: 25px;
    padding-left: 20px;
    padding-top: 15px;
    margin-top: 570px
}
.sub {
    padding-left: 20px
}
</style>
