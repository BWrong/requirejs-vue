define(['vue','vueSwiper','vueLazyload','text!./list.html', 'data/imsmanifest'], function (vue,vueSwiper,vueLazyload, template, imsmanifest) {
    'use strict';
    vue.use(vueLazyload, {
        loading: './assets/img/loading.svg'
    });
    Object.freeze(imsmanifest);
    return {
        name: 'scos-list',
        template: template,
        data: function () {
            return {
                courseName: imsmanifest.courseName || '', // 课程名称
                chapterIndex: 0, // 当前第几章
                chapter: imsmanifest.chapter || [], // 章列表
                swiperOption: {
                    slidesPerView: 'auto',
                    navigation: {
                        nextEl: '.btn-next-chapter',
                        prevEl: '.btn-prev-chapter'
                    }
                }
            };
        },
        computed: {
            // 当前章的知识点或者节
            children: function () {
                return this.chapter[this.chapterIndex].ware || this.chapter[this.chapterIndex].section || [];
            },
            // 章标题
            chapterTitle: function () {
                return this.chapter[this.chapterIndex].chapterTitle || '';
            },
            // 获取swiper实例
            chapterSwiper: function () {
                return this.$refs.chapterSwiper.swiper;
            }
        },
        deactivated: function () {
            this.chapterIndex = 0;
        },
        created: function () {
            this.$isMobile && this.redirectFirst(); //移动端重定向到第一个知识点
            // 从url获取当前的章
            this.chapterIndex = this.$route.query.chapter ? this.$route.query.chapter - 1 : 0;
        },
        mounted: function () {
            // 定位swiper到当前章
            this.chapterSwiper.slideTo(this.chapterIndex, 0, false);
        },
        filters: {
            split: function (str, index) {
                return str.split(' ')[index];
            }
        },
        methods: {
            // 切换章
            selectChaper: function (index) {
                this.chapterIndex = index;
                this.$router.push('/scos/list' + '?chapter=' + (index + 1));
            },
            // 判断是不是三级结构，返回对应数据
            createWare: function (item) {
                // 三级结构返回知识点，否则封装成数组返回，统一结构，方便模板调用
                return item.ware || new Array(item);
            },
            // 生成知识点链接,此处以index+1作为id，传入query参数
            creatScoHref: function (hasSection, index, subindex) {
                var cid = this.chapterIndex + 1;
                var wid = hasSection ? subindex + 1 : index + 1;
                return '/scos/content?cid=' + cid + (hasSection ? '&sid=' + (index + 1) : '') + '&wid=' + wid;
            },
            // 是否已浏览
            isViewed: function (item) {
                var viewedData = sessionStorage.getItem('course-scos-viewed');
                viewedData = viewedData ? JSON.parse(viewedData) : {};
                var key = item.wareHref.split('/')[1];
                return viewedData[key];
            },
            // 重定向到第一个知识点
            redirectFirst: function () {
                var firstChapter = this.chapter[0];
                var chapter = this.$route.query.chapter || 1;
                if (!firstChapter) {
                    alert('课程目录错误！');
                    return;
                }
                var url = firstChapter.section ? '/scos/content?cid=' + chapter + '&sid=1&wid=1' : '/scos/content?cid=' + chapter + '&wid=1';
                this.$router.replace(url);
            }
        },
        components: {
            swiper: vueSwiper.swiper,
            swiperSlide: vueSwiper.swiperSlide
        }
    };
});
