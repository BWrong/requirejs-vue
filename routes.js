/* path可以不填，不填就由系统自动生成，生成规则如下：
/* 一级栏目：column+栏目序号
/* 二级栏目：item+栏目序号
*/
define({
    indexName: '课程首页', // 首页的导航名字
    scosName: '课程学习', // 课程内容学习页面的导航名字
    mainRoutes: [{    // 全局页面配置
        path: '/introduction',
        title: '课程概况',
        sort: 0,    // 排序索引，默认0
        children: [{
            path: 'kcjs',
            title: '课程介绍'
        }, {
            path: 'jxdg',
            title: '教学大纲'
        },
        {
            path: 'jxjh',
            title: '教学计划'
        }]
    }, {
        path: '/source',
        title: '教学资源',
        sort: 0,
        children: [{
            path: 'jxsp',
            title: '教学视频'
        }, {
            path: 'jxdh',
            title: '教学动画'
        }, {
            path: 'ppt',
            title: 'PPT课件'
        }, {
            path: 'dzja',
            title: '电子教案'
        }, {
            path: 'syzd',
            title: '实验指导'
        }]
    }, {
        path: '/jptk',
        title: '解剖图库',
        sort: 1,
        children: [{
            path: 'index',
            title: '解剖图库',
            isHide: true
        }]
    }, {
        path: '/lcbx',
        title: '临床表现',
        sort: 1,
        children: [{
            path: 'lcjc',
            title: '临床检查与操作'
        },
        {
            path: 'lclx',
            title: '各系统临床联系'
        }]
    },{
        path: '/exam',
        title: '综合自测',
        sort: 1,
        children: [{
            path: 'exam1',
            title: '综合自测一'
        },{
            path: 'exam2',
            title: '综合自测二'
        }]
    }, {
        path: '/teacher',
        title: '研发团队',
        sort: 1,
        children: [{
            path: 'group',
            title: '协作组'
          },
          {
            path: 'team',
            title: '教学团队'
          },
          {
            path: 'support',
            title: '技术支持'
          }]
    }]
});
