/*globals require, exports, console, __dirname */
var fs = require('fs'),
	path = require('path'),
	uglify = require("uglify-js"),
	cssmin = require("cssmin"),
	
	
	/**
	 * Create file
	 */
	writeFile = exports.writeFile = function (toFile, fileContents) {
		if (typeof fileContents !== 'string') {
			fileContents = 'module.exports = ' + JSON.stringify(fileContents);
		}
		fs.writeFileSync(toFile, fileContents);
	},
	
	printSizeAndFile = function (size, filename) {
		var size = size.toString();
		console.log((new Array(10 - size.length)).join(' ') + size, filename)
	},
	
	/**
	 * Concat
	 */
	concat = exports.concat = function (basePath, files, toFile) {
		"use strict";
		
		toFile = path.join(basePath, toFile);
		
		var dirname = path.dirname(toFile),
			fileContents = [],
			data;
	
		if (!path.existsSync(dirname)) {
			throw new Error('"' + dirname +'" does not exists!');
		}
	
		files.forEach(function (file) {
			var filePath = path.resolve(basePath, file),
				contents;
			
			if (path.existsSync(filePath)) {
				contents = fs.readFileSync(filePath, 'utf8');
				fileContents.push({
					file: file,
					contents: contents,
					size: contents.length
				});
			} else {
				throw new Error('Error unable to find file: "' + filePath + '"');
			}
		});
		
		data = fileContents.map(function (fileContent) {
			return fileContent.contents;
		}).join('\n');
		
		// Write file
		writeFile(toFile, data);
		
		fileContents.sort(function (a, b) {
			return a.size - b.size;
		}).reverse().forEach(function (fileContent) {
			printSizeAndFile(fileContent.size, fileContent.file);
		});
		
		console.log('Concatted');
		printSizeAndFile(data.length, toFile);
	},
	
	
	/**
	 * Minify
	 */
	minify = exports.minify = function (basePath, fromFile, toFile) {
		"use strict";
		
		fromFile = path.join(basePath, fromFile);
		toFile = path.join(basePath, toFile);
		
		var dirname = path.dirname(toFile),
			extName = path.extname(toFile),
			fileContents,
			jsp,
			pro,
			ast;
	
		if (!path.existsSync(dirname)) {
			throw new Error('"' + dirname +'" does not exists!');
		}
	
		if (!path.existsSync(fromFile)) {
			throw new Error('"' + fromFile +'" does not exists!');
		}
		
		fileContents = fs.readFileSync(fromFile, 'utf8');
		
		// JS
		if (extName === '.js') {
			jsp = uglify.parser;
			pro = uglify.uglify;
			ast = jsp.parse(fileContents); // parse code and get the initial AST
			ast = pro.ast_mangle(ast); // get a new AST with mangled names
			ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
			fileContents = pro.gen_code(ast); // compressed code here
			
		// CSS
		} else if (extName === '.css') {
			fileContents = cssmin.cssmin(fileContents);
		}
		
		// Write file
		writeFile(toFile, fileContents);
		
		console.log('Minified');
		printSizeAndFile(fileContents.length, toFile)
	},
	
	
	/**
	 * Build
	 */
	build = exports.build = function (basePath, files, toFile) {
		"use strict";
		
		var extName,
			minFile;
		
		// Concat files
		concat(basePath, files, toFile);
		
		extName = path.extname(toFile);
		minFile = toFile.replace(extName, '.min' + extName);
		
		// Minify
		minify(basePath, toFile, minFile);
	},
	
	
	/**
	 * Find in dir
	 */
	findInDir = exports.findInDir = function (dir, extname) {
		"use strict";
		
		var files = [];
		fs.readdirSync(dir).forEach(function (file) {
			var filePath = path.join(dir, file),
				stat = fs.statSync(filePath);
			
			if (stat.isDirectory()) {
				
				files = files.concat(findInDir(filePath, extname));
				
			} else if (stat.isFile() && path.extname(file) === extname) {
				files.push(filePath);
			}
		});
		
		return files;
	};