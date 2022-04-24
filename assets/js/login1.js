$(function (){
    // 点击'去注册账号'的链接
    $('#link_reg').on('click',function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
});
$(function (){
    //点击 '去登录账号'的链接
    $('#link_login').on('click',function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 账号验证
    // 从 layui中获取 form.
    var form = layui.form;
    form.verify({
        username: function (value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if(value === 'xxx'){
                alert('用户名不能为敏感词');
                return true;
            }
        }
    });
    //  密码验证
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个 pwd 校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格']

    });
    form.verify({
        // 注册密码确认
        repwd: function(value){
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value){
                return '两次密码不一致！';
            }
        }
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        //2.发起Ajax 的post请求
        let  data = {
            username:$('#form_reg [name = username]').val(),
            password:$('#form_reg [name = password]').val()
        };
        $.post('/api/reguser',data,function (res){
            if (res.status !== 0) {
                console.log(res.message)
                return layer.msg(res.message);
            }
            layer.msg("注册成功,请登录！");
            // 模拟人为点击返回 登录页面
            $('#link_login').click();
        });
    });
    //监听登录表的提交事件
    $('#form_login').submit(function (e) {
        //1.阻止默认的提交行为
        e.preventDefault();
        //2.发起Ajax请求
        console.log($(this).serialize());
        $.ajax({
            url:'/api/login',
            method:'post',
            data:$(this).serialize(),
            success: function (res) {
                    if (res.status !== 0 ){
                        return layer.msg('登录失败！');
                    }
                    layer.msg("登录成功！");
                    // 将登录成功得到的token字符串，保存到localStorage中
                    localStorage.setItem('token', res.token);
                    // 跳转到后台主页
                location.href = '/index.html';
                }
        })
    })
});