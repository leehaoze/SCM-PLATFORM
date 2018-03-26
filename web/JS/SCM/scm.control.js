$(function () {
    content_control.run();
    $('#particles-js').css({
        'position': 'absolute'
    });
    // document.getElementsByClassName('particles-js-canvas-el')[0].setAttribute("height",$('body').height());
    // document.getElementsByClassName('particles-js-canvas-el')[0].setAttribute("width",$('body').width());
});

var cache = {};

var content_control = {
    run: function () {
        this.loadDescription();
        this.loadCategory();
        this.loadURL();
        this.bind_menu_event();
    },
    loadDescription: function () {
        $.ajax({
            dataType: 'text',
            url: '/getDescription.form',
            success: function (data) {
                $('#description').text(data);
                removeLoading()
            }
        })
    },
    loadBackground: function () {
        $.ajax({
            dataType: 'text',
            url: '/getBackground.form',
            success: function (data) {
                var header = $('#header');
                var height = header.outerHeight(),
                    width = header.width(),
                    top = header.position()['top'],
                    margin_left = (header.outerWidth(true) - width) / 2;
                $('#header-background').css({
                    'position': 'absolute',
                    'height': height,
                    'width': width,
                    'margin-top': '5vh',
                    'margin-left': margin_left,
                    'background': 'url("' + data + '") no-repeat  center',
                    'background-size': 'cover'
                });
                //防止背景未加载完时，透过header看到隐藏在下方的菜单栏
                $('#header').css({
                    'background': 'rgba(0,0,0,0.185)'
                });
                setTimeout(function () {
                    content_control.collapse_menu();
                    $('#header').css({
                        'background': 'rgba(0,0,0,0.185)'
                    });
                    removeLoading();
                }, 100);
            }
        })
    },
    loadCategory: function () {
        $.ajax({
            dataType: 'json',
            url: '/getCategory.form',
            success: function (data) {
                $.each(data, function (index, val) {
                    var content = '<span class="category">' + val + '</span>';
                    $('#nav').append(content);
                });
                content_control.loadBackground();
                removeLoading();
            }
        });

    },
    loadURL: function () {
        $.ajax({
            dataType: 'json',
            url: '/getURL.form',
            success: function (data) {
                $.each(data, function (index, val) {
                    var content =
                        '<div class="w3-card-4">' +
                        '   <span class="module-pic"><img src="' + val['picPath'] + '"></span>' +
                        '   <h3><a href="' + val['link'] + '">' + val['title'] + '</a></h3>' +
                        '   <p class="description">' + val['description'] + '</p>' +
                        '   <span class="data">' + val['description'] + '</span>' +
                        '   <span class="module-type category">' + val['category'] + '</span>' +
                        '</div>';
                    $('#display-area').append(content);
                    if (val['picPath'] === 'null' || val['picPath'] == null) {
                        var module_pic = $('#display-area>div:last>span:first');
                        module_pic.empty();
                        module_pic.text(val['title'].slice(0, 1));
                    }
                });

                $('#display-area>div').each(function () {
                    var p = $(this).find('p');
                    var area_width = p.width() - 100;
                    var char_num = area_width / 9.7;
                    p.text($(this).find('span.data').text());
                    if ($(this).find('span.data').text().length > char_num * 3) {
                        p.empty();
                        p.append($(this).find('span.data').text().slice(0, char_num * 3 - 17) + '&nbsp<span class="read-more">Read more</span>');
                        urlCard_control.bindReadMoreListener($(this));
                    }
                });
                $('#blank_div').remove();
                if ($('#display-area>div').size() % 4 != 0) {
                    $('#display-area').append('<span id="blank_div" style="width: 22%; height: 22vh;"></span>')
                }

                content_control.windows_resize_control();
                //绑定点击事件
                setTimeout(function () {
                    category_select.listen_click();
                    removeLoading();
                }, 200);
                //告知发生变化
                filter_menu_control.onChange(true);

            }
        });
    },
    // 收起菜单栏
    collapse_menu: function () {
        var relative_menu = $('#relative-menu');
        var distance = relative_menu.height() - $('#down-button').height();
        relative_menu.css({
            'transform': 'translateY(-' + distance + 'px)'
        });
        $('#down-button>i').css({
            'transform': ' rotate(0)'
        });
        $('#display-area').css({
            'transform': 'translateY(-' + distance + 'px)'
        });
        removeLoading();
    },
    bind_menu_event: function () {
        //点击下拉按钮
        $('#down-button').click(function () {
            if (cache['menu-status'] == null || cache['menu-status'] == 'collapse') {
                $('#relative-menu').css({
                    'transform': 'translateY(0)'
                });
                $('#down-button>i').css({
                    'transform': ' rotate(180deg)'
                });
                $('#display-area').css({
                    'transform': 'translateY(0)'
                });
                cache['menu-status'] = 'down';
            }
            else {
                content_control.collapse_menu();
                cache['menu-status'] = 'collapse';
            }
        });
        //点击搜索栏
        $('#search>input').click(function () {
            $('#cancel-search').css('display', 'block');
            if ($('.category:first').attr('class').indexOf("active") == -1) {
                $('.category:first').click();
            }
        });
        //响应搜索
        $('#search>input').on('input propertychange', function () {
            var text = $(this).val().toLowerCase();
            $('#display-area>div').each(function () {
                var content = $(this).find('h3 a').text();
                // contain
                if (content.toLowerCase().indexOf(text) == -1 && content != "") {
                    $(this).css({
                        'display': 'none'
                    })
                }
                else {
                    $(this).css({
                        'display': 'block'
                    })
                }
            });
            filter_menu_control.onChange(false);
        });
        //鼠标在取消按钮上
        $('#cancel-search').hover(function () {
            $(this).removeClass('far');
            $(this).addClass('fas');
        }, function () {
            $(this).addClass('far');
            $(this).removeClass('fas');
        });
        //消除已输入的字
        $('#cancel-search').click(function () {
            $('#search>input').val("");
            filter_menu_control.onChange(false);
        });
        //相应筛选菜单点击事件
        filter_menu_control.listen_click();
        removeLoading();
    },
    windows_resize_control: function () {
        $(window).resize(function () {
            $('#display-area>div').each(function () {
                var p = $(this).find('p');
                var area_width = p.width() - 100;
                var char_num = area_width / 9.7;
                p.text($(this).find('span.data').text());
                if ($(this).find('span.data').text().length > char_num * 3) {
                    p.empty();
                    p.append($(this).find('span.data').text().slice(0, char_num * 3 - 17) + '&nbsp<span class="read-more">Read more</span>');
                    urlCard_control.bindReadMoreListener($(this));
                }
            });
            $('#blank_div').remove();
            if ($('#display-area>div').size() % 3 != 0) {
                $('#display-area').append('<span id="blank_div" style="width: 22%; height: 22vh;"></span>')
            }

            //控制遮罩
            var header = $('#header');
            var height = header.outerHeight(),
                width = header.width(),
                top = header.position()['top'],
                margin_left = (header.outerWidth(true) - width) / 2;
            $('#header-background').css({
                'position': 'absolute',
                'height': height,
                'width': width,
                'margin-top': '5vh',
                'margin-left': margin_left,
            });

        });
    }
};

