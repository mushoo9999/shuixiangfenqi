function getIPAdress(){  //获取IP
    var interfaces = require('os').networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
}  
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var banner = '/**\n\n@Author: <%= pkg.author %>\n@Version: <%= pkg.version %>\n@Date: <%=  grunt.template.today("yyyy-mm-dd") %>\n\n*/\n';
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        meta: {
            basePath: '../',
            srcPath: '../src/**/sass',
            deployPath: '../src/**/css'
        },
        //js检测
        jshint: {
            options: {
                //大括号包裹
                curly: true,
                //对于简单类型，使用===和!==，而不是==和!=
                eqeqeq: false,
                //对于首字母大写的函数（声明的类），强制使用new
                newcap: false,
                //禁用arguments.caller和arguments.callee
                noarg: true,
                //对于属性使用aaa.bbb而不是aaa['bbb']
                sub: true,
                //查找所有未定义变量
                undef: false,
                //查找类似与if(a = 0)这样的代码
                boss: true,
                //指定运行环境为node.js
                node: false
            },
            //具体任务配置
            files: {
                src: ['src/**/js/*.js']
            }
        },
        //js压缩器
        uglify: {
            js: {
                options: {
                    //压缩后生成首行注释
                    banner: banner
                },
                files: [{
                    expand: true, //如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                    cwd: "src", //需要处理的文件所在的目录。
                    src: '**/*.js', //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
                    dest: 'build/', //表示处理后的文件名或所在目录。
                    ext: ".js" //指定后缀名
                }]
            },
            js_all: { //方案
                options: {
                    //压缩后生成首行注释
                    banner: banner
                },
                files: [{
                    expand: true, //如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                    cwd: "temp", //需要处理的文件所在的目录。
                    src: '*.js', //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
                    dest: 'build/js', //表示处理后的文件名或所在目录。
                    ext: ".min.js" //指定后缀名
                }]
            }
        },
        //css压缩器
        cssmin: {
            css: {
                options: {
                    banner: '/* My minified css file */'
                },
                files: [{
                    expand: true, //如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                    cwd: "src", //需要处理的文件所在的目录。
                    src: '**/*.css', //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
                    dest: 'build/', //表示处理后的文件名或所在目录。
                    ext: ".css" //指定后缀名
                }]
            },
            css_all: { //方案
                options: {
                    banner: '/*!\n\n<%= pkg.author %>\n<%= pkg.version %>\n<%=  grunt.template.today("yyyy-mm-dd") %>\n\n*/\n'
                },
                files: [{
                    expand: true, //如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                    cwd: "temp", //需要处理的文件所在的目录。
                    src: '**/*.css', //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
                    dest: 'build/css', //表示处理后的文件名或所在目录。
                    ext: ".min.css" //指定后缀名
                }]
            }
        },
        //合并
        concat: {
            options: {
                //文件内容的分隔符
                separator: '\n//我是分割线\n'
            },
            js: {
                src: ['src/**/*.js'],
                dest: 'temp/my.js'
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'temp/my.css'
            }
        },
        //复制
        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.{html,gif}',
                    dest: 'build/'
                }]
            }

        },
        //删除 
        clean: {
            temp: {
                files: [{
                    src: ['temp/']
                }]
            },
            source: {
                files: [{
                    src: ['build/*']
                }]
            }
        },
        //sass
        sass: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/css/*.scss'],
                    dest: 'src/',
                    ext: '.css'
                }]
            }
        },
        //监控
        watch: {
            main: {
                options: {
                    livereload: true
                },
                files: [ //下面文件的改变就会实时刷新网页
                    'src/**/*.html',
                    'src/**/css/*.css',
                    'src/**/js/*.js',
                    'src/**/img/*.{png,jpg}'
                ]
            },
            sass: {
                files: ['src/**/css/*.{scss,sass}'],
                tasks: ['sass:main']
            }
        },

        //开服务器
        connect: {
            options: {
                port: 3000,
                hostname: getIPAdress(), //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: true //声明给 watch 监听的端口
            },
            server: {
                options: {
                    //  keepalive:true,
                    open: true, //自动打开网页 http://
                    base: [
                        'src/' //主目录
                    ]
                }
            }
        },
        //图片压缩
        // imagemin: {
        //     dist: {
        //         options: {
        //             optimizationLevel: 3 //定义 PNG 图片优化水平
        //         },
        //         files: [
        //                {
        //             expand: true,
        //             cwd: 'src/',
        //             src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
        //             dest: 'build/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
        //             }
        //             ]
        //         }
        //     }
    });
    // 任务列表。
    grunt.registerTask('js', ['jshint', 'uglify:js']);
    grunt.registerTask('css', ['cssmin:css']);
    grunt.registerTask('work', ['connect', 'watch']);
    grunt.registerTask('ok', ['copy', 'cssmin:css', 'jshint', 'uglify:js']);
    grunt.registerTask('js_all', ['jshint', 'concat:js', 'uglify:js_all', 'clean:temp']);
    grunt.registerTask('css_all', ['concat:css', 'cssmin:css_all', 'clean:temp']);
}
