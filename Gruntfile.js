module.exports = function(grunt) {
	grunt.initConfig({	
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				//文件内容的分隔符
				separator: ';',
				//去除块注释
				stripBanners: true,
				banner: '/*!- <%= pkg.name %>.js - v<%= pkg.version %>- ' + 
				 '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			 },
			js: {
				src: ['src/js/transition.js','src/js/modal.js','src/js/draggabilly.js','src/js/modalDom.js'],//js的引入顺序要注意
				dest: 'dist/assets/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner:  '/*!- <%= pkg.name %>.min.js - v<%= pkg.version %>- ' + 
			 	'<%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
			},
			build: {// 压缩不混淆变量名，保留注释，添加banner和footer
				options: {
					mangle: false, //不混淆变量名
					preserveComments: false, //删除注释，还可以为 all（保留注释），some（保留@preserve @license @cc_on等注释）
					footer:'\n/*! <%= pkg.name %>.min.js 最后修改于：'+
					' <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
				},
				files: {
					'dist/assets/js/<%= pkg.name %>.min.js': ['dist/assets/js/<%= pkg.name %>.js']
				}
			}
		},
		htmlhint: { //检查index.html文件
			build: {
				options: {
					'tag-pair': true,//HTML标记是否配对
					'tagname-lowercase': true,//标记名和属性名是否小写
					'attr-lowercase': true,
					'attr-value-double-quotes': true,//属性值是否包括在双引号之中
					'spec-char-escape': true,//特殊字符是否转义
					'id-unique': true,//HTML元素的id属性是否为唯一值
					'head-script-disabled': true,//head部分是否没有script标记
				},
				src: ['*.html']
			}
		},
		autoprefixer: {//该模块用于为CSS语句加上浏览器前缀。
			options: {
				browsers: [  "Chrome >= 20", "Firefox >= 24", "Explorer >= 7","Opera >= 12", "Safari >= 6"],
			},
			 build: {
				expand: true,
				cwd: 'dist/assets/css/', //需要处理的文件（input）所在的目录。
				src: [ '*.css', '!*.min.css' ],//表示需要处理的文件。
				dest: 'dist/assets/css' //表示处理后的文件名或所在目录。
			}
		},
		less: { 
			compileCore: {
				options: {
					banner: '/*!-<%= pkg.name %>.css - v<%= pkg.version %>- ' + 
					 '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
					compress: false,
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>.css.map',
					sourceMapFilename: 'dist/assets/css/<%= pkg.name %>.css.map',//创建map用于浏览器调试less
				},
				expand: true,
				cwd:'src/less',//需要处理的文件（input）所在的目录。
				src: ['<%= pkg.name %>.less'],  //表示需要处理的文件。
				dest: 'dist/assets/css',
				ext: '.css'
			},
		},
		cssmin: {//cssmin模块的作用是最小化CSS文件。	
			minify: {//“minify”，用于压缩css文件；
				expand: true,//如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
				cwd: 'dist/assets/css/',//需要处理的文件（input）所在的目录。
				src: ['*.css', '!*.min.css'], //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，
																						 //可以使用通配符。
				dest: 'dist/assets/css/', //表示处理后的文件名或所在目录。
				ext: '.min.css'//表示处理后的文件后缀名。
			},
		},
		csscomb: {//该模块用于为CSS属性排序和书写规范。              
			options: {
				config: 'grunt/csscomb.json'
			},
			files: {
				expand: true,
				cwd: 'dist/assets/css', //需要处理的文件（input）所在的目录。
				src: [ '*.css', '!*.min.css' ],//表示需要处理的文件。
				dest: 'dist/assets/css' //表示处理后的文件名或所在目录。
			}
		},
		csslint: {//css代码检查
			// “build”中描述了csslint要检查哪些css文档的语法。
			 build: [ 'dist/assets/css/*.css','!dist/assets/css/*.min.css'  ],
			 //“options”中描述了要通过怎么的规则检查语法，这些规则的描述文件就保存在网站根目录下的一个
			 //叫做“.csslintrc”的文件中。
			 options:{
				csslintrc:'grunt/.csslintrc'
			}
		},
		jshint: {//js代码检查
			// “build”中描述了jshint要检查哪些js文档的语法。
			build: [ 'Gruntfile.js','src/js/*.js' ],
			 //“options”中描述了要通过怎么的规则检查语法，这些规则的描述文件就保存在网站根目录下的一个
			 //叫做“.jshintrc”的文件中。
			options:{
				jshintrc:'grunt/.jshintrc'
			 }
 		},
		imagemin: {/* 压缩图片大小 */
			dist: {
				options: {
					optimizationLevel: 3,//定义 PNG 图片优化水平							
					},
				files: [{
					expand: true,
					cwd: 'src/imgs/',
					src: ['**/*.{png,jpg,jpeg,gif}'], // 优化 img 目录下所有 png/jpg/jpeg/gif图片,
					dest: 'dist/assets/imgs/' // 优化后的图片保存位置,
				}]
			}
		},
		copy: { //用于复制文件与目录。简单复制只需src和dest就行了。
			main: {//准确控制拷贝行为，比如只拷贝文件、不拷贝目录、不保持目录结构如下
				expand: true,
				cwd: 'dist/',
				src: '**',
				dest: 'code/',
				flatten: true,
				filter: 'isFile',
			},
			ico: {
				expand: true,
				cwd: 'src/imgs/',
				src: '*.ico',
				dest: 'dist/assets/imgs/',
				flatten: true,
				filter: 'isFile',
			 },
		},
		clean: {
			build: {//该模块用于删除文件或目录
				expand: true,
				src: [ 'code/**']
			}
		},
		watch: {//watch 可以监控特定的文件，在添加文件、修改文件、或者删除文件的时候自动执行自定义的任务
			 less: {    //用于监听less文件,当改变时自动编译成css文件
				files: ['src/less/**.less','src/less/**/**.less'],
				tasks: ['less'],
				options: {
					livereload: true,
				}
			},
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('go',['watch']);
	grunt.registerTask('cp','copy:main');
	grunt.registerTask('decp','clean');
	grunt.registerTask('js','jshint');
	grunt.registerTask('acss',['autoprefixer', 'csscomb','csslint','cssmin']);
	grunt.registerTask('default',['copy:ico','imagemin','htmlhint','concat','uglify','less', 'csscomb','csslint','cssmin']);
}