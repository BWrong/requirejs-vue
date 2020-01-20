define(['$', 'util', 'text!./content.html', 'data/imsmanifest'], function ($, util, template, imsmanifest) {
    Object.freeze(imsmanifest);
    return {
        name: 'scos-content',
        template: template,
        data: function () {
            return {
                nav: imsmanifest.chapter,
                content: '暂无内容！', // 知识点内容
                loadSucsess: false, // 内容是否加载成功
                showIndex: '', // 当前选择的章，针对移动端导航显示
                isShowNav: false // 是否显示导航
            };
        },
        computed: {
            // 当前章的索引
            chapterIndex: function () {
                return this.$route.query.cid - 1;
            },
            // 当前节的索引
            sectionIndex: function () {
                return this.$route.query.sid && this.$route.query.sid - 1;
            },
            // 当前知识点的索引
            wareIndex: function () {
                return this.$route.query.wid - 1;
            },
            // 当前章信息
            chapter: function () {
                var chapter = imsmanifest.chapter[this.chapterIndex];
                if (chapter) {
                    chapter.href = '/scos/list?chapter=' + (this.chapterIndex + 1);
                } else {
                    chapter = {
                        href: '',
                        chapterTitle: ''
                    };
                }
                return chapter;
            },
            // 当前节信息
            section: function () {
                if (this.chapter && this.chapter.section) {
                    return this.chapter.section[this.sectionIndex];
                }
            },
            // 当前知识点信息
            ware: function () {
                var parent = this.section || this.chapter;
                if (parent.ware) {
                    return parent.ware[this.wareIndex];
                }
                return {
                    wareTitle: '',
                    wareHref: ''
                };
            },
            // 当前章节下同级知识点列表
            wareList: function () {
                var parent = this.section || this.chapter;
                var wareList = parent.ware || [];
                var cid = this.chapterIndex + 1;
                var sid = this.sectionIndex !== undefined && this.sectionIndex + 1;
                return wareList.map(function (item, index) {
                    return {
                        title: item.wareTitle,
                        href: '/scos/content?cid=' + cid + (sid ? '&sid=' + sid : '') + '&wid=' + (index + 1)
                    };
                });
            },
            // 上一个知识点
            prev: function () {
                // 在同级存在上一个
                if (this.wareIndex) {
                    var prevWare = this.wareList[this.wareIndex - 1];
                    return {
                        prefix: '上一知识点：',
                        title: prevWare.title,
                        href: prevWare.href
                    };
                }
                // 存在节
                if (this.sectionIndex && imsmanifest.chapter[this.chapterIndex].section) {
                    var section = imsmanifest.chapter[this.chapterIndex].section;
                    var prevParent = section[this.sectionIndex - 1];
                    var temp = prevParent.ware.slice(-1);
                    temp = temp.length ? temp[0] : {};
                    return {
                        prefix: '上一知识点：',
                        title: temp.wareTitle,
                        href: '/scos/content?cid=' + (this.chapterIndex + 1) + '&sid=' + this.sectionIndex + '&wid=' + prevParent.ware.length
                    };
                }
                // 在同级不存在上一个，返回上一个父级列表
                if (this.chapterIndex) {
                    var prevChapter = imsmanifest.chapter[this.chapterIndex - 1];
                    return {
                        prefix: '上一章：',
                        title: prevChapter.chapterTitle,
                        href: '/scos/list?chapter=' + this.chapterIndex
                    };
                }
                // 没有上一个，即第一个知识点
                return {
                    title: '没有了',
                    href: this.$route.fullPath,
                    prefix: ''
                };
            },
            // 下一个知识点
            next: function () {
                // 在同级存在下一个
                if (this.wareIndex < this.wareList.length - 1) {
                    var nextWare = this.wareList[this.wareIndex + 1];
                    return {
                        prefix: '下一知识点：',
                        title: nextWare.title,
                        href: nextWare.href
                    };
                }
                // 不存在下一个，但是存在下一节
                if ( imsmanifest.chapter[this.chapterIndex] && imsmanifest.chapter[this.chapterIndex].section && this.sectionIndex < imsmanifest.chapter[this.chapterIndex].section.length - 1) {
                    var nextParent = imsmanifest.chapter[this.chapterIndex].section[this.sectionIndex + 1];
                    var temp = nextParent.ware[0];
                    return {
                        prefix: '下一知识点：',
                        title: temp.wareTitle,
                        href: '/scos/content?cid=' + (this.chapterIndex + 1) + '&sid=' + (this.sectionIndex + 2) + '&wid=1'
                    };
                }
                // 在同级不存在下一个，返回下一个父级列表
                if (this.chapterIndex < imsmanifest.chapter.length - 1) {
                    var nextChapter = imsmanifest.chapter[this.chapterIndex + 1];
                    return {
                        prefix: '下一章：',
                        title: nextChapter.chapterTitle,
                        href: '/scos/list?chapter=' + (this.chapterIndex + 2)
                    };
                }
                // 没有下一个，即最后一个知识点
                return {
                    title: '没有了',
                    href: this.$route.fullPath,
                    prefix: ''
                };
            },
            // 知识点路径
            warePath: function () {
                var wareHref = this.ware ? this.ware.wareHref : '';
                return wareHref.replace(/[^/]*(\.html?)/, '');
            },
            // 子导航
            navChildren: function () {
                var index = this.showIndex !== '' ? this.showIndex : this.chapterIndex;
                return this.nav[index] && (this.nav[index].section || this.nav[index].ware || []);
            }
        },
        created: function () {
            // 首次进入拉取知识点数据
            this.getWareContent();
        },
        methods: {
            // 获取知识点内容
            getWareContent: function (cb) {
                this.$layer.closeAll();
                this.$layer.load(2);
                var _this = this;
                var wareHref = this.ware ? this.ware.wareHref : '';
                var warePath = this.warePath;
                $.ajax({
                    type: 'get',
                    url: wareHref,
                    dataType: 'html',
                    success: function (res) {
                        _this.loadSucsess = true;
                        _this.content = _this.formatContent(warePath, res);
                        _this.$nextTick(function () {
                            require([warePath + 'assets/js/app']);
                            _this.saveViewData();
                            _this.$layer.closeAll();
                            cb && cb();
                        });
                    },
                    error: function (err) {
                        console.log(err);
                        _this.loadSucsess = false;
                        _this.content = '';
                        _this.$layer.closeAll();
                        _this.$layer.msg('知识点内容获取失败');
                    }
                });
            },
            // 清理内容多余
            formatContent: function (warePath, content) {
                // 删除meta、注释、script标签，并将修正资源路径
                var content = content.replace(/<meta\b[^<>]*?>/gi, '');
                content = content.replace(/<!--[\w\W\r\n]*?-->/gi, '');
                content = content.replace(/<script[^<>]*>(.|\n)*?<\/script>/gi, '');
                content = content.replace(/(\.\/)?assets/gm, warePath + 'assets');
                content = content.replace(/\.\/data/gm, warePath + 'data');
                return content;
            },
            // 记录浏览过的知识点
            saveViewData: function () {
                var viewedData = sessionStorage.getItem('course-scos-viewed');
                viewedData = viewedData ? JSON.parse(viewedData) : {};
                var key = this.ware.wareHref.split('/')[1];
                viewedData[key] = viewedData[key] ? viewedData[key] + 1 : 1;
                sessionStorage.setItem('course-scos-viewed', JSON.stringify(viewedData));
            },
            // 卸载模块
            destroyModule: function (url) {
                require.undef(url + 'assets/js/app');
            },
            // 切换菜单显示
            toggle: function () {
                this.showIndex = '';
                if (this.isShowNav) {
                    util.modalHelper.beforeClose();
                    this.isShowNav = false;
                } else {
                    this.showIndex = '';
                    this.isShowNav = true;
                    util.modalHelper.afterOpen();
                }
            },
            // 切换子菜单
            chang: function (index) {
                this.showIndex = index;
            },
            // 生成链接
            creatUrl: function (wid, sid) {
                var cid = this.showIndex !== '' ? this.showIndex : this.chapterIndex;
                cid++;
                wid++;
                return '/scos/content?cid=' + cid + (sid !== undefined ? '&sid=' + (sid + 1) : '') + '&wid=' + wid;
            }
        },
        // 路由更新时重新加载内容，主要在切换知识点时触发
        beforeRouteUpdate: function (to, from, next) {
            this.destroyModule(this.warePath);
            next();
            // 切换知识点时重新拉取数据
            this.getWareContent();
        },
        // 路由离开前触发，在离开知识点内容页触发
        beforeRouteLeave: function (to, from, next) {
            this.destroyModule(this.warePath);
            next();
        }
    };
});
