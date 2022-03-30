const setting = {
  //导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: 'dark',
  //顶部
  headerSetting: {
    //背景色
    bgColor: '#fff',
    //固定顶部
    fixed: true,
    //显示重载按钮
    isReload: true,
  },
  //页脚
  showFooter: true,
  //菜单
  menuSetting: {
    //最小宽度
    minMenuWidth: 64,
    //菜单宽度
    menuWidth: 200,
    //固定菜单
    fixed: true,
    //分割菜单
    mixMenu: false,
    collapsed: false
  },
  //面包屑
  crumbsSetting: {
    //是否显示
    show: true,
    //显示图标
    showIcon: false,
  },
  //是否开启路由动画
  isPageAnimate: true,
  //路由动画类型
  pageAnimateType: 'zoom-fade',
};
export default setting;