var filter_menu_control = {
    onChange: function (first) {
        $('#filter-menu>span').each(function () {
            $(this).removeClass('active');
        });
        var span_all = $('#filter-menu>span:nth-child(1)');
        span_all.addClass('active');
        $('#display-area>div').each(function () {
            if ($(this).css('display') != 'none') {
                $('#filter-menu > span:nth-child(' + ($(this).find('h3 a').text().slice(0, 1).toLowerCase().charCodeAt() - 95) + ')').addClass("active");
            }
            else {
                span_all.removeClass('active');
            }
        });

        if (first) {
            //绑定不允许点击属性
            $('#filter-menu>span').each(function () {
                if ($(this).attr('class') == undefined) {
                    $(this).addClass('disable');
                }
            });
        }
    },
    listen_click: function () {
        $('#filter-menu>span').each(function () {
            $(this).click(function () {
                if ($(this).attr('class').indexOf("disable") == -1) {
                    //未激活
                    if ($(this).attr('class') == undefined || $(this).attr('class').indexOf('active') == -1) {
                        $(this).addClass('active');
                        var text = $(this).text();
                        $('#display-area>div').each(function () {
                            if (text == 'All' || $(this).find('h3 a').text().slice(0, 1).toLowerCase() == text.toLowerCase()) {
                                $(this).css('display', 'block');
                            }
                        });
                    } else {
                        $(this).removeClass('active');
                        var text = $(this).text();
                        $('#display-area>div').each(function () {
                            if (text == 'All' || $(this).find('h3 a').text().slice(0, 1).toLowerCase() == text.toLowerCase()) {
                                $(this).css('display', 'none');
                            }
                        });
                    }

                    filter_menu_control.onChange(false);
                    filter_menu_control.check_all_status();
                }
            })
        })
    },
    check_all_status: function () {
        var span_all = $('#filter-menu>span:nth-child(1)');
        span_all.addClass('active');
        $('#display-area>div').each(function () {
            if ($(this).css('display') == 'none') {
                span_all.removeClass('active');
                return;
            }
        })
    }
};

var category_select = {
    run: function () {
        this.listen_click();
    },
    listen_click: function () {
        $(".category").click(function () {

            $('.category').removeClass('active');

            var category_name = $(this).text();

            $('#nav>span').each(function () {
                if ($(this).text() == category_name) {
                    $(this).addClass('active');
                }
            });


            var all = false;
            var module_div = $('#display-area>div');
            if (category_name == "All Modules") {
                all = true;
            }
            // module_div.css('display', 'block');
            module_div.addClass('disappear');
            setTimeout(function () {
                $('#display-area>div').css('display', 'none');
                $('.temp_blank_div').each(function () {
                    $(this).remove();
                });
                var count = 0;
                $('#display-area>div').each(function () {
                    if ($(this).find('.module-type').text() == category_name || all) {
                        $(this).css('display', 'block');
                        $(this).addClass('show');
                        count += 1;
                    }
                });
                if (count % 3 != 0) {
                    $('#display-area').append('<span class="temp_blank_div" style="width: 28%; height: 22vh;"></span>')
                }

                //告知筛选菜单 元素发生变化
                filter_menu_control.onChange();

            }, 550);
            setTimeout(function () {
                $('#display-area>div').each(function () {
                    $(this).removeClass('disappear');
                    $(this).removeClass('show');
                })
            }, 1000);


        })
    }
};

var urlCard_control = {
    run: function () {

    },
    bindReadMoreListener: function (object) {
        object.find('.read-more').click(function () {
            object.find('p').text(object.find('span.data').text());
            var pre_height = object.outerHeight();
            object.css('height', pre_height);
            object.css('height', 'auto');
            var target_height = object.outerHeight();
            object.css('height', pre_height);
            console.log(target_height, object.height());
            object.animate({
                height: target_height + 'px'
            }, 200);
        })
    }
};

var count = 0;

function removeLoading() {
    count++;
    if (count == 6) {
        setTimeout(function () {
            $('#loading').fadeOut(600);
        }, 600);

    }
}


