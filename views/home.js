define(['vueSwiper', 'text!./home.html', 'css!~/css/home.css'], function (vueSwiper, template) {
    'use strict';
    return {
        name: 'home',
        template: template,
        data: function () {
            return {
            };
        },
        components: {
            swiper: vueSwiper.swiper,
            swiperSlide: vueSwiper.swiperSlide
        },
        computed: {
            swiperOption: function () {
                return {
                    // effect: 'fade',
                    loop: true,
                    autoplay: {
                        delay: 5000
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                };
             }
        }
    };
});
