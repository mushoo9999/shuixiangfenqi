// banner移动
function resizeBanner() {
    var oWidth = $('.imgs li').eq(0).width();
    var cWidth = $(window).width();
    if (cWidth < 1200) {
        cWidth = 1200
    }
    var dWidth = (oWidth - cWidth) / 2;
    $('.imgs li').css('margin-left', -dWidth);
}

//banner
function carousel() {
    var num = $('.circles li').length;
    var _index = 0;
    var timer_banner = null;
    var start_banner = false;

    $('.imgs li:gt(0)').hide();

    //底部小图标切换
    $('.circles li').click(function() {
        $(this).addClass('liActive').siblings('li').removeClass('liActive');
        var $index = $('.circles li').index(this);

        $('.imgs li').eq($index).fadeIn(800).siblings('li').fadeOut(800);

        _index = $index;

    });

    //点击左边切换

    $('.btn-left').click(function() {
        if (!start_banner) {
            start_banner = true;
            moveLeft();
        }
    });

    //点击右边切换
    $('.btn-right').click(function() {
        if (!start_banner) {
            start_banner = true;
            moveRight();
        }

    });

    //自动切换
    function moveAuto() {
        timer_banner = setInterval(function() {
            moveRight();
        }, 4000);
    }
    moveAuto();

    //鼠标移动到banner上时停止播放
    $('.banner').mouseover(function() {
        clearInterval(timer_banner);
    });

    //鼠标离开 banner 开启定时播放
    $('.banner').mouseout(function() {
        moveAuto();
    });



    //左边
    function moveLeft() {

        if (_index == 0) {
            _index = num;
        }

        $('.imgs li').eq(_index - 1).fadeIn(800, function() { start_banner = false; }).siblings('li').fadeOut(800);

        $('.circles li').eq(_index - 1).addClass('liActive').siblings('li').removeClass('liActive');

        _index--;

    }

    //右边
    function moveRight() {
        if (_index == num - 1) {
            _index = -1;
        }

        $('.imgs li').eq(_index + 1).fadeIn(800, function() { start_banner = false; }).siblings('li').fadeOut(800);

        $('.circles li').eq(_index + 1).addClass('liActive').siblings('li').removeClass('liActive');

        _index++;
    }
}

// 直线进度条
function lineProgress() {
    $('.line-progress').each(function() {
        var progress = $(this).find('strong').text();
        if (progress == '100%') {
            $(this).find('.line-bottom').css('background-image', 'none');
            $(this).siblings('.item-btn').addClass('item-btn-disabled').text('还款中');
        } else {
            $(this).find('.line-bottom').css('background-image', 'url(img/index_line.png)');
            $(this).siblings('.item-btn').removeClass('item-btn-disabled').text('立即加入');
        }
        $(this).find('.line-top').animate({
            'left': progress
        }, 1000);
    });
}

//动态和公告
function news() {
    $('.index-news-title li').on('click', function() {
        $(this).addClass('title-active').siblings().removeClass('title-active');
        if ($(this).hasClass('title-dynamics')) {
            $('.news-dynamics').show();
            $('.news-notice').hide();
        } else {
            $('.news-dynamics').hide();
            $('.news-notice').show();
        }
    });
}
