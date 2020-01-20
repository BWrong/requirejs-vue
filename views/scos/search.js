define(['vue','vueLazyload','layer','text!./search.html', 'data/imsmanifest'], function (vue,vueLazyload, layer,template, imsmanifest) {
    'use strict';
    vue.use(vueLazyload, {
        loading: './assets/img/loading.svg'
    });
    Object.freeze(imsmanifest);
    return {
        name: 'scos-search',
        template: template,
        data: function () {
            return {
                perPage: 6
            };
        },
        computed: {
            searchResult: function () {
                if (!this.$route.query.keyword) {
                    layer.msg('请输入搜索关键词！');
                }
                var chapter = imsmanifest.chapter;
                var self = this;
                var result = [];
                chapter.map(function (chapterItem,chapterIndex) {
                    if (chapterItem.section) {
                        chapterItem.section.map(function (sectionItem, sectionIndex) {
                            result = result.concat(self.getSearchResult(sectionItem,chapterIndex,sectionIndex));
                        });
                    } else {
                        result = result.concat(self.getSearchResult(chapterItem,chapterIndex));
                    }
                });
                return result;
            },
            totalPage: function () {
                return Math.ceil(this.searchResult.length / this.perPage);
            }
        },
        methods: {
            /**
             *  获取符合搜索条件的数据
             * @param {*} data
             * @param {*} chapterId
             * @param {*} sectionId
             */
            getSearchResult: function (data, chapterIndex, sectionIndex) {
                var keyword = this.$route.query.keyword,
                    result = [];
                data.ware.map(function (wareItem,wareIndex) {
                    if (wareItem.wareTitle.indexOf(keyword) !== -1) {
                        wareItem.chapterIndex = chapterIndex;
                        if (sectionIndex !== undefined) {
                            wareItem.sectionIndex = sectionIndex;
                        }
                        wareItem.wareIndex = wareIndex;
                        result.push(wareItem);
                    }
                });
                // this.$refs.page && this.$refs.page.change(1);
                return result;
            },
            highlight: function (value) {
                var keyword = this.$route.query.keyword;
                return value.replace(new RegExp(keyword, 'g'), '<span class="keyword">' + keyword + '</span>');
            },
            getNowPageList: function (page) {
                var start = (page - 1) * this.perPage;
                return this.searchResult.slice(start,start + this.perPage);
            },
            // 生成知识点链接,此处以index+1作为id，传入query参数
            creatScoHref: function (chapterIndex, sectionIndex, wareIndex) {
                return '/scos/content?cid=' + (chapterIndex + 1) + (sectionIndex !== undefined ? '&sid=' + (sectionIndex + 1) : '') + '&wid=' + (wareIndex + 1);
            },
            // 是否已浏览
            isViewed: function (item) {
                var viewedData = sessionStorage.getItem('course-scos-viewed');
                viewedData = viewedData ? JSON.parse(viewedData) : {};
                var key = item.wareHref.split('/')[1];
                return viewedData[key];
            }
        }
    };
});
